#!/usr/bin/env bash
# Usage: make_reel.sh out.mp4 [music.mp3] ; expects s1.png..s4.png (1080x1920)
set -euo pipefail
OUT=${1:-reel.mp4}; MUSIC=${2:-}; mkdir -p "$(dirname "$OUT")"
D=3.5; X=0.5; N=4; FR=105   # seconds per slide, crossfade, slides, frames per slide (D*30)
TOTAL=$(python3 -c "print($N*$D-($N-1)*$X)")
V=""; for i in $(seq 0 $((N-1))); do
  V+="[$i:v]scale=2160:3840,zoompan=z='min(zoom+0.0005,1.05)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=$FR:s=1080x1920:fps=30,setsar=1,format=yuv420p[v$i];"
done
V+="[v0][v1]xfade=transition=fade:duration=$X:offset=3.0[x1];[x1][v2]xfade=transition=slideup:duration=$X:offset=6.0[x2];[x2][v3]xfade=transition=fade:duration=$X:offset=9.0[vout]"
if [ -n "$MUSIC" ]; then AIN=(-i "$MUSIC"); A="[4:a]atrim=0:$TOTAL,afade=t=in:d=1,afade=t=out:st=$(python3 -c "print($TOTAL-1.5)"):d=1.5[aout]";
else AIN=(-f lavfi -i "aevalsrc=0.12*sin(2*PI*130.81*t)*(0.8+0.2*sin(2*PI*0.25*t))+0.08*sin(2*PI*196*t)+0.05*sin(2*PI*261.63*t)*(0.7+0.3*sin(2*PI*0.5*t)):s=44100:d=$TOTAL")
  A="[4:a]afade=t=in:d=1,afade=t=out:st=$(python3 -c "print($TOTAL-1.5)"):d=1.5,aformat=channel_layouts=stereo[aout]"; fi
ffmpeg -loglevel error -y -loop 1 -t $D -i s1.png -loop 1 -t $D -i s2.png -loop 1 -t $D -i s3.png -loop 1 -t $D -i s4.png "${AIN[@]}" \
  -filter_complex "$V;$A" -map "[vout]" -map "[aout]" \
  -c:v libx264 -profile:v high -preset medium -crf 20 -pix_fmt yuv420p -r 30 -c:a aac -b:a 128k -ar 44100 -movflags +faststart -t $TOTAL "$OUT"
