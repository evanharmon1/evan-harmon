# Evan Harmon Website

My personal website — **"The Almanac"** — built with Astro, Tailwind CSS, and
TypeScript, and standardized with
[harmon-init](https://github.com/evanharmon1/harmon-init) (harmon-platform).

<https://evanharmon.com>

Author: Evan Harmon

[![Build](https://github.com/evanharmon1/evanharmon-site/actions/workflows/build.yml/badge.svg)](https://github.com/evanharmon1/evanharmon-site/actions/workflows/build.yml)

## Setup & Installation

### Requirements

- Homebrew
- Python
- [Taskfile](https://taskfile.dev/)
- [uv](https://docs.astral.sh/uv/) (runs the pinned Semgrep CE baseline)
- Node >= 22 and [pnpm](https://pnpm.io)

### Bootstrap

Install required software to run other project installers and task runners
`task bootstrap`

### Install

Install required dependencies
`task install`

## Usage

### Task Runner

[Taskfile.yaml](./Taskfile.yml)

### Testing

#### Verify

`task check` is the fast lint + typecheck gate. `task verify` is the
definition-of-done gate (check + build + validate + tests); `task ci` adds
security and the devcontainer permission assertion.

#### Security

`task security` — Semgrep CE + gitleaks + dependency audit

#### Linting, Formatting, Conventions, Style Guidelines, etc

Git hooks are managed by [lefthook](./lefthook.yml) and delegate to Taskfile
targets (`task check`, `task lint:design`, …). See
[docs/conventions.md](./docs/conventions.md).

## Tech Stack

- **Astro** (static output) + **Tailwind CSS v4** (CSS-first) + **TypeScript**
- **React + shadcn/ui** for interactive islands
- **pnpm** package manager
- Design system in [DESIGN.md](./DESIGN.md); runtime tokens in `src/styles/globals.css`

## Deployment

Static site deployed via [`netlify.toml`](./netlify.toml) (publishes `dist/`,
builds with `pnpm build`). GitHub Actions in
[`.github/workflows/`](./.github/workflows/) run build, lint, security, and
CodeQL checks.

## Documentation

- [docs/README.md](./docs/README.md) — documentation map
- [docs/architecture/README.md](./docs/architecture/README.md) — architecture
- [DESIGN.md](./DESIGN.md) — design & UX intent
