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
#   3. A PAGE OVERFLOWS AND IS SILENTLY CLIPPED. This is the nastiest of the three,
#      and the page-count check CANNOT catch it: .page sets overflow:hidden, so
#      content past 1056px is cut rather than pushed onto a new page. The count
#      stays correct while the footer quietly disappears. Caught on 2026-09-02 with
#      page 2 running 150px over — the whole Academy summary and the footer were
#      being cut off, and both the PDF and the page-count check looked fine.
#      So each page is MEASURED in a real browser below, not eyeballed.
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

# build <name> <expected-pages>
#
# The expected count is passed in rather than assumed to be 1: class-schedule grew a
# second page (instructor view) on 2026-09-02, and the guard is only worth having if
# it still catches an ACCIDENTAL extra page. "However many it comes out as" would
# catch nothing.
# Measure every .page's content height in a real browser. Appends a probe script to
# a throwaway copy so the sheet itself stays free of build scaffolding, then reads the
# result back out of <title> — the only channel headless Chrome gives us without a
# driver. Echoes "OVERFLOW" per page that exceeds 1056px.
measure() {
  local name="$1"
  # Written NEXT TO the sheet, not in $TMPDIR: on Git Bash TMPDIR is a Windows path
  # (C:\Users\...\Temp\), which breaks both the POSIX cat and the /c/ → c:/ rewrite
  # below. The first version used it, produced no output at all, and the check then
  # passed vacuously — see the empty "no clipping ()" it printed.
  local probe="${ROOT}/print/.probe-${name}.html"
  cat "${ROOT}/print/${name}.html" > "$probe"
  cat >> "$probe" <<'PROBE'
<script>
window.addEventListener('load', () => {
  // .page wrappers if the sheet has them (class-schedule, which is two pages), else
  // the body itself (little-movers, still a single body-as-page sheet). Without the
  // fallback this returns nothing for one-page sheets, which now fails the build.
  const pages = document.querySelectorAll('.page');
  const boxes = pages.length ? [...pages] : [document.body];
  document.title = 'PROBE ' + boxes.map((p, i) => {
    // scrollHeight, NOT lastElementChild's bottom. This probe appends its own <script>
    // to the document, and on the body-fallback path that script becomes the last
    // element child — a zero-height node, which measured the page at 0 and passed.
    // scrollHeight reports full content height even under overflow:hidden.
    // Round BEFORE comparing: sub-pixel layout puts a page that fits exactly at
    // 1056.0001, which a raw `> 1056` reported as an overflow.
    const h = Math.round(p.scrollHeight);
    return `p${i + 1}=${h}${h > 1056 ? '-OVERFLOW' : ''}`;
  }).join(' ');
});
</script>
PROBE
  local winprobe
  winprobe="$(printf '%s' "$probe" | sed 's|^/\([a-zA-Z]\)/|\1:/|')"
  "$CHROME" --headless=new --disable-gpu --virtual-time-budget=25000 \
    --run-all-compositor-stages-before-draw --dump-dom "file:///${winprobe}" 2>/dev/null \
    | grep -o '<title>PROBE [^<]*</title>' | sed 's|<title>PROBE ||; s|</title>||'
  rm -f "$probe"
}

build() {
  local name="$1"
  local want="$2"
  local pdf="${ROOT}/print/${name}.pdf"

  # 30s, not 15s. See note 1 above — 15s lost the race at least once.
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
    --run-all-compositor-stages-before-draw --virtual-time-budget=30000 \
    "--print-to-pdf=${pdf}" \
    "file:///${WINROOT}/print/${name}.html" >/dev/null 2>&1

  local pages ok_fonts
  pages=$(grep -a -o '/Count [0-9]*' "$pdf" | head -1 | grep -o '[0-9]*' || echo 0)
  ok_fonts=$(grep -a -c 'Anton-Regular' "$pdf" || true)

  if [ "$pages" != "$want" ]; then
    echo "🔴 ${name}: ${pages} pages, expected ${want}. If a page overflowed, trim the"
    echo "   fixed chrome rather than the schedule. If a page was added on purpose,"
    echo "   update the expected count in the build() call at the bottom of this script."
    FAILED=1
  elif [ "${ok_fonts:-0}" -eq 0 ]; then
    echo "🔴 ${name}: Anton did NOT embed — the PDF is set in Segoe UI. Re-run; if it"
    echo "   persists, check the font <link> is the v1 /css? endpoint and you are online."
    FAILED=1
  else
    local heights
    heights="$(measure "$name")"
    if [ -z "$heights" ]; then
      # A measurement that returns nothing must FAIL, not pass. Silence here means the
      # probe did not run, and "no overflow detected" would be a lie rather than a pass.
      echo "🔴 ${name}: could not measure page heights — the probe returned nothing."
      echo "   Not treating that as a pass. Check the probe path and that Chrome ran."
      FAILED=1
    elif printf '%s' "$heights" | grep -q OVERFLOW; then
      echo "🔴 ${name}: a page overflows 1056px and is being CLIPPED — ${heights}"
      echo "   The PDF will look fine and the page count will be right; the bottom of"
      echo "   that page is simply cut off. Trim fixed chrome until every page is ≤1056."
      FAILED=1
    else
      echo "✅ ${name}: ${pages} page(s), fonts embedded, no clipping (${heights})"
    fi
  fi
}

build class-schedule 2          # page 1 the week, page 2 by instructor
build little-movers-schedule 1

if [ "$FAILED" -ne 0 ]; then
  echo
  echo "🔴 NOT copying to public/ — a sheet failed verification above."
  exit 1
fi

# The downloadable copy. Keep this filename STABLE: it is a public URL, and changing
# it breaks any link already sent to a parent.
cp "${ROOT}/print/class-schedule.pdf" "${ROOT}/public/class-schedule-fall-2026.pdf"
echo "✅ public/class-schedule-fall-2026.pdf refreshed"
