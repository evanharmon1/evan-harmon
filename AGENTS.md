# AGENTS.md

Guidance for AI coding agents (Claude Code, Gemini CLI, GitHub Copilot, Codex,
...) working in Evan Harmon Website. `CLAUDE.md`, `GEMINI.md`, and
`.github/copilot-instructions.md` are symlinks to this file — edit only
`AGENTS.md`.

## Project Overview

Personal website for Evan Harmon (<https://evanharmon.com>) — **"The Almanac"**, an aged-paper /
woodcut-engraving brand with dual **Parchment** (light) and **Midnight** (dark) themes. Built on
**Astro 6 + Tailwind CSS v4 + TypeScript**, with **React + shadcn/ui** available for interactive
islands. Output is fully `static` (SSG). Package manager is **pnpm**.

The design is documented in **`DESIGN.md`** (AI-facing intent). The **canonical runtime token source
is `src/styles/global.css`** — when the two disagree, `global.css` wins.

Repo: https://github.com/evanharmon1/evanharmon-site — see [docs/README.md](docs/README.md) for the
documentation map, [docs/architecture/README.md](docs/architecture/README.md)
for the architecture, and [DESIGN.md](DESIGN.md) for design/UX intent.

## Commands

All repo-level commands go through the Taskfile (single source of truth — CI,
git hooks, and humans run the same targets); day-to-day app development uses
pnpm scripts:

```bash
task verify      # FAST local gate (<~1 min) — run constantly; safe for hooks/agents
task ci          # FULL CI mirror — run before/instead of opening a PR
task check       # all linters (includes lint:design)
task fix         # auto-format then lint
task test        # tests (includes the Playwright cross-browser screenshot sweep)
task security    # gitleaks + dependency audit

pnpm dev         # local dev server (astro dev)
pnpm build       # production build to dist/
pnpm preview     # preview built site
pnpm check       # astro check + eslint + prettier --check
pnpm fix         # eslint --fix + prettier -w
```

`verify` is deliberately kept fast (lint + typecheck + build + the quick
Taskfile/hook guards) so editors, git hooks, and AI agents can run it on every
change without getting bogged down. `ci` is the full pipeline — everything CI
runs (`verify` + `test` + `security` + the devcontainer permission assert) — so you
can reproduce a CI run locally on demand instead of waiting on a PR.

`task lint:design` validates the Almanac design system: canonical files exist
(`DESIGN.md`, `src/styles/global.css`), no off-palette Tailwind colour
utilities, and static WCAG AA token contrast (`test/check-contrast.mjs`).
`task test:e2e` runs the route × theme × engine/device screenshot sweep in
`test/brand-screenshots.spec.ts` (build first: `pnpm build`).

## Definition of Done

- `task verify` passes.
- Conventional commit message (types: build, chore, ci, docs, feat, fix, perf,
  refactor, revert, style, test).
- Never bypass git hooks (`--no-verify` is forbidden); fix the underlying issue.
- Work on a feature branch; direct commits to `main` are blocked.
- Releases are intentional: release-please keeps a rolling release PR from
  conventional commits; merging it cuts the tag/release. Nothing bumps on a
  normal merge. `task release:*` remains as a manual override.

## Architecture

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
  `src/content.config.ts` (Astro `glob` loader + Zod schema: `title`, `publishDate`, `category`,
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

Static site. `netlify.toml` (publish `dist`, `pnpm build`) defines redirects for
`/memex/*` (→ Obsidian Publish) and `/now/*` (→ omg.lol). GitHub Actions in
`.github/workflows/` run lint/security/template checks (`build.yml`),
CodeQL, the devcontainer image build, and release-please (`release.yml`).

## Conventions

Full reference: [docs/conventions.md](docs/conventions.md). Highlights:

- **Semantic tokens only.** Style with the Almanac utilities (`bg-paper`, `text-accent`,
  `border-line`, `font-display`, …) or the shadcn role utilities — never one-off Tailwind colour
  literals (`text-blue-600`). `task lint:design` enforces this.
- Conventional Commits; `group:action` Taskfile naming (e.g. `lint:shell`, not
  `shell:lint`); pin actions by SHA + `# vX.Y.Z`.
- Git hooks are managed by lefthook (`lefthook.yml`) and delegate to Taskfile
  targets — don't duplicate logic in hooks or workflows.
- Keep Taskfile `cmds:` trivial — inline strings aren't linted (`lint:shell`
  only covers `scripts/*.sh`). Put any pipeline/conditional/loop/`curl | bash`
  in a `scripts/*.sh` the task calls. `task test:tasks` checks the Taskfile
  compiles and setup tasks are safe no-ops.
- ESLint config is `eslint.config.js` (flat config, `eslint-plugin-astro` + `typescript-eslint`);
  Prettier config in `prettier.config.cjs` with the Astro plugin.
- Indentation: 2 spaces default, 4 for Python/Terraform/Shell (`.editorconfig`).
- Secrets never go in git; local env via 1Password (`op run` / `op inject`).
- The project is part of **harmon-platform** (Evan's developer & DevOps platform) and is
  templated by [harmon-init](https://github.com/evanharmon1/harmon-init) — repo tooling
  (Taskfile, lefthook, workflows) is template-owned; keep customizations minimal and
  intentional so `copier update` stays clean.
