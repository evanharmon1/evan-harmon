# Post-Generation Checklist — Evan Harmon Website

Work through this after generating the repo from harmon-init. Delete items
that don't apply, then keep this file as a record of what was configured.

Run **`task status:setup`** at any point to audit setup completeness — GitHub
config, toolchain, devcontainer, and dev environment — against the items below
(✓ done · ✗ missing · ? unknown · – n/a).

## 1. Local setup

- [ ] `task install` — Brewfile deps, `pnpm install`, and lefthook git hooks
- [ ] `task verify` passes locally
- [ ] Verify `evanharmon-site.code-workspace` opens the repo's folder in VS Code and has a unique VS Code Workspace color. Then add any other related repos (e.g. other org repos) to the `folders` list in the workspace file so you have quick access to those repos
- [ ] Extend `.gitignore` for your stack — the template ships a base; add stack-specific entries via [gitignore.io](https://www.toptal.com/developers/gitignore)
- [ ] macOS: add a Raycast quicklink/alias that opens the `evanharmon-site.code-workspace`
- [ ] macOS (Bunch): scaffold the launcher with `task util:bunch-add` (if not generated at copier time), then `task util:bunch-install` to move it to iCloud and leave a `.meta/*.bunch` symlink (re-run install if missing)

## 2. GitHub repo settings

- [ ] **Automated settings** — run `task setup:github` (idempotent, safe to
      re-run): enables **Dependabot alerts** and **private vulnerability
      reporting**, sets the `FULL_SECURITY_SCAN` variable (CodeQL). Do NOT add dependabot.yml — Renovate owns version updates.
- [ ] Import the branch ruleset (see [architecture/branch-protection.md](architecture/branch-protection.md)) — do this once `build.yml` is on `main` so the required `verify`/`security` checks resolve. **Use the UI import:** Settings → Rules → Rulesets → **New ruleset ▸ Import a ruleset** → select `.github/Branch Protection Ruleset - Protect Main.json`. (Prefer the UI over `gh api … rulesets`: the API `POST` is not idempotent — re-running creates a duplicate ruleset — and currently rejects the `merge_queue` rule. To later change the ruleset, edit the existing one in the UI rather than re-importing.)

- [ ] Install the [Renovate app](https://github.com/apps/renovate) on the repo
- [ ] Install the [CodeRabbit app](https://github.com/apps/coderabbitai) on the repo (`.coderabbit.yaml` is pre-configured)
- [ ] Actions secret: `CLAUDE_CODE_OAUTH_TOKEN` (claude-* workflows) — generate
      with `claude setup-token`; the value must start **`sk-ant-oat01-`** (an OAuth
      token, billed to your Claude subscription), **not** `sk-ant-api03-` (a raw API
      key, billed at pay-as-you-go API rates). Then `gh secret set CLAUDE_CODE_OAUTH_TOKEN`
- [ ] Snyk is **optional and local-only**: `task security:sast`/`security:sca` are
      opt-in — they are NOT in CI or `task security`, so run them by hand with
      `SNYK_TOKEN` in your local env / 1Password (no Actions secret needed). If the
      **Snyk GitHub App** is installed it posts `code/snyk`/`security/snyk` PR checks,
      which the branch ruleset does **not** require; remove the app (or this repo from
      it) to drop them.
- [ ] **Create** the CI GitHub App `evanharmon1-ci` by hand (one App per org;
      **Settings → Developer settings → GitHub Apps**), or reuse the org's existing one.
- [ ] **Install** the App on this repo — **Install App → Only select repositories**
      (the harmon-init repos that run release-please / claude-* / project-automation),
      **not "All"**. **Creating the App is not enough:** an App whose credentials are
      set but which is *not installed* on the repo makes
      `actions/create-github-app-token` fail at runtime with a **404**
      (`Not Found` — "not installed on this repository"). This is the single
      easiest step to miss.
- [ ] Set `CI_APP_CLIENT_ID` (Actions **variable**) + `CI_APP_PRIVATE_KEY` (Actions
      **secret**) — **pipe the `.pem` in** (never paste it; flattened newlines break
      the key), and **scope both to those same repos** (least privilege — the key can
      act as the App: commits, PRs, releases, workflow edits):

      ```bash
      gh secret set CI_APP_PRIVATE_KEY --org evanharmon1 \
        --visibility selected --repos <repo-a>,<repo-b> < evanharmon1-ci.private-key.pem
      gh variable set CI_APP_CLIENT_ID --org evanharmon1 \
        --visibility selected --repos <repo-a>,<repo-b> --body "<client-id>"  # Iv…-style, not the numeric App ID
      ```

      Personal account: use `--repo evanharmon1/evanharmon-site` instead of
      `--org`/`--visibility`/`--repos`. Re-running `--repos` **replaces** the list —
      re-run with the full list to add a repo. Drives release-please, the claude-*
      workflows, and project-automation; blast-radius + rotation in
      docs/architecture/security.md.
- [ ] GHCR: ensure the org/user allows publishing packages; the first
      devcontainer prebuild populates `ghcr.io/evanharmon1/evanharmon-site-devcontainer` on merge to main
- [ ] GitHub Project: run `task setup:github-project` (needs
      `gh auth refresh -s project`) to create the owner's default project (titled
      `evanharmon1 Project`) and idempotently sync its `Status` pipeline and
      `Size` number field — see
      [project-management.md](project-management.md).
      On a personal account it also creates Priority/Product/Agent/Size as
      project fields (issue fields are org-only); status automation is a separate
      follow-up — the board is set up, but issue/PR status isn't auto-synced yet.
- [ ] Labels: run `task setup:github-labels` to seed this repo's starter label
      families (concerns/source/workflow/layer/domain — see
      [project-management.md](project-management.md)). Labels are per-repo, so run
      it in each repo; org default labels (org Settings → Repository, UI-only) only
      seed new repos.
- [ ] Project views: create the starter views (Board / Triage / Agent queue /
      Planning / Mine) in the Project UI — Projects V2 has no view API,
      so this is a one-time manual step. Filters/layouts are in
      [project-management.md](project-management.md).
- [ ] GitHub Project auto-add (**adds every issue to the board**): in the
      Project's **Settings → Workflows**, turn on **"Auto-add to project"** and
      point it at this repo (filter `is:issue`, `is:pr`) so *every* new issue and
      PR lands on the board automatically, however it's created. GitHub's native
      built-in — no Actions or tokens, and it's the reliable way to guarantee
      coverage (the issue-form `projects:` key only covers form-created issues and
      needs a static project number). See
      [project-management.md](project-management.md).

## 3. Framework scaffolding (conventions-only template)

- [ ] Scaffold Astro: `pnpm create astro@latest . --template minimal` (or preferred template)
- [ ] Add the standard stack: Tailwind v4 (`@tailwindcss/vite`), zod, vitest, lucide
- [ ] Move lint tooling into devDependencies (prettier, eslint, markdownlint-cli2,
      @commitlint/cli); switch the `lint:prettier` / `lint:markdown` `npx --yes`
      calls to `pnpm exec` (`lint:eslint` already uses it once a config + deps exist)
- [ ] Install the shipped `eslint.config.js`'s plugins:
      `pnpm add -D eslint @eslint/js typescript-eslint eslint-plugin-astro globals`
- [ ] Install the shipped prettier config's plugins:
      `pnpm add -D prettier prettier-config-standard prettier-plugin-astro prettier-plugin-tailwindcss`
- [ ] Build-script approvals + version pins already ship in
      **`pnpm-workspace.yaml`** — the template pre-approves `esbuild` + `sharp`
      (and **`workerd`** when deploying to Cloudflare Workers, so `wrangler deploy`
      doesn't fail `ERR_PNPM_IGNORED_BUILDS`) under `allowBuilds`, and floors
      `esbuild` at the patched `>=0.28.1` under `overrides` (pnpm 10+ blocks
      dependency build scripts by default). Add any other packages whose build
      scripts your deps need to `allowBuilds` (or run `pnpm approve-builds`); keep
      all pnpm `overrides` / `auditConfig` there too, **not** in the `package.json`
      `pnpm` field — pnpm 10+ silently ignores that field, so entries there vanish
      on the next lockfile resolve
- [ ] Review `lighthouserc.json` URLs once routes exist
- [ ] Enable mobile device projects in `playwright.config.ts` (e.g. Pixel +
      iPhone) — the Playwright scaffold ships them commented out, and
      mobile-first is the convention

## 4. Secrets & environment

- [ ] Cloudflare Workers deploys: create an **Account API Token** scoped to
      **Account → Workers Scripts → Edit** only (1-year TTL + renewal
      reminder) and add it: `gh secret set CLOUDFLARE_API_TOKEN`. The
      `CLOUDFLARE_ACCOUNT_ID` org-level Actions variable is shared org-wide —
      set it once per org if missing.
- [ ] Create the `preview` and `production` GitHub Environments (production:
      restrict to protected branches). Then bootstrap the Worker: Actions →
      *Release Please* → *Run workflow* (main) — the first `wrangler deploy`
      creates it; PR preview uploads work from that point.

- [ ] For local `.env` needs, use **1Password Environments** (mounts a virtual
      `.env`; secrets never hit disk or git) or `op run`/`op inject`. Commit only
      `.env.example`-style files
- [ ] Devcontainer secrets: create a **1Password environment** that mounts
      `.devcontainer/devcontainer.env` (and `.devcontainer/dev/devcontainer.env`)
      with `GH_TOKEN`, `CLAUDE_CODE_OAUTH_TOKEN`, `AGENT_DECK_TELEGRAM_KEY`
      (+ `TS_AUTHKEY` for the dev profile). `init-env.sh` enforces the per-profile
      allow-list; on Coder the values come from workspace parameters. See
      [guides/devcontainers.md](guides/devcontainers.md)

## 5. Docs & meta

- [ ] Fill in the `TODO:` markers in README.md and docs/ (architecture diagram first)
- [ ] Confirm README badges render (Actions URLs are correct once CI runs)
- [ ] Initial release when ready: `task release:init` (v0.1.0) — releases stay manual
- [ ] Stay current with harmon-init: periodically run `copier update --trust` to pull
      template improvements (a three-way merge — your own edits are preserved). The
      standardize-repo skill (`update` mode) automates this and verifies the result.
