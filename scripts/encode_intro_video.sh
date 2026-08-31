#!/bin/bash
# Encodage de la vidéo d'intro Café Concept pour scrub au scroll.
# All-intra (-g 1) = chaque frame est une keyframe → seeks instantanés,
# indispensable pour un scrub GSAP fluide image-par-image.
set -e
SRC="/home/z/my-project/analysis/intro_src.mp4"
OUT="/home/z/my-project/public/video"
mkdir -p "$OUT"

# 1) Desktop — 720p, tout intra, faststart
ffmpeg -y -v error -i "$SRC" -an \
  -c:v libx264 -preset fast -crf 23 \
  -g 1 -keyint_min 1 -sc_threshold 0 \
  -pix_fmt yuv420p -movflags +faststart \
  "$OUT/intro.mp4"

# 2) Mobile — 540p, tout intra
ffmpeg -y -v error -i "$SRC" -an \
  -c:v libx264 -preset fast -crf 26 \
  -vf scale=960:540 \
  -g 1 -keyint_min 1 -sc_threshold 0 \
  -pix_fmt yuv420p -movflags +faststart \
  "$OUT/intro-540.mp4"

# 3) Poster (première frame)
ffmpeg -y -v error -i "$SRC" -frames:v 1 -q:v 3 "$OUT/intro-poster.jpg"

# 4) Still final (dernière frame, logo révélé) — fond du hero, continuité parfaite
ffmpeg -y -v error -sseof -0.08 -i "$SRC" -frames:v 1 -q:v 3 "$OUT/hero-still.jpg"

echo "--- OK ---"
ls -la "$OUT"
