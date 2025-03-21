import { useEffect, useRef, useState } from "react";

const frames = [1, ...Array.from({ length: 246 - 189 }, (_, i) => i + 189)];

function Cat({
  isPlaying,
  playbackRate,
}: {
  isPlaying: boolean;
  playbackRate: number;
}) {
  const [frame, setFrame] = useState(0);

  const playbackRateRef = useRef(playbackRate);

  useEffect(() => {
    playbackRateRef.current = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    if (!isPlaying) return;

    setFrame(0);

    let playing = true;
    let lastTime = Date.now();
    function updateFrame() {
      if (!playing) return;

      const now = Date.now();
      const dTime = (now - lastTime) / 1000;
      lastTime = now;

      setFrame(
        (prev) =>
          (prev + dTime * 30 * playbackRateRef.current + (frames.length - 1)) %
          (frames.length - 1)
      );

      requestAnimationFrame(updateFrame);
    }
    updateFrame();

    return () => {
      playing = false;
    };
  }, [isPlaying]);

  // Preload images
  useEffect(() => {
    for (const frame of frames) {
      const preload = document.createElement("link");
      preload.className = "cat-image-preload";
      preload.rel = "preload";
      preload.href = getImagePath(frame);
      preload.as = "image";
      document.head.appendChild(preload);
    }

    return () => {
      const preloads = document.querySelectorAll(".cat-image-preload");
      for (const preload of preloads) {
        preload.remove();
      }
    };
  }, []);

  const currentFrameIndex = isPlaying ? Math.floor(frame) + 1 : 0;

  return (
    <img
      className="w-full h-full object-contain"
      src={getImagePath(frames[currentFrameIndex])}
      alt={`Image ${currentFrameIndex}`}
      draggable={false}
    />
  );
}

export default Cat;

function getImagePath(frame: number) {
  return `/cat/frame_${String(frame).padStart(6, "0")}.png`;
}
