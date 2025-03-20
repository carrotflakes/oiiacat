mkdir -p output3 && for f in output2/*.png; do convert "$f" -gravity center -crop 800x800+0+0 +repage "output3/$(basename "$f")"; done
