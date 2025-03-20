import { useState } from "react";
import Cat from "./components/Cat";
import PlaybackControl from "./components/PlaybackControl";
import { useAudioPlayback } from "./hooks/useAudioPlayback";

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  useAudioPlayback({
    audioUrl: "/oiia1.mp3",
    isPlaying,
    playbackRate,
  });

  return (
    <div className="w-dvw h-dvh max-h-dvh p-10 flex flex-col justify-center items-center bg-[#00fc0a] overflow-hidden touch-none select-none">
      <div className="min-h-0 basis-100 grow shrink">
        <Cat isPlaying={isPlaying} playbackRate={expScale(playbackRate)} />
      </div>
      <PlaybackControl
        min={-3.0}
        max={3.0}
        playbackRate={playbackRate}
        onPlaybackRateChange={setPlaybackRate}
        onPlayStateChange={setIsPlaying}
      />
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
