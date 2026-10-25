#!/usr/bin/env bash
# Pegel-Feinschliff (Loudness/Limiter) – nur die Audiospur wird neu kodiert, das Video bleibt unverändert.
# Nutzung: bash scripts/finalize.sh [name]   (Standard: display-iq-reel; Reel 2: plastic-reel)
set -euo pipefail
cd "$(dirname "$0")/.."
NAME="${1:-display-iq-reel}"
ffmpeg -y -loglevel error -i "out/$NAME.raw.mp4" -c:v copy \
  -af "loudnorm=I=-15:TP=-1.5:LRA=9" -c:a aac -b:a 256k -ar 48000 -movflags +faststart \
  "out/$NAME.mp4"
mkdir -p export && cp "out/$NAME.mp4" "export/$NAME.mp4"
echo "Fertig: export/$NAME.mp4"
