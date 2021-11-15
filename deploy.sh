#!/usr/bin/env bash
set -e

DEST_SSH_LOCATION=$(grep DEST_SSH_LOCATION .env | cut -d '=' -f2)

if [[ -z "$DEST_SSH_LOCATION" ]]; then
  echo "\$DEST_SSH_LOCATION not set, see .env.template."
  exit 1
else
  rsync -avz dist/ $DEST_SSH_LOCATION
fi