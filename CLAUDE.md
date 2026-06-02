# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal website for Evan Harmon (<https://evanharmon.com>) — **"The Almanac"**, an aged-paper /
woodcut-engraving brand with dual **Parchment** (light) and **Midnight** (dark) themes. Built on
**Astro 5 + Tailwind CSS v4 + TypeScript**, with **React + shadcn/ui** available for interactive
islands. Output is fully `static` (SSG). Package manager is **pnpm**.

The design is documented in **`DESIGN.md`** (AI-facing intent). The **canonical runtime token source
is `src/styles/global.css`** — when the two disagree, `global.css` wins.

## Commands

Day-to-day development uses pnpm scripts; `task` wraps lint/security/CI workflows.

```bash
pnpm dev             # local dev server (astro dev)
pnpm build           # production build to dist/
pnpm preview         # preview built site
pnpm check           # astro check + eslint + prettier --check
pnpm fix             # eslint --fix + prettier -w

task validate        # pre-commit run --all-files, then pnpm check
task lint:design     # assert DESIGN.md + global.css exist, ban off-palette colour utilities, then build
task security        # secret scan (whispers) + SAST (snyk test / snyk code)
task fix             # pnpm fix
```

There is **no unit-test suite** — "testing" here means `task validate` / `task lint:design` /
`task security`, plus building and viewing the site. Requires Node >= 21 and pnpm.

## Architecture

This is a hand-built Astro site (it was rebuilt off the AstroWind starter — that scaffolding,
its config-driven `astrowind:config` integration, and `tailwind.config.js` are gone).

- **Tailwind v4 is CSS-first.** There is **no** `@astrojs/tailwind` integration; it's the Vite
  plugin (`@tailwindcss/vite` in `astro.config.ts`) plus `@import "tailwindcss"` inside
  `src/styles/global.css`, imported once from `src/layouts/Layout.astro`.
- **`src/styles/global.css`** is the heart: semantic `--c-*` tokens that swap per theme (via the
  `data-palette` attribute on `<html>`), an `@theme` block exposing them as Tailwind utilities
  (`bg-paper`, `text-accent`, `font-display`, `text-section`, …), a thin **shadcn role layer**
  (`--background`/`--foreground`/`--primary`/… → `--c-*`), base styles, `@utility` helpers
  (`engraved`, `gilt-ring`, `eyebrow`, `wrap`, …), and the shared section-level component CSS.
- **`~`** is the Vite alias for `src/`.
- **Theme switch:** `ThemeScript.astro` sets `data-palette` before paint (reads
  `localStorage["almanac-theme"]`, falls back to `prefers-color-scheme`); `ThemeToggle.astro` flips
  and persists it. `dark:` and all token utilities follow automatically.

### Content & blog

- Blog posts live in **`src/data/post/`** as `.md`/`.mdx`. The content collection is defined in
  `src/content/config.ts` (Astro `glob` loader + Zod schema: `title`, `publishDate`, `category`,
  `tags`, `excerpt`, `image`, `metadata`, `draft`, …). Frontmatter must satisfy the schema or the
  build fails.
- Blog routing: **`src/pages/blog/index.astro`** (the ledger) and **`src/pages/blog/[...slug].astro`**
  (posts at `/blog/<slug>`, rendered via `src/layouts/MarkdownPostLayout.astro`). Helpers live in
  `src/utils/blog.ts` (`getPosts`, `postHref`, `toLedger`). RSS at `src/pages/rss.xml.ts`.
- Reading time is injected via `readingTimeRemarkPlugin` in `src/utils/frontmatter.ts` (wired in
  `astro.config.ts` `markdown`).

### Pages & components

- **`src/pages/`** — `index.astro` (the single-page Almanac homepage), `blog/`, `about.astro`,
  `contact.astro`, `404.astro`, `privacy.md` / `terms.md` (via `MarkdownLayout.astro`), `rss.xml.ts`.
- **`src/components/almanac/`** — the bespoke Astro UI: `Header`, `Hero`, `About`, `Projects`,
  `BlogLedger`, `Contact`, `Footer`, plus primitives (`Button`, `BrandMark`, `Divider`, `RuleOrn`,
  `SectionHead`, `SocialIcon`, `ThemeScript`, `ThemeToggle`). Leaf components carry scoped `<style>`;
  cross-cutting classes (`.catalog`, `.ledger`, `.cta--bold`, `.display`, …) live in `global.css`.
- **`src/components/ui/`** — shadcn/ui React components (e.g. `button.tsx`), wired to the Almanac
  token bridge. `src/lib/utils.ts` exports `cn()`. Config in `components.json`. Use these only for
  client-interactive islands; the site's own UI is Astro.
- **`src/data/site.ts`** — site-wide content/links (`SITE`, `NAV`, `SOCIALS`, `PROJECTS`, `BIO`,
  `REGISTER`). Edit copy here, not in components. Some links are off-site (`/memex`, `/now`) handled
  by redirects in `netlify.toml`.

## Deployment

Static site. `netlify.toml` (publish `dist`, `pnpm build`) is primary and defines redirects for
`/memex/*` (→ Obsidian Publish) and `/now/*` (→ omg.lol); `vercel.json` mirrors caching/clean-URL
config. GitHub Actions in `.github/workflows/` run validate, build, security, and release.

## Conventions

- **Semantic tokens only.** Style with the Almanac utilities (`bg-paper`, `text-accent`,
  `border-line`, `font-display`, …) or the shadcn role utilities — never one-off Tailwind colour
  literals (`text-blue-600`). `task lint:design` enforces this.
- Linting/formatting is enforced by **pre-commit** (`.pre-commit-config.yaml`): yaml, shell
  (shellcheck), terraform, ansible, plus secret/key detection. `no-commit-to-branch` blocks direct
  commits to protected branches. Run `task validate` before pushing.
- ESLint config is `eslint.config.js` (flat config, `eslint-plugin-astro` + `typescript-eslint`);
  Prettier config in `.prettierrc.cjs` with the Astro plugin.
- The project is part of "Harmon Stack" — some tooling (terraform/ansible hooks, version-bump tasks)
  exists for that broader stack and is not all exercised by this site.
- Open a PR for human review; never merge directly to `main`.
