#!/bin/sh
# Fix simli-client case-sensitivity issue on Linux
# index.js does require("./Client") but file is client.js (lowercase)
SIMLI_DIST="node_modules/simli-client/dist"
if [ -f "$SIMLI_DIST/client.js" ] && [ ! -f "$SIMLI_DIST/Client.js" ]; then
  cp "$SIMLI_DIST/client.js" "$SIMLI_DIST/Client.js"
  echo "Fixed: client.js -> Client.js"
fi
