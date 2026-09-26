#!/bin/sh
# Fix simli-client case-sensitivity issue on Linux
# The package requires ./Client but the actual file is client.js
SIMLI_DIST="node_modules/simli-client/dist"
if [ -f "$SIMLI_DIST/client.js" ] && [ ! -f "$SIMLI_DIST/Client.js" ]; then
  cp "$SIMLI_DIST/client.js" "$SIMLI_DIST/Client.js"
  cp "$SIMLI_DIST/client.d.ts" "$SIMLI_DIST/Client.d.ts" 2>/dev/null || true
fi
if [ -f "$SIMLI_DIST/config.js" ] && [ ! -f "$SIMLI_DIST/Config.js" ]; then
  cp "$SIMLI_DIST/config.js" "$SIMLI_DIST/Config.js"
  cp "$SIMLI_DIST/config.d.ts" "$SIMLI_DIST/Config.d.ts" 2>/dev/null || true
fi
if [ -d "$SIMLI_DIST/Signaling" ] || [ -d "$SIMLI_DIST/signaling" ]; then
  echo "simli-client dist patched for case-sensitivity"
fi
