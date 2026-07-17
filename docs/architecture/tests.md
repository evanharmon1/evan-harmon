# Tests

How testing works in Evan Harmon Website.

## Layers

| Layer | Tool | Command |
|---|---|---|
| Lint / static analysis | shellcheck, yamllint, markdownlint, actionlint, eslint, prettier, tsc/astro check | `task check` |
| Unit / component tests | vitest | `task test` |
| End-to-end | Playwright | `task test:e2e` |
| Accessibility | axe-core (via Playwright) | `task test:a11y` |
| Application security | Semgrep CE locally; CodeQL in eligible CI | `task security:sast` |
| Optional second opinion | Snyk Code + Open Source, manual | `task security:sast:snyk` / `task security:sca:snyk` |
| Secrets | gitleaks | `task security:secrets` |
| Dependencies | package-manager audit | `task security:audit` |

## Conventions

- Test files live in `tests/` at the repo root (or co-located per framework convention).
- `task verify` is the local merge gate; CI runs the same task targets.
- Playwright runs desktop Chromium/Firefox/WebKit **and mobile device
  projects** (e.g. Pixel + iPhone). The scaffold ships the mobile projects
  commented out — enable them; mobile-first is the convention.
- Accessibility: axe-core assertions live in Playwright specs tagged `@a11y`
  (run via `task test:a11y`). This is the automated **floor** (WCAG 2.x A/AA
  rules axe can detect) — keyboard + screen-reader testing still required.
- TODO: document coverage expectations and fixtures as the suite grows.
