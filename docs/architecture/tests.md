# Tests

How testing works in Evan Harmon Website.

## Layers

| Layer | Tool | Command |
|---|---|---|
| Lint / static analysis | shellcheck, yamllint, markdownlint, actionlint, eslint, prettier, tsc/astro check | `task check` |
| Unit / component tests | vitest | `task test` |
| End-to-end | Playwright | `task test:e2e` |
| Secrets | gitleaks | `task security:secrets` |

## Conventions

- Test files live in `tests/` at the repo root (or co-located per framework convention).
- `task verify` is the local merge gate; CI runs the same task targets.
- Playwright runs desktop Chromium/Firefox/WebKit **and mobile device
  projects** (e.g. Pixel + iPhone). The scaffold ships the mobile projects
  commented out — enable them; mobile-first is the convention.
- TODO: document coverage expectations and fixtures as the suite grows.
