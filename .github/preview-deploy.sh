#!/bin/sh
# Runs on the server as the forced command of the preview deploy key (see .github/workflows/preview.yml).
# Accepts only "preview feature/<name>" and checks that branch out into the preview folder.
set -eu
B=$(printf '%s' "${SSH_ORIGINAL_COMMAND:-}" | sed -n 's#^preview \(feature/[A-Za-z0-9._-]*\)$#\1#p')
[ -n "$B" ] || { echo "usage: preview feature/<name>" >&2; exit 1; }
cd /var/www/pixel-tower-preview
git fetch --prune --quiet origin
git checkout --quiet --force --detach "origin/$B"
git clean -fdq
echo "preview now serving $B at $(git rev-parse --short HEAD)"
