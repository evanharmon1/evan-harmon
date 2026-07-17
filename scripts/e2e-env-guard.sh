#!/usr/bin/env bash
# Fail-closed environment guard for the e2e suite: refuse to run when any
# production-capable credential or target is present in the environment.
# `task test:e2e` runs this before Playwright, loading .env.local first.
#
# This static site has no auth provider. The checks below block its production
# domains and deploy credentials. The guard must fail closed — when in doubt,
# refuse to run.
set -euo pipefail

fail() {
    echo "e2e-env-guard: $*" >&2
    echo "e2e-env-guard: refusing to run" >&2
    exit 1
}

# ── 1. Auth-provider keys must be test/dev-instance keys ──────────────
# No auth provider is configured for this static site.

# ── 2. Production domains are never a valid e2e target ────────────────
# A post-deploy smoke test against production belongs in a separate task.
if [ -n "${PLAYWRIGHT_BASE_URL:-}" ]; then
    host="$(printf '%s' "$PLAYWRIGHT_BASE_URL" | sed -E 's|^[a-z]+://([^/:]+).*|\1|')"
    case "$host" in
    evanharmon.com | *.evanharmon.com)
        fail "PLAYWRIGHT_BASE_URL targets a production domain ($host)"
        ;;
    esac
fi

# ── 3. Provider/deploy credentials must never be present for e2e ──────
# They belong in CI secrets or the backend's env store — never in an
# environment that runs browser tests.
for var in CLOUDFLARE_API_TOKEN NETLIFY_AUTH_TOKEN; do
    if [ -n "${!var:-}" ]; then
        fail "$var must never be present for e2e (it belongs in CI secrets)"
    fi
done

echo "e2e-env-guard: OK — no production-capable credentials detected"
