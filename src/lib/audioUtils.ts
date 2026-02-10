"use client";

/**
 * SoundManager handles advanced audio synthesis using the Web Audio API.
 * Provides realistic slot machine sounds: mechanical hum, metallic clicks, and reel stops.
 */
class SoundManager {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;
  private ambientGain: GainNode | null = null;
  private ambientOsc: OscillatorNode | null = null;

  private initCtx() {
    if (!this.ctx && globalThis.window !== undefined) {
      const AudioContextClass = globalThis.window.AudioContext || (globalThis.window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stopAmbientHum();
    }
  }

  /**
   * Starts a low mechanical hum to simulate a spinning motor
   */
  startAmbientHum() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    this.stopAmbientHum();

    this.ambientOsc = this.ctx.createOscillator();
    this.ambientGain = this.ctx.createGain();

    // Use a complex low-frequency wave (Triangle + Sine for "motor" feel)
    this.ambientOsc.type = "triangle";
    this.ambientOsc.frequency.setValueAtTime(45, this.ctx.currentTime); // Low rumble

    this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.ambientGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.1);

    // Apply a subtle LFO to the volume for "vibration"
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(8, this.ctx.currentTime); // 8Hz vibration
    lfoGain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(this.ambientGain.gain);
    lfo.start();

    this.ambientOsc.connect(this.ambientGain);
    this.ambientGain.connect(this.ctx.destination);

    this.ambientOsc.start();
  }

  /**
   * Stops the mechanical hum smoothly
   */
  stopAmbientHum() {
    if (this.ambientGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.ambientGain.gain.cancelScheduledValues(now);
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
      this.ambientGain.gain.linearRampToValueAtTime(0, now + 0.1);
      setTimeout(() => {
        this.ambientOsc?.stop();
        this.ambientOsc = null;
        this.ambientGain = null;
      }, 150);
    }
  }

  /**
   * Plays a sharp metallic mechanical "click" (high anticipation)
   */
  playSpin() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Layer 1: Sharp snap (Square wave)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.03);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.03);

    // Layer 2: Metallic rattle (High-pass filtered noise)
    const bufferSize = this.ctx.sampleRate * 0.02;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(2000, now);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.03, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start();
  }

  /**
   * Plays a heavy metallic "thud" when a reel stops
   */
  playReelStop() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Layer 1: Low impact (Sine)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.1);

    // Layer 2: Metallic resonance (Square)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = "square";
    osc2.frequency.setValueAtTime(60, now);
    gain2.gain.setValueAtTime(0.05, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start();
    osc2.stop(now + 0.05);
  }

  /**
   * Plays a celebratory fanfare/ping sound
   */
  playWin() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      
      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.3, now + i * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.6);
      
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.7);
    });
  }
}

export const soundManager = new SoundManager();
