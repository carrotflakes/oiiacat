import { useEffect, useState } from "react";

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
    const ctx = new window.AudioContext();
    ctx.onstatechange = () => {
      console.log('AudioContext state changed:', ctx.state);
    };
    ctx.audioWorklet.addModule('/audio-processor.js').then(() => {
      setAudioContext(ctx);
    });
  }, [isPlaying, audioContext]);

  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  useEffect(() => {
    if (!audioContext || !arrayBuffer) return;
    audioContext.decodeAudioData(arrayBuffer, (buffer) => {
      setAudioBuffer(buffer);
    });
  }, [audioContext, arrayBuffer]);

  const [workletNode, setWorkletNode] = useState<AudioWorkletNode | null>(null);

  useEffect(() => {
    if (workletNode) {
      workletNode.port.postMessage({ type: 'playbackRate', value: playbackRate });
    }
  }, [playbackRate, workletNode]);

  useEffect(() => {
    if (isPlaying) {
      if (!audioContext || !audioBuffer || workletNode) return;
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const node = new AudioWorkletNode(audioContext, 'audio-frame-processor');
      node.connect(audioContext.destination);

      node.port.postMessage({
        type: 'buffer',
        buffer: audioBuffer.getChannelData(0),
        sampleRate: audioBuffer.sampleRate,
      });

      setWorkletNode(node);
    } else {
      if (workletNode) {
        workletNode.disconnect();
        setWorkletNode(null);
      }
    }
  }, [isPlaying, audioContext, audioBuffer, workletNode]);
}
