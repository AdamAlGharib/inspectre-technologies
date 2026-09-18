#!/bin/sh
# Full-page screenshot of the running dev server with headless Chrome.
#   scripts/preview-page.sh <width> [light|dark] [height]
# Writes .preview/page-<width>-<theme>.png
#
# Headless Chrome will not open a window narrower than about 500px, so phone widths are
# rendered inside an iframe of the requested width and the capture is cropped to it.
set -e
WIDTH="${1:-1440}"
THEME="${2:-light}"
HEIGHT="${3:-9600}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/.preview/page-$WIDTH-$THEME.png"
URL="${BASE_URL:-http://localhost:3000}/?theme=$THEME"
CHROME="${CHROME_BIN:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
WORK="$(mktemp -d)"
mkdir -p "$ROOT/.preview"
rm -f "$OUT"

TARGET="$URL"
WINDOW="$WIDTH"
if [ "$WIDTH" -lt 500 ]; then
  WINDOW=500
  TARGET="file://$WORK/frame.html"
  printf '<!doctype html><body style="margin:0;background:#888"><iframe src="%s" style="display:block;border:0;width:%spx;height:%spx"></iframe>' "$URL" "$WIDTH" "$HEIGHT" > "$WORK/frame.html"
fi

"$CHROME" --headless=new --disable-gpu --hide-scrollbars --no-first-run \
  --disable-background-networking --disable-component-update \
  --force-device-scale-factor=1 --virtual-time-budget=8000 \
  --user-data-dir="$WORK/profile" --window-size="$WINDOW,$HEIGHT" \
  --screenshot="$OUT" "$TARGET" >/dev/null 2>&1 &
PID=$!
i=0
while [ $i -lt 200 ]; do
  sleep 0.25
  if [ -s "$OUT" ]; then sleep 0.5; break; fi
  i=$((i + 1))
done
kill -9 $PID 2>/dev/null || true
wait $PID 2>/dev/null || true

if [ -s "$OUT" ] && [ "$WINDOW" != "$WIDTH" ]; then
  node -e 'const sharp=require(process.argv[1]+"/node_modules/sharp");const f=process.argv[2];sharp(f).extract({left:0,top:0,width:+process.argv[3],height:+process.argv[4]}).toBuffer().then(b=>require("fs").writeFileSync(f,b))' "$ROOT" "$OUT" "$WIDTH" "$HEIGHT"
fi
rm -rf "$WORK"
[ -s "$OUT" ] && echo "$OUT" || { echo "no screenshot produced" >&2; exit 1; }
