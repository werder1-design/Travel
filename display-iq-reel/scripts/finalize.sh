#!/usr/bin/env bash
# Pegel-Feinschliff (Loudness/Limiter) – nur die Audiospur wird neu kodiert, das Video bleibt unverändert.
set -euo pipefail
cd "$(dirname "$0")/.."
ffmpeg -y -loglevel error -i out/display-iq-reel.raw.mp4 -c:v copy \
  -af "loudnorm=I=-15:TP=-1.5:LRA=9" -c:a aac -b:a 256k -ar 48000 -movflags +faststart \
  out/display-iq-reel.mp4
mkdir -p export && cp out/display-iq-reel.mp4 export/display-iq-reel.mp4
echo "Fertig: export/display-iq-reel.mp4"
