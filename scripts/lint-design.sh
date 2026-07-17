#!/usr/bin/env bash
# lint-design.sh — validate the Almanac design system: canonical sources exist,
# only semantic tokens are used, and the palette's fg/bg pairs meet WCAG AA.
# (Static checks only — rendered contrast is measured by the design-handoff
# skill's verification step against the running pages.)
set -euo pipefail

# 1) canonical sources must exist
if [ ! -f DESIGN.md ]; then
    echo "✗ DESIGN.md missing (AI-facing design intent)" >&2
    exit 1
fi
if [ ! -f src/styles/globals.css ]; then
    echo "✗ src/styles/globals.css missing (runtime tokens)" >&2
    exit 1
fi

# 2) semantic tokens only — flag one-off Tailwind numbered colour utilities
#    (e.g. text-blue-600, bg-slate-50). These are the off-palette "AI-slop" tell.
#    Fixed foil/ink hex values sanctioned by DESIGN.md §2.3 are allowed.
if grep -rEn "(bg|text|border|fill|ring|from|to|via)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|grey|zinc|neutral|stone)-[0-9]{2,3}" \
    src/components src/pages src/layouts; then
    echo "✗ off-palette Tailwind colour utility found — use semantic tokens (bg-paper, text-accent, …)" >&2
    exit 1
fi

# 3) STATIC token contrast — prove the palette's fg/bg pairs meet WCAG AA in
#    both themes.
node tests/check-contrast.mjs

echo "✓ design lint passed"
