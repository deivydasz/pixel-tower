#!/bin/bash
# Screenshot the game at a phone width, optionally after a setup script.
#   tests/shot.sh out.png [width] [height] [setup.js]
# The page is loaded in an iframe of the given width, because desktop Chrome windows can't be narrower than ~500px.
# setup.js runs after the game loads (lib.js helpers available), e.g.: skipTips();step(10);
set -u
ROOT=$(cd "$(dirname "$0")/.." && pwd); OUT=$1; WD=${2:-390}; HT=${3:-844}; SETUP=${4:-}
CH=${CHROME:-}
for c in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" google-chrome google-chrome-stable chromium chromium-browser; do
  [ -n "$CH" ] && break; { [ -x "$c" ] || command -v "$c" >/dev/null 2>&1; } && CH=$c
done
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
python3 - "$ROOT/index.html" "$ROOT/tests/lib.js" "$SETUP" "$TMP/page.html" <<'PY'
import sys
src,lib,setup,out=sys.argv[1:5]
s=open(src).read().replace("<head>","<head><script>window.__err=[];localStorage.clear();</script>",1)
extra=open(lib).read()+"\n"+(open(setup).read() if setup else "")+"\nui();draw();"
open(out,'w').write(s.replace("</body>","<script>\n"+extra+"\n</script>\n</body>",1))
PY
echo "<body style='margin:0;background:#888'><iframe src='page.html' style='border:0;width:${WD}px;height:${HT}px'></iframe></body>" > "$TMP/wrap.html"
"$CH" --headless=new --disable-gpu --no-first-run --no-sandbox ${CHROME_FLAGS:-} --user-data-dir="$TMP/prof" --window-size=$((WD>500?WD:500)),$HT \
  --virtual-time-budget=4000 --screenshot="$(cd "$(dirname "$OUT")" && pwd)/$(basename "$OUT")" "file://$TMP/wrap.html" >/dev/null 2>&1
echo "saved $OUT (${WD}x${HT})"
