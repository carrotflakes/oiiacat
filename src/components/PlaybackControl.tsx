import { useEffect, useState } from "react";

function PlaybackControl({
  playbackRate,
  onPlaybackRateChange,
  onPlayStateChange,
}: {
  playbackRate: number;
  onPlaybackRateChange: (rate: number) => void;
  onPlayStateChange: (play: boolean) => void;
}) {
  const [playAlways, setPlayAlways] = useState(false);
  const [isPressing, setIsPressing] = useState(false);

  useEffect(() => {
    onPlayStateChange(playAlways || isPressing);
  }, [playAlways, onPlayStateChange, isPressing]);

  const handlePointerDown = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onPlaybackRateChange(0.1 + x * 2.9);
    setIsPressing(true);
    e.preventDefault();
    e.stopPropagation();

    const handlePointerMove = (e: PointerEvent) => {
      if (e.buttons === 1) {
        const x = Math.max(
          0,
          Math.min(1, (e.clientX - rect.left) / rect.width)
        );
        onPlaybackRateChange(0.1 + x * 2.9);
      }
    };

    const handlePointerUp = () => {
      setIsPressing(false);
      document.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("pointermove", handlePointerMove);
    };
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("pointermove", handlePointerMove);
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <div
        className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center cursor-pointer opacity-75  hover:opacity-100 transition-opacity"
        onClick={() => setPlayAlways(!playAlways)}
      >
        {playAlways && <div className="w-6 h-6 rounded-full bg-black/24" />}
      </div>
      <div
        className="w-[20rem] h-10 p-1 bg-white/80 rounded-lg overflow-hidden opacity-75 hover:opacity-100 cursor-pointer transition-opacity"
        onPointerDown={handlePointerDown}
      >
        <div
          className="w-1 h-full border-r-4 border-black/25"
          style={{ width: `${((playbackRate - 0.1) / 2.9) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default PlaybackControl;
