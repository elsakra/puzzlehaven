const STORAGE_KEY = "puzzle_sound_muted";

export class SoundManager {
  private audioCtx: AudioContext | null = null;
  private _muted: boolean = false;

  constructor() {
    try {
      this._muted = localStorage.getItem(STORAGE_KEY) === "true";
    } catch {}
  }

  private getCtx(): AudioContext | null {
    if (this._muted) return null;
    if (!this.audioCtx) {
      try {
        this.audioCtx = new AudioContext();
      } catch {
        return null;
      }
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  private tone(
    freq: number,
    duration: number,
    gainPeak: number,
    type: OscillatorType = "sine",
    startTime?: number,
    freqEnd?: number
  ): void {
    const ctx = this.getCtx();
    if (!ctx) return;

    const t = startTime ?? ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (freqEnd !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(freqEnd, t + duration);
    }

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(gainPeak, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc.start(t);
    osc.stop(t + duration + 0.015);
  }

  /** Soft pop when picking up a piece */
  pickup(): void {
    this.tone(660, 0.08, 0.18, "sine", undefined, 440);
  }

  /** Satisfying click + chime when a piece snaps into place */
  snap(): void {
    const ctx = this.getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    // Short sharp click
    this.tone(1400, 0.018, 0.28, "square", t);
    // Ringing chime
    this.tone(1047, 0.28, 0.32, "sine", t);
  }

  /** Deeper resonant snap when two groups merge */
  merge(): void {
    const ctx = this.getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    this.tone(900, 0.018, 0.22, "square", t);
    this.tone(698, 0.32, 0.28, "sine", t);
  }

  /** Ascending arpeggio fanfare on puzzle completion — C5 E5 G5 C6 */
  complete(): void {
    const ctx = this.getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      this.tone(freq, 0.35, 0.3, "sine", t + i * 0.14);
    });
  }

  /** Gentle ping for hints */
  hint(): void {
    this.tone(1047, 0.35, 0.22, "sine");
  }

  get muted(): boolean {
    return this._muted;
  }

  toggleMute(): boolean {
    this._muted = !this._muted;
    try {
      localStorage.setItem(STORAGE_KEY, String(this._muted));
    } catch {}
    return this._muted;
  }

  destroy(): void {
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }
}
