#!/bin/sh
# Templated by /docker-entrypoint.d in the official nginx image, runs before
# nginx starts. Two responsibilities:
#   1. Rewrite the browser-side runtime config (public/config.js → window.__APP_CONFIG__).
#   2. Render /etc/nginx/conf.d/default.conf so /api/ proxies to BACKEND_UPSTREAM.
set -eu

BACKEND_BASE_URL="${BACKEND_BASE_URL:-}"
BACKEND_UPSTREAM="${BACKEND_UPSTREAM:-http://backend:9000}"

CONFIG_FILE="/usr/share/nginx/html/config.js"
cat > "$CONFIG_FILE" <<EOF
window.__APP_CONFIG__ = {
  backendBaseUrl: "${BACKEND_BASE_URL}"
};
EOF

# Render nginx config template (the only variable used is BACKEND_UPSTREAM).
TEMPLATE="/etc/nginx/conf.d/default.conf"
TMP="$(mktemp)"
# shellcheck disable=SC2016
BACKEND_UPSTREAM="$BACKEND_UPSTREAM" envsubst '${BACKEND_UPSTREAM}' < "$TEMPLATE" > "$TMP"
mv "$TMP" "$TEMPLATE"

echo "[entrypoint] BACKEND_BASE_URL=${BACKEND_BASE_URL:-<empty/same-origin>}"
echo "[entrypoint] BACKEND_UPSTREAM=${BACKEND_UPSTREAM}"
