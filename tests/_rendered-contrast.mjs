// One-off rendered-contrast probe for the design-handoff verification gate.
// Loads the RUNNING site in both themes and reports WCAG ratios for the new
// surfaces plus the colour-block hero text (the line a regression once hit).
// Every colour is resolved to 0–255 RGB via an in-page canvas, so any CSS colour
// syntax works. Colour-block text sits on a gradient, so it is measured against a
// sampled block pixel. Run: node tests/_rendered-contrast.mjs  (needs preview on :4321)
import { chromium } from 'playwright';

const BASE = 'http://localhost:4321';

function srgbToLin(c) {
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}
const lum = ([r, g, b]) => 0.2126 * srgbToLin(r) + 0.7152 * srgbToLin(g) + 0.0722 * srgbToLin(b);
const ratio = (a, b) => {
  const [L1, L2] = [lum(a), lum(b)];
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
};

// solid-surface probes on /brand (composited over nearest opaque ancestor bg)
const flatProbes = [
  { sel: '.field-error', label: 'error note text', min: 4.5 },
  { sel: '.field-label', label: 'field label (small-caps meta)', min: 3.0 },
  { sel: '.almanac-field input', label: 'input value text', min: 4.5 },
  { sel: '.almanac-tag.tone-accent', label: 'tag (accent)', min: 4.5 },
  { sel: '.almanac-tag.tone-faint', label: 'tag (faint, meta)', min: 3.0 },
  { sel: '.lead', label: 'lead paragraph', min: 4.5 },
  { sel: '.hero-plate .tagline', label: 'plate tagline (on paper)', min: 4.5 },
];

// colour-block text — measured against a sampled pixel of the block gradient.
// `block` is the ancestor whose painted bg to sample.
const brandBlockProbes = [
  { sel: '.hero-frontispiece .cover-inlay .tagline', block: '.cover-inlay', label: 'frontispiece tagline', min: 4.5 },
  { sel: '.hero-frontispiece .cover-inlay .eyebrow', block: '.cover-inlay', label: 'frontispiece eyebrow', min: 4.5 },
  { sel: '.hero-plate .plate .monogram b', block: '.device', label: 'plate monogram (accent)', min: 3.0 },
];
const homeBlockProbes = [
  { sel: '#top .cover-title', block: '.cta--bold', label: 'home wordmark', min: 3.0 },
  { sel: '#top .tagline', block: '.cta--bold', label: 'home tagline (on block)', min: 4.5 },
];

const fgOf = (locator) =>
  locator.evaluate((e) => {
    const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    ctx.fillStyle = getComputedStyle(e).color;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  });

async function sampleBlockProbe(page, p) {
  const el = page.locator(p.sel).first();
  if ((await el.count()) === 0) return console.log(`  ?  ${p.label}: not found`);
  const fg = await fgOf(el);
  const block = page.locator(p.block).first();
  const buf = await ((await block.count()) ? block : el).screenshot();
  const bg = await page.evaluate(
    async (dataURL) => {
      const img = new Image();
      await new Promise((res) => {
        img.onload = res;
        img.src = dataURL;
      });
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(6, 6, 1, 1).data; // corner = block bg, away from text
      return [d[0], d[1], d[2]];
    },
    'data:image/png;base64,' + buf.toString('base64')
  );
  const cr = ratio(fg, bg);
  console.log(`  ${cr >= p.min ? '✓' : '✗'}  ${p.label}: ${cr.toFixed(2)}:1 (need ${p.min}) fg=${fg} bg≈${bg}`);
}

const browser = await chromium.launch();
for (const [label, palette] of [
  ['Parchment', 'parchment'],
  ['Midnight', 'midnight'],
]) {
  console.log(`\n=== ${label} ===`);
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  await page.addInitScript((p) => localStorage.setItem('almanac-theme', p), palette);

  // /brand — flat probes + brand block probes
  await page.goto(`${BASE}/brand`, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  const flat = await page.evaluate((probes) => {
    const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    const resolve = (css) => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = '#000';
      ctx.fillStyle = css;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2], d[3] / 255];
    };
    const opaqueBg = (el) => {
      let n = el;
      while (n) {
        const bg = resolve(getComputedStyle(n).backgroundColor);
        if (bg[3] >= 0.95) return [bg[0], bg[1], bg[2]];
        n = n.parentElement;
      }
      const b = resolve(getComputedStyle(document.body).backgroundColor);
      return [b[0], b[1], b[2]];
    };
    return probes.map((p) => {
      const el = document.querySelector(p.sel);
      if (!el) return { ...p, missing: true };
      const fg = resolve(getComputedStyle(el).color);
      return { ...p, fg: [fg[0], fg[1], fg[2]], bg: opaqueBg(el) };
    });
  }, flatProbes);
  for (const r of flat) {
    if (r.missing) {
      console.log(`  ?  ${r.label}: not found (${r.sel})`);
      continue;
    }
    const cr = ratio(r.fg, r.bg);
    console.log(`  ${cr >= r.min ? '✓' : '✗'}  ${r.label}: ${cr.toFixed(2)}:1 (need ${r.min}) fg=${r.fg} bg=${r.bg}`);
  }
  for (const p of brandBlockProbes) await sampleBlockProbe(page, p);

  // / — the live colour-block hero
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  for (const p of homeBlockProbes) await sampleBlockProbe(page, p);

  await page.close();
}
await browser.close();
