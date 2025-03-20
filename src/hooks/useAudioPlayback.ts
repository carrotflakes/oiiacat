import { useEffect, useRef, useState } from "react";

export function useAudioPlayback({ audioUrl, isPlaying, playbackRate }: {
  audioUrl: string;
  isPlaying: boolean;
  playbackRate: number;
}) {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer | null>(null);
  useEffect(() => {
    (async () => {
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      setArrayBuffer(arrayBuffer);
    })()
  }, [setArrayBuffer, audioUrl]);

  useEffect(() => {
    if (!isPlaying || audioContext) return;
    setAudioContext(new window.AudioContext());
  }, [isPlaying, audioContext]);

  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  useEffect(() => {
    if (!audioContext || !arrayBuffer) return;
    audioContext.decodeAudioData(arrayBuffer, (buffer) => {
      setAudioBuffer(buffer);
    });
  }, [audioContext, arrayBuffer]);

  const [scriptProcessorNode, setScriptProcessorNode] = useState<ScriptProcessorNode | null>(null);
  const playbackRateRef = useRef(playbackRate);

  useEffect(() => {
    playbackRateRef.current = playbackRate;
  }
    , [playbackRate]);

  useEffect(() => {
    if (isPlaying) {
      if (!audioContext || !audioBuffer || scriptProcessorNode) return;
      const newScriptProcessorNode = audioContext.createScriptProcessor(4096, 1, 1);
      newScriptProcessorNode.connect(audioContext.destination);
      const buffer = audioBuffer.getChannelData(0);
      function getFrame(i: number) {
        let start = i;
        while (0 < start && !(buffer[start - 1] <= 0 && 0 < buffer[start])) {
          start -= 1;
        }
        let end = Math.min(i + 1000, buffer.length - 1);
        while (end < buffer.length && !(buffer[end] <= 0 && 0 < buffer[end + 1])) {
          end += 1;
        }
        return { start, end };
      }
      let currentFrame = getFrame(0);
      let time = 0;
      newScriptProcessorNode.onaudioprocess = (e) => {
        const outputBuffer = e.outputBuffer.getChannelData(0);
        const dTime = playbackRateRef.current + buffer.length;
        for (let i = 0; i < outputBuffer.length; i++) {
          outputBuffer[i] = buffer[currentFrame.start % buffer.length];
          currentFrame.start += 1;
          if (currentFrame.start > currentFrame.end) {
            currentFrame = getFrame(Math.floor(time));
          }
          time = (time + dTime) % buffer.length;
        }
      };
      setScriptProcessorNode(newScriptProcessorNode);
    } else {
      if (scriptProcessorNode) {
        scriptProcessorNode.disconnect();
        setScriptProcessorNode(null);
      }
    }
  }, [isPlaying, audioContext, audioBuffer, scriptProcessorNode]);
}
