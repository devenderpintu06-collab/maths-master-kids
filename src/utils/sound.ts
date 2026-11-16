class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled = true;

  private getContext(): AudioContext | null {
    if (!this.enabled || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    delay = 0,
    gainPeak = 0.12
  ) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  playClick() {
    this.playTone(520, 0.06, 'triangle', 0, 0.07);
  }

  playPop() {
    this.playTone(660, 0.08, 'sine', 0, 0.08);
  }

  playCorrect() {
    this.playTone(523.25, 0.14, 'triangle', 0, 0.12);
    this.playTone(659.25, 0.16, 'triangle', 0.08, 0.12);
    this.playTone(783.99, 0.24, 'sine', 0.16, 0.14);
  }

  playTryAgain() {
    this.playTone(330, 0.14, 'sine', 0, 0.09);
    this.playTone(277.18, 0.2, 'sine', 0.1, 0.08);
  }

  playVictory() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.22, 'triangle', idx * 0.09, 0.13);
    });
  }

  playRocketBoost() {
    this.playTone(392, 0.12, 'triangle', 0, 0.1);
    this.playTone(587.33, 0.16, 'triangle', 0.07, 0.11);
    this.playTone(880, 0.22, 'sine', 0.14, 0.12);
  }
}

export const soundFx = new SoundEffects();
