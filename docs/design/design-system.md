# Design System — The Almanac

How the brand is implemented in code. A human-facing companion to the canonical,
build-facing [`DESIGN.md`](../../DESIGN.md) and the live reference at **`/brand`**.

## Stack

Astro 6 · Tailwind CSS v4 (CSS-first) · TypeScript · React + shadcn/ui (available
for interactive islands) · self-hosted `@fontsource` fonts · deploys static.

## Tokens & theming

`src/styles/global.css` is the **single source of truth** for runtime colour.

- Semantic colour tokens (`--c-paper`, `--c-ink`, `--c-accent`, …) are defined
  per theme and **swap at runtime** off `data-palette` on `<html>`
  (`"parchment"` | `"midnight"`).
- An `@theme` block exposes them as Tailwind utilities (`bg-paper`, `text-accent`,
  `border-line`, `font-display`, `text-section`, …), so every utility is
  theme-aware automatically.
- A thin **shadcn role layer** (`--background`/`--foreground`/`--primary`/…) maps
  onto the same Almanac tokens, so any shadcn component renders on-brand and
  follows the same theme switch.
- `--c-error` (madder on light, terracotta on dark) carries form validation — the
  invalid-field keyline and the `.field-error` note — and is the one sanctioned
  non-accent hue.

**Theme switching:** `ThemeScript.astro` sets the palette before first paint
(defaulting to Midnight; a saved choice wins); `ThemeToggle.astro` flips and
persists it in `localStorage`.

## Type scale & spacing

Fluid `clamp()` sizes live in `@theme` (`--text-hero`, `--text-cta`,
`--text-section`, `--text-numeral`, …). Layout uses a centred container
(`min(1140px, 92vw)`), a section rhythm of `clamp(2.25rem, 4.5vw, 4rem)`, and a
"rail" grid that puts the section numeral + title up the left gutter, collapsing
to a centred header below 1024 px.

## Components

Bespoke Astro components live in `src/components/almanac/`:

- **Chrome:** `Header` (sticky gilt bar, gilt-circle theme/RSS/menu buttons),
  `Footer`, `BrandMark`, `ThemeToggle`, `ThemeScript`.
- **Ornaments:** `Divider`, `Flourish`, `RuleOrn`, `SectionAside` (the rail
  numeral/title), `PageHeading` (top-aligned page titles).
- **Sections:** `Hero`, `About`, `Projects` (engraved catalog), `Blog` + `Ledger`,
  `Contact`, `SocialIcon`, `PostImage`.
- **Marks & forms** (showcased on `/brand`, available for reuse): `Crest` (the
  ceremonial seal), `Bookplate` (the "Ex Libris" plate), `Tag`, `Input` (with the
  `invalid`/`error` state), `Button` (`default|solid|invert|ghost`, `sm`,
  disabled), and the two alternate heroes `HeroFrontispiece` / `HeroPlate`.

Cross-cutting classes (`.catalog`, `.ledger`, `.cta--bold`, `.sec-grid`, …) live
in `global.css`; leaf components carry their own scoped styles. shadcn primitives
go under `src/components/ui/` and use `cn()` from `src/lib/utils.ts`.

## Pages

`/` (single-page Almanac home) · `/blog` + `/blog/<slug>` + `/blog/tag/<tag>` ·
`/now` · `/about` · `/contact` · `/brand` (the live style guide) · `/404` ·
`/privacy`, `/terms`. Blog posts are an Astro content collection in
`src/data/post/`; helpers live in `src/utils/blog.ts`.

## Quality gates

- **`task lint:design`** — checks the canonical files exist, bans off-palette
  Tailwind colour utilities, and runs a **static WCAG token-contrast gate**
  (`test/check-contrast.mjs`) over the palette in both themes.
- **Contrast is verified twice:** the static token gate above, plus a rendered
  measurement on the running page (token math alone misses third-party overrides
  — that's how an illegible dark-mode prose colour once slipped through).
- **`task check` / `pnpm check`** — Astro check + ESLint + Prettier.

## Accessibility

WCAG AA (4.5:1) for text, verified at both token and rendered levels; visible
focus rings on all interactive elements; decorative motion gated behind
`prefers-reduced-motion`; icon buttons ≥ 40 px.
