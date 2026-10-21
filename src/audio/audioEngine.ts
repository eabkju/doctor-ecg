/**
 * Clinical Web Audio Engine
 * Generates calibrated ICU QRS monitor beeps, critical arrhythmia alarms, and S1/S2 heart sounds
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isInitialized: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (!this.isMuted && !this.isInitialized) {
      this.initContext();
      this.isInitialized = true;
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Plays realistic hospital monitor QRS beep
   * @param spO2 Oxygen saturation (90-100), adjusts pitch like real Philips/GE monitors
   */
  public playQRSBeep(spO2: number = 98) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Pitch mapped: 100% SpO2 -> 880Hz (A5), lower SpO2 -> lower pitch
      const baseFreq = 750 + Math.max(0, Math.min(100, spO2) - 80) * 12;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);

      // Crisp monitor chirp envelope (~80ms duration)
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.25, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // AudioContext audio policy handling
    }
  }

  /**
   * Plays physiological S1 ("lub") and S2 ("dub") heart sounds
   */
  public playHeartSound(sound: 'S1' | 'S2') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(sound === 'S1' ? 95 : 125, now);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(sound === 'S1' ? 70 : 90, now);
      osc.frequency.exponentialRampToValueAtTime(sound === 'S1' ? 40 : 55, now + (sound === 'S1' ? 0.12 : 0.09));

      const duration = sound === 'S1' ? 0.13 : 0.09;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.35, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch {
      // AudioContext policy
    }
  }

  /**
   * Plays ICU critical alarm chime (High urgency alarm)
   */
  public playCriticalAlarm() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [976, 784, 659].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.001, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.2, now + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.11);
      });
    } catch {
      // AudioContext policy
    }
  }
}

export const soundManager = new AudioEngine();
