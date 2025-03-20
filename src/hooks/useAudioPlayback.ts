import { useEffect, useState } from "react";

export function useAudioPlayback({ audioUrl, isPlaying, playbackRate }: {
  audioUrl: string;
  isPlaying: boolean;
  playbackRate: number;
}) {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [sourceNode, setSourceNode] = useState<AudioBufferSourceNode | null>(null);

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

  useEffect(() => {
    if (isPlaying) {
      if (!audioContext || !audioBuffer || sourceNode) return;
      const newSourceNode = audioContext.createBufferSource();
      newSourceNode.buffer = audioBuffer;
      newSourceNode.connect(audioContext.destination);
      newSourceNode.loop = true;
      newSourceNode.playbackRate.value = playbackRate;
      newSourceNode.start(0);
      setSourceNode(newSourceNode);
    } else {
      if (sourceNode) {
        sourceNode.stop();
        setSourceNode(null);
      }
    }
  }, [audioBuffer, audioContext, isPlaying, playbackRate, sourceNode]);

  useEffect(() => {
    if (sourceNode) {
      sourceNode.playbackRate.value = playbackRate;
    }
  }, [playbackRate, sourceNode]);
}
