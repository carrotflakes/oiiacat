import { useState } from "react";
import Cat from "./components/Cat";
import PlaybackControl from "./components/PlaybackControl";
import { useAudioPlayback } from "./hooks/useAudioPlayback";

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showOverlay, setShowOverlay] = useState(true);

  useAudioPlayback({
    audioUrl: "/oiia1.mp3",
    isPlaying,
    playbackRate,
  });

  const handleOverlayClick = () => {
    setShowOverlay(false);
  };

  return (
    <div className="w-dvw h-dvh max-h-dvh p-10 flex flex-col justify-center items-center bg-[#00fc0a] overflow-hidden touch-none select-none relative">
      <div className="min-h-0 basis-100 grow shrink">
        <Cat isPlaying={isPlaying} playbackRate={expScale(playbackRate)} />
      </div>
      <PlaybackControl
        min={-1.0}
        max={3.0}
        playbackRate={playbackRate}
        onPlaybackRateChange={setPlaybackRate}
        onPlayStateChange={setIsPlaying}
      />

      {/* Frosted glass overlay */}
      {showOverlay && (
        <div
          className="absolute inset-0 backdrop-blur-lg backdrop-brightness-80 z-50 cursor-pointer flex items-center justify-center"
          onClick={handleOverlayClick}
          onTouchEnd={handleOverlayClick}
        >
          <p className="px-10 py-4 text-2xl font-semibold text-white border rounded-4xl">Tap</p>
        </div>
      )}
    </div>
  );
}

export default App;

function expScale(value: number) {
  return value > 0.001
    ? Math.pow(value, 1.8)
    : value < -0.001
    ? -Math.pow(-value, 1.8)
    : 0;
}
