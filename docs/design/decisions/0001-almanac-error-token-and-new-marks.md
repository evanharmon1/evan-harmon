# DDR-0001 — Error token + new brand marks, heroes & form components

- **Status:** Accepted
- **Date:** 2026-06-18
- **Design version:** `1.0.0` → `1.1.0` (minor — additive, no breaking changes)
- **Source:** Claude Design handoff bundle
  `docs/design/Evan Harmon Design System (Almanac)-handoff.zip`

## Context

The repo already implemented the Almanac design system almost in full (it was
rebuilt from an earlier version of this same export — commit `8423cd8`). A fresh
export of the system was handed off. Diffing the bundle against the canonical
`src/styles/globals.css` showed the tokens matched ~95%; the bundle added one new
token and a set of components the repo did not yet have. This is the first
recorded design decision, so it also **establishes the DDR convention and pins the
baseline at `1.0.0`** (the shipped system) and this change at `1.1.0`.

## Decision

Adopt the genuinely-new parts of the export, additively:

1. **New token `--c-error`** — madder/oxblood `#9e2b1e` (Parchment) / terracotta
   `#e08a7a` (Midnight). Exposed as `--color-error`; the one sanctioned non-accent
   hue, reserved for form validation. Wired into the `@layer base` form styles
   (`[aria-invalid]` keyline + `.field-error` note + `.field-label[data-invalid]`).
2. **New components** ported to typed Astro (the repo's UI is all-Astro; no React
   island needed): brand marks **Crest** + **Bookplate**; alternate heroes
   **HeroFrontispiece** + **HeroPlate**; form components **Tag** + **Input**.
   **Button** was extended (`size="sm"`, `disabled`, generic `glyph`).
3. **`.btn` family consolidated into `globals.css`** as the single source of truth
   (moved out of `Button.astro`'s scoped style) so the hero colour-block overrides
   (`.cover-inlay .btn`) can reach the buttons. Shared hero scaffolding
   (`.hero/.kicker/.sun/.corners/.book-cover/.cover-inlay/.plate/.device/.monogram`)
   also lives in `globals.css`, alongside the existing `.catalog`/`.ledger` classes.
4. All new pieces are **showcased on `/brand`** (Ceremonial marks, Heroes, Forms).

## Conflicts resolved

- **Midnight `--c-cta-line`.** The bundle emits `#d8b45a`; the repo deliberately
  overrode it to `#e9ad3a` (vivid gilt gold) with an explicit code comment. Per
  "`globals.css` is the canonical runtime source," **the repo value is kept** — the
  bundle proposal is not applied here.
- **Default theme.** The bundle frames Midnight as the `:root` default; the repo
  expresses Parchment as `:root` but `ThemeScript` always sets `data-palette` and
  defaults to Midnight, so the runtime behaviour already matches. No change.

## Notable choices

- **Token-driven SVG marks.** Crest/Bookplate drive their gilt from
  `var(--color-gold)` (CSS) rather than the bundle's `theme` prop, so they follow
  the Parchment ⇄ Midnight switch automatically and pass the contrast gate.
- **No new assets.** All four fonts remain self-hosted Google Fonts (OFL/Apache);
  iconography stays brand SVG/Unicode; the bundle's `flammarion.jpeg` is unused in
  layout and was not imported.

## Consequences

- Static contrast gate extended: `error` on `paper`/`paper-2` checked at AA (text)
  in both themes — Parchment 6.00:1 / 5.31:1, Midnight 6.76:1 / 6.11:1.
- No breaking changes: every existing token and component is unchanged; the live
  homepage (Celestial hero) is untouched. The two new heroes ship for reuse and
  the `/brand` showcase only.
