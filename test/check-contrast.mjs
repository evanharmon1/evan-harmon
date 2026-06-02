#!/usr/bin/env node
// check-contrast.mjs — static WCAG contrast gate for the Almanac design tokens.
//
// Parses the semantic colour tokens out of src/styles/global.css (both themes)
// and checks the foreground/background pairs the design relies on against WCAG
// AA. This is the FAST, STATIC half of the contrast story: it proves the tokens
// themselves are sound. It does NOT prove what actually paints on the page —
// a third-party cascade layer can still override a token at runtime — so the
// rendered/computed contrast must ALSO be measured on the running pages.
//
// Usage: node test/check-contrast.mjs   (exit 1 on any failure)

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cssPath = join(__dirname, '..', 'src', 'styles', 'global.css');
const css = readFileSync(cssPath, 'utf8');

// --- WCAG relative luminance + contrast ratio ---
function srgbToLin(c) {
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}
function luminance([r, g, b]) {
  return 0.2126 * srgbToLin(r) + 0.7152 * srgbToLin(g) + 0.0722 * srgbToLin(b);
}
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const n =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
}
function contrast(a, b) {
  const L1 = luminance(hexToRgb(a));
  const L2 = luminance(hexToRgb(b));
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

// --- extract a theme's tokens from its declaration block ---
function tokens(selector) {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`token block not found: ${selector}`);
  const block = css.slice(start, css.indexOf('}', start));
  const out = {};
  for (const m of block.matchAll(/--c-([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,6})\s*;/g)) {
    out[m[1]] = m[2];
  }
  return out;
}

// Midnight inherits any token it doesn't override from :root / Parchment
// (e.g. the fixed warm-white cta-ink / cta-body don't swap by theme).
const parchment = tokens("[data-palette='parchment']");
const THEMES = {
  Parchment: parchment,
  Midnight: { ...parchment, ...tokens("[data-palette='midnight']") },
};

// [fg, bg, min, required]. min 4.5 = normal text; 3.0 = large text / non-essential
// meta / UI graphics. required=false → reported but not gating (decorative gilt:
// gold-on-paper is intentionally low-contrast and exempt per WCAG for decoration).
const PAIRS = [
  ['ink', 'paper', 4.5, true],
  ['ink-soft', 'paper', 4.5, true],
  ['ink', 'paper-2', 4.5, true],
  ['ink-soft', 'paper-2', 4.5, true],
  ['accent', 'paper', 4.5, true], // eyebrows, links, numerals
  ['cta-ink', 'cta-2', 4.5, true], // block heading on the lighter end of the block
  ['cta-body', 'cta-2', 4.5, true], // block body
  ['ink-faint', 'paper', 3.0, true], // muted meta (non-essential / large)
  ['gold', 'paper', 3.0, false], // gilt accents — decorative, advisory only
];

let failed = 0;
const lines = [];
for (const [theme, t] of Object.entries(THEMES)) {
  for (const [fg, bg, min, required] of PAIRS) {
    if (!t[fg] || !t[bg]) {
      lines.push(`  ?  ${theme}: ${fg}/${bg} — token missing`);
      if (required) failed++;
      continue;
    }
    const ratio = contrast(t[fg], t[bg]);
    const ok = ratio >= min;
    if (!ok && required) failed++;
    const mark = ok ? '✓' : required ? '✗' : '·';
    const tag = required ? '' : ' (decorative, advisory)';
    lines.push(`  ${mark}  ${theme}: ${fg} on ${bg} = ${ratio.toFixed(2)}:1 (need ${min}:1)${tag}`);
  }
}

console.log('Token contrast (WCAG AA):');
console.log(lines.join('\n'));
if (failed) {
  console.error(`\n✗ ${failed} required token pair(s) below contrast — fix the palette.`);
  process.exit(1);
}
console.log('\n✓ all required token pairs pass (decorative accents reported, not gated)');
