#!/bin/bash
# Runs game tests in headless Chrome. No dependencies besides Chrome/Chromium.
#   tests/run.sh                      run every tests/*.test.js (exit 1 on any failure)
#   tests/run.sh tests/nova.test.js   run one file
#   VT=150000 tests/run.sh tests/balance.sim.js   longer scripts need more virtual time (ms)
# Each test file is appended to a copy of index.html (fresh localStorage) and reports via lib.js done().
set -u
ROOT=$(cd "$(dirname "$0")/.." && pwd)
CH=${CHROME:-}
for c in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" google-chrome google-chrome-stable chromium chromium-browser; do
  [ -n "$CH" ] && break; { [ -x "$c" ] || command -v "$c" >/dev/null 2>&1; } && CH=$c
done
[ -z "$CH" ] && { echo "Chrome/Chromium not found (set CHROME=/path/to/chrome)"; exit 2; }
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
FILES=("$@"); [ ${#FILES[@]} -eq 0 ] && FILES=("$ROOT"/tests/*.test.js)
FAILED=0
for f in "${FILES[@]}"; do
  python3 - "$ROOT/index.html" "$ROOT/tests/lib.js" "$f" "$TMP/page.html" <<'PY'
import sys
src,lib,test,out=sys.argv[1:5]
s=open(src).read()
pre="<head><script>window.__err=[];addEventListener('error',e=>__err.push(e.message));localStorage.clear();</script>"
assert "<head>" in s and "</body>" in s
s=s.replace("<head>",pre,1).replace("</body>","<script>\n"+open(lib).read()+"\n"+open(test).read()+"\n</script>\n</body>",1)
open(out,'w').write(s)
PY
  OUT=$("$CH" --headless=new --disable-gpu --no-first-run --no-sandbox --user-data-dir="$TMP/prof" --window-size=500,900 \
    --virtual-time-budget="${VT:-5000}" --dump-dom "file://$TMP/page.html" 2>/dev/null | python3 -c "
import sys,re,html;d=sys.stdin.read();m=re.search(r'<pre id=\"results\">(.*?)</pre>',d,re.S)
print(html.unescape(m.group(1)) if m else 'FAIL no results: test script crashed or timed out')")
  echo "== $(basename "$f")"; echo "$OUT"
  echo "$OUT" | grep -q '^FAIL' && FAILED=1
done
[ $FAILED -eq 0 ] && echo "ALL PASSED" || { echo "SOME TESTS FAILED"; exit 1; }
