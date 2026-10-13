#!/usr/bin/env bash
# Builds every video and still the home page uses, from the sources in ../ad (Remotion renders and their footage).
#
#   bash tools/media.sh
#
# Sources (all 1080×1920 unless noted):
#   ad/public/creator/home.mp4     Pexels 8048492, the raw talking clip (hero)
#   ad/out/web/web_home.mp4        Remotion `WebHome`: that clip with Zera's edit, English captions
#   ad/public/creator/signin.mp4   Pexels 8135646, raw (B-roll chapter)
#   ad/out/web/web_signin.mp4      Remotion `WebSignin`: its edit
#   ad/reference/car_reference.mp4 the reference reel; ad/out/car_edit.mp4 the same edit from other clips
# The hero is 1080p on desktop, 720p on phones (`*_m.mp4`); the editor's clip is all keyframes so scroll can scrub it.
set -euo pipefail
cd "$(dirname "$0")/.."
AD=../ad
OUT=public/media/site
mkdir -p "$OUT"

enc() { # src out width crf [extra input args...]
  local src=$1 out=$2 w=$3 crf=$4; shift 4
  ffmpeg -v error -y "$@" -i "$src" -an -vf "scale=$w:-2:flags=lanczos,format=yuv420p" \
    -c:v libx264 -preset slow -crf "$crf" -profile:v high -movflags +faststart "$out"
}
still() { # src out width at
  ffmpeg -v error -y -ss "$4" -i "$1" -frames:v 1 -vf "scale=$3:-2:flags=lanczos" -c:v libwebp -quality 82 "$2"
}

# hero: raw and edit, cut to the edit's length so they loop on the same frame
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$AD/out/web/web_home.mp4")
for w in 1080:"" 720:_m; do
  W=${w%%:*}; S=${w#*:}
  enc "$AD/public/creator/home.mp4" "$OUT/hero_raw$S.mp4" "$W" 25 -t "$D"
  enc "$AD/out/web/web_home.mp4" "$OUT/hero_edit$S.mp4" "$W" 25
done
still "$AD/public/creator/home.mp4" "$OUT/hero_raw.webp" 1080 0
still "$AD/out/web/web_home.mp4" "$OUT/hero_edit.webp" 1080 0

# B-roll chapter
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$AD/out/web/web_signin.mp4")
# (shown in a phone at most ~700 px tall, so 720p is enough everywhere)
enc "$AD/public/creator/signin.mp4" "$OUT/broll_raw.mp4" 720 25 -t "$D"
enc "$AD/out/web/web_signin.mp4" "$OUT/broll_edit.mp4" 720 25
still "$AD/public/creator/signin.mp4" "$OUT/broll_raw.webp" 1080 0
still "$AD/out/web/web_signin.mp4" "$OUT/broll_edit.webp" 1080 6

# reference to edit
enc "$AD/reference/car_reference.mp4" "$OUT/ref_reel.mp4" 720 28
enc "$AD/out/car_edit.mp4" "$OUT/ref_edit.mp4" 720 28 -t 14
still "$AD/reference/car_reference.mp4" "$OUT/ref_reel.webp" 720 0.5
still "$AD/out/car_edit.mp4" "$OUT/ref_edit.webp" 720 0.5

# editor: a scrubbable clip (every 2nd frame a keyframe) and its filmstrip
ffmpeg -v error -y -i "$AD/out/web/web_signin.mp4" -an -vf "scale=540:-2:flags=lanczos,format=yuv420p" \
  -c:v libx264 -preset slow -crf 28 -g 3 -keyint_min 3 -bf 0 -movflags +faststart "$OUT/editor.mp4"
still "$AD/out/web/web_signin.mp4" "$OUT/editor.webp" 540 0
ffmpeg -v error -y -i "$AD/out/web/web_signin.mp4" -vf "fps=12/10,scale=-2:160:flags=lanczos,tile=12x1" -frames:v 1 \
  -c:v libwebp -quality 78 "$OUT/filmstrip.webp"

# caption cards: stills from four clips
i=0
for spec in "$AD/public/creator/home.mp4:1.2" "$AD/public/creator/signin.mp4:2.5" "$AD/public/creator/home.mp4:6.5" "$AD/public/creator/signin.mp4:7.5"; do
  still "${spec%:*}" "$OUT/cap_$i.webp" 640 "${spec##*:}"; i=$((i+1))
done

# inline pills in the manifesto (16:9 crops, small)
pill() { ffmpeg -v error -y -ss "$3" -t 4 -i "$1" -an -vf "crop=iw:iw*9/16:0:ih*$4,scale=320:-2:flags=lanczos,format=yuv420p" \
  -c:v libx264 -preset slow -crf 27 -movflags +faststart "$OUT/$2.mp4"; }
pill "$AD/public/creator/home.mp4" pill_talk 1 0.12
pill "$AD/out/car_edit.mp4" pill_broll 4.3 0.35
pill "$AD/out/web/web_home.mp4" pill_edit 3.6 0.08

ls -la "$OUT"
