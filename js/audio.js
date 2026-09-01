// Smell Me - Web Audio Sensory Engine (Procedural Sound Synthesizer)

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem('smellme_sound_muted') === 'true';
    this.ambientGain = null;
    this.isAmbientPlaying = false;
    this.ambientNodes = [];
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('smellme_sound_muted', this.isMuted);
    if (this.isMuted && this.ambientGain) {
      this.ambientGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
    }
    return this.isMuted;
  }

  // Realistic fine perfume atomizer spritz (noise + bandpass filter envelope)
  playSpritz() {
    if (this.isMuted) return;
    this.init();

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const duration = 0.45;

    // Buffer for white noise
    const bufferSize = ctx.sampleRate * duration;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    // Bandpass filter for misty atomizer hiss
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(3200, now);
    bandpass.frequency.exponentialRampToValueAtTime(1400, now + duration);
    bandpass.Q.setValueAtTime(3.5, now);

    // Highpass to eliminate heavy thumps
    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(1200, now);

    // Gain envelope (sharp attack, smooth tail)
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.35, now + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    whiteNoise.connect(bandpass);
    bandpass.connect(highpass);
    highpass.connect(gainNode);
    gainNode.connect(ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + duration);
  }

  // Crystal flacon clink / glass resonance
  playCrystalClink() {
    if (this.isMuted) return;
    this.init();

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const freqs = [2100, 4200, 6300];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq + (idx * 20), now);

      gain.gain.setValueAtTime(0.08 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6 + (idx * 0.2));

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.0);
    });
  }

  // Luxury bag add / golden chime
  playCartChime() {
    if (this.isMuted) return;
    this.init();

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Major Gold Chime)

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + (idx * 0.06);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  }

  // Subtle interactive soft tick for buttons & tabs
  playTick() {
    if (this.isMuted) return;
    this.init();

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.035);
  }
}

export const sound = new SoundEngine();
