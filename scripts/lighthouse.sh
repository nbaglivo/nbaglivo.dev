#!/bin/sh
set -e

if [ -z "$CHROME_PATH" ]; then
  playwright_chrome=$(ls -d "$HOME"/Library/Caches/ms-playwright/chromium-*/chrome-mac-*/"Google Chrome for Testing.app"/Contents/MacOS/"Google Chrome for Testing" 2>/dev/null | tail -1)
  if [ -n "$playwright_chrome" ]; then
    export CHROME_PATH="$playwright_chrome"
  fi
fi

npm run build

for app in apps/*/; do
  echo "lighthouse: $app"
  npx lhci autorun --collect.staticDistDir="${app}dist"
done
