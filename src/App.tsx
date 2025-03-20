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
        <Cat isPlaying={isPlaying} playbackRate={Math.pow(playbackRate, 1.8)} />
      </div>
      <PlaybackControl
        playbackRate={playbackRate}
        onPlaybackRateChange={setPlaybackRate}
        onPlayStateChange={setIsPlaying}
      />
    </div>
  );
}

export default App;
