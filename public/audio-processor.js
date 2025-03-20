class AudioFrameProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.currentFrame = { start: 0, end: 0 };
    this.nextFrame = { start: 0, end: 0 };
    this.time = 0;
    this.buffer = null;
    this.playbackRate = 1;

    this.port.onmessage = (event) => {
      if (event.data.type === 'buffer') {
        this.buffer = event.data.buffer;
        this.minFrameSize = 0.025 * event.data.sampleRate | 0;
        this.currentFrame = this.getFrame(0);
        this.nextFrame = this.getFrame(this.currentFrame.end * this.playbackRate);
      } else if (event.data.type === 'playbackRate') {
        this.playbackRate = event.data.value;
      }
    };
  }

  getFrame(i) {
    if (!this.buffer) return { start: 0, end: 0 };
    i = (i + this.buffer.length) % this.buffer.length;
    
    let start = i;
    while (0 < start && !(this.buffer[start - 1] <= 0 && 0 < this.buffer[start])) {
      start -= 1;
    }
    let end = i + this.minFrameSize;
    while (end < this.buffer.length && !(this.buffer[end % this.buffer.length] <= 0 && 0 < this.buffer[(end + 1) % this.buffer.length])) {
      end += 1;
    }
    return { start, end };
  }

  process(inputs, outputs) {
    const output = outputs[0][0];
    if (!this.buffer) return true;

    const dTime = this.playbackRate + this.buffer.length;
    
    const overlap = this.minFrameSize / 4;
    for (let i = 0; i < output.length; i++) {
      const r = Math.min((this.currentFrame.end - this.currentFrame.start) / overlap, 1);
      const i1 = this.currentFrame.start;
      const i2 = this.nextFrame.start - (this.currentFrame.end - this.currentFrame.start) + this.buffer.length;
      output[i] = this.buffer[i1 % this.buffer.length] * r + this.buffer[i2 % this.buffer.length] * (1 - r);

      this.currentFrame.start += 1;
      if (this.currentFrame.start > this.currentFrame.end) {
        this.currentFrame = this.nextFrame;
        this.nextFrame = this.getFrame(Math.floor(this.time + (this.currentFrame.end - this.currentFrame.start) * this.playbackRate));
      }
      this.time = (this.time + dTime) % this.buffer.length;
    }

    return true;
  }
}

registerProcessor('audio-frame-processor', AudioFrameProcessor);