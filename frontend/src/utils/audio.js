// Web Audio API ambient sound generator & breathing chimes
// Works entirely in-browser with zero external audio assets!

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.ambientNodes = null;
    this.currentAmbient = null;
    this.isPlaying = false;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft Tibetan singing bowl / chime for breathing phase change
  playChime(type = 'inhale') {
    try {
      this.initContext();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const freqMap = {
        inhale: 432, // Healing frequency A
        hold: 528,   // Transformation frequency C
        exhale: 396  // Calming frequency G
      };

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freqMap[type] || 432, this.ctx.currentTime);

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.8);
    } catch (e) {
      console.warn('Audio chime warning:', e);
    }
  }

  // Ambient sound synthesizer: Rain, Ocean Waves, or Forest Wind
  startAmbient(soundType = 'rain') {
    try {
      this.initContext();
      this.stopAmbient();

      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Pink/Brown noise generator for natural sounds
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (soundType === 'rain') {
          // Soft pink rain
          lastOut = (lastOut + 0.02 * white) / 1.02;
          data[i] = lastOut * 3.5;
        } else if (soundType === 'ocean') {
          // Rolling ocean brown noise
          lastOut = (lastOut + 0.015 * white) / 1.015;
          data[i] = lastOut * 4.0;
        } else {
          // Forest wind breeze
          lastOut = (lastOut + 0.03 * white) / 1.03;
          data[i] = lastOut * 3.0;
        }
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Filter to simulate sound texture
      const filter = this.ctx.createBiquadFilter();
      if (soundType === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
      } else if (soundType === 'ocean') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, this.ctx.currentTime);
      } else {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      }

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 1);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
      this.ambientNodes = { noise, gain };
      this.currentAmbient = soundType;
      this.isPlaying = true;
    } catch (e) {
      console.warn('Ambient sound warning:', e);
    }
  }

  stopAmbient() {
    if (this.ambientNodes) {
      try {
        const { noise, gain } = this.ambientNodes;
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
        setTimeout(() => {
          try { noise.stop(); } catch (err) { }
        }, 600);
      } catch (e) { }
      this.ambientNodes = null;
    }
    this.isPlaying = false;
    this.currentAmbient = null;
  }
}

export const soundEngine = new SoundEngine();

