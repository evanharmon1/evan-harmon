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
is `src/styles/globals.css`** — when the two disagree, `globals.css` wins.

Repo: https://github.com/evanharmon1/evanharmon-site — see [docs/README.md](docs/README.md) for the
documentation map, [docs/architecture/README.md](docs/architecture/README.md)
for the architecture, and [DESIGN.md](DESIGN.md) for design/UX intent.

## Hard Rules

Non-negotiable, regardless of any autonomy granted elsewhere in this file:

- **Never write to a password manager or credential store unprompted.** Do not
  create, modify, archive, or delete anything in 1Password (items, fields,
  vaults — via the `op` CLI or any other means), OS keychains, or any other
  secret store unless the user explicitly requested that specific write in the
  current conversation. Even when asked, restate exactly what will be written
  and get confirmation before executing — announcing intent and proceeding in
  the same turn is not consent. Read operations (`op read`, `op item list`,
  `op inject` over existing references) are fine.

## Commands

All repo-level commands go through the Taskfile (single source of truth — CI,
git hooks, and humans run the same targets); day-to-day app development uses
pnpm scripts:

```bash
task check       # FAST gate (<~1 min) — run constantly; safe for hooks/agents
task verify      # definition-of-done gate — check + build + validate + test
task ci          # FULL CI mirror — run before/instead of opening a PR
task fix         # auto-format then lint
task test        # unit tests (when configured)
task security    # Semgrep CE + gitleaks + dependency audit

pnpm dev         # local dev server (astro dev)
pnpm build       # production build to dist/
pnpm preview     # preview built site
pnpm check       # astro check + eslint + prettier --check
pnpm fix         # eslint --fix + prettier -w
task foreman:plan -- --milestone <n>  # foreman: dry-run the dispatch graph
```

**Foreman** (`task foreman:*`) is the deterministic supervisor that dispatches
armed issues to headless agents, verifies their output with `task ci`, opens
PRs, and shepherds them to mergeable — merging is always a human decision.
See `docs/architecture/foreman.md`.

`check` is the fast inner-loop gate (lint + typecheck). `verify` is the
definition-of-done gate: check, build, validation, Taskfile/hook guards, and
tests. `ci` adds security and the devcontainer permission assertion.

`task lint:design` validates the Almanac design system: canonical files exist
(`DESIGN.md`, `src/styles/globals.css`), no off-palette Tailwind colour
utilities, and static WCAG AA token contrast (`tests/check-contrast.mjs`).
`task test:e2e` runs the route × theme × engine/device screenshot sweep in
`tests/brand-screenshots.spec.ts` (build first: `pnpm build`).

## Dev Loop

Bias toward shipping: drive every change to an open PR instead of stopping at
a green local diff. Work in small, PR-sized units, and move to the next stage
on your own — an open PR with green checks is the default deliverable, not
something to ask permission for.

- **Branch** — feature branch off `main`; never commit directly to `main`.
- **Edit + `task check`** — the fast inner loop; run it constantly and fix
  lint immediately.
- **`task verify`** — when the change feels done, loop edit → verify until
  green; verify is the definition-of-done gate.
- **`task ci`** — the full CI mirror; fix anything it catches.
- **Open the PR** — conventional commit, push the branch, `gh pr create` with
  a clear what/why/verification summary.
- **Shepherd the PR (max 4 rounds).** Opening the PR is not the end. Watch CI
  (`gh pr checks <n> --watch`) and incoming bot/human reviews. When a check
  fails or a review lands findings, treat the findings as hypotheses: verify
  them against the code, fix only what's confirmed, explain rejections in a
  PR comment, push the fix commit, and watch again. Shepherd-round fixes
  must pass `task verify` before each push; the local challenge/review loops
  are not re-entered — the post-push cloud/bot review is the second-model
  check at this stage. This cap is independent of the other loop caps. If
  checks still fail or material findings remain after 4 rounds, stop and
  summarize what's unresolved on the PR for the maintainer.
- **Stop at green.** Report that checks pass, then stop — merging is always a
  human decision.

## Definition of Done

- `task verify` passes.
- Conventional commit message (types: build, chore, ci, docs, feat, fix, perf,
  refactor, revert, style, test).
- Never bypass git hooks (`--no-verify` is forbidden); fix the underlying issue.
- Work on a feature branch; direct commits to `main` are blocked.
- **Never merge to main yourself** — no `gh pr merge`, `git merge`, or push to
  `main` without the maintainer's explicit, per-merge approval, even when CI is
  green and the ruleset would allow it. Open the PR, report that checks pass,
  then stop; merging is always a human decision.
- **Reply to every inline PR review comment in its own thread** — bot
  reviewers (Codex, CodeRabbit, …) and humans alike. Treat findings as
  hypotheses: verify each against the code, fix what's confirmed, and post the
  rejection reasoning with evidence otherwise. Post replies with
  `gh api repos/{owner}/{repo}/pulls/<n>/comments/<comment-id>/replies -f body=…`
  (comment IDs from `gh api …/pulls/<n>/comments`). A rollup summary comment
  on the PR is optional in addition, never a substitute for per-thread
  replies.
- Releases are intentional: release-please keeps a rolling release PR from
  conventional commits; merging it cuts the tag/release. Nothing bumps on a
  normal merge. `task release:*` remains as a manual override.

## Architecture

- **Tailwind v4 is CSS-first.** There is **no** `@astrojs/tailwind` integration; it's the Vite
  plugin (`@tailwindcss/vite` in `astro.config.ts`) plus `@import "tailwindcss"` inside
  `src/styles/globals.css`, imported once from `src/layouts/Layout.astro`.
- **`src/styles/globals.css`** is the heart: semantic `--c-*` tokens that swap per theme (via the
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
  cross-cutting classes (`.catalog`, `.ledger`, `.cta--bold`, `.display`, …) live in `globals.css`.
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
- When generating or rotating secrets, keep secret values on stdin and use the
  destination-only helpers:
  `task secret:set:1p VAULT=... ITEM=... FIELD=... [SECTION=...]` for existing
  1Password fields and `task secret:set:gh NAME=... REPO=owner/repo` for GitHub
  repo secrets. Never pass secret values as command arguments, `--body` values,
  exported env vars, or Taskfile vars. The hard rule above still applies:
  agents must not run `secret:set:1p` or otherwise write to a password manager
  without explicit user confirmation for that exact write.
