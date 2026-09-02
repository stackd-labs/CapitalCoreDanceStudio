#!/usr/bin/env bash
#
# Rebuild both print sheets and refresh the downloadable copy in public/.
#
#   bash print/build.sh          from the repo root
#
# Uses headless Chrome, which prints backgrounds without the "Background graphics"
# tickbox the print dialog needs.
#
# ── WHY THIS SCRIPT VERIFIES, AND WHY IT REFUSES TO COPY ────────────────────────
# Two things go wrong here, and BOTH produce a PDF that looks fine at a glance:
#
#   1. FONTS SILENTLY FALL BACK TO SEGOE UI. The Google Fonts request is a network
#      fetch, and if it has not finished when Chrome prints, the PDF embeds Segoe UI
#      instead of Anton and Barlow. Caught in the wild on 2026-09-02: a build at
#      --virtual-time-budget=15000 produced a Segoe UI PDF while the endpoints were
#      up and reachable, and the next run at 30000 embedded all five cuts. It is a
#      race, so it will not reproduce reliably — which is exactly why it is checked
#      on every build rather than trusted.
#
#   2. THE SHEET SPILLS TO TWO PAGES. The layout has no slack left; adding any block
#      pushes it over, and page two is mostly empty navy so it is easy to miss.
#
# The verification runs BEFORE the copy into public/, and a failure aborts. The first
# version of this script checked after copying, and duly published the Segoe UI PDF
# to the live domain.
set -euo pipefail

CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
[ -x "$CHROME" ] || { echo "🔴 Chrome not found at $CHROME"; exit 1; }

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# 🔴 Chrome is a WINDOWS binary; this script runs in Git Bash. pwd gives a POSIX path
# (/c/Users/...) and Chrome cannot resolve file:///c/Users/... — it silently renders an
# error page instead, which prints as ONE page in the system font. That looks exactly
# like the font-fallback failure above, so it fooled the first version of this check:
# both sheets "failed fonts" when in fact neither page had loaded at all.
# /c/Users/... → c:/Users/...
WINROOT="$(printf '%s' "$ROOT" | sed 's|^/\([a-zA-Z]\)/|\1:/|')"

FAILED=0

build() {
  local name="$1"
  local pdf="${ROOT}/print/${name}.pdf"

  # 30s, not 15s. See note 1 above — 15s lost the race at least once.
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
    --run-all-compositor-stages-before-draw --virtual-time-budget=30000 \
    "--print-to-pdf=${pdf}" \
    "file:///${WINROOT}/print/${name}.html" >/dev/null 2>&1

  local pages ok_fonts
  pages=$(grep -a -o '/Count [0-9]*' "$pdf" | head -1 | grep -o '[0-9]*' || echo 0)
  ok_fonts=$(grep -a -c 'Anton-Regular' "$pdf" || true)

  if [ "$pages" != "1" ]; then
    echo "🔴 ${name}: ${pages} pages, expected 1. Trim the fixed chrome, not the schedule."
    FAILED=1
  elif [ "${ok_fonts:-0}" -eq 0 ]; then
    echo "🔴 ${name}: Anton did NOT embed — the PDF is set in Segoe UI. Re-run; if it"
    echo "   persists, check the font <link> is the v1 /css? endpoint and you are online."
    FAILED=1
  else
    echo "✅ ${name}: 1 page, fonts embedded"
  fi
}

build class-schedule
build little-movers-schedule

if [ "$FAILED" -ne 0 ]; then
  echo
  echo "🔴 NOT copying to public/ — a sheet failed verification above."
  exit 1
fi

# The downloadable copy. Keep this filename STABLE: it is a public URL, and changing
# it breaks any link already sent to a parent.
cp "${ROOT}/print/class-schedule.pdf" "${ROOT}/public/class-schedule-fall-2026.pdf"
echo "✅ public/class-schedule-fall-2026.pdf refreshed"
