export interface SnapAnimData {
  pieceId: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

interface SnapAnim extends SnapAnimData {
  startTime: number;
  duration: number;
}

export interface FloatingText {
  text: string;
  worldX: number;
  worldY: number;
  startTime: number;
  duration: number;
  isCombo: boolean;
}

export interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  alpha: number;
  alphaDecay: number;
  w: number;
  h: number;
}

const SNAP_DURATION_MS = 180;
const FLOAT_DURATION_MS = 900;
const CONFETTI_COLORS = [
  "#fbbf24", "#f97316", "#fb7185", "#34d399",
  "#818cf8", "#fcd34d", "#38bdf8", "#a78bfa",
];

function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

export class AnimationManager {
  private snaps = new Map<number, SnapAnim>();
  private floats: FloatingText[] = [];
  private confetti: ConfettiParticle[] = [];

  addSnap(data: SnapAnimData[]): void {
    const now = performance.now();
    for (const d of data) {
      this.snaps.set(d.pieceId, { ...d, startTime: now, duration: SNAP_DURATION_MS });
    }
  }

  addFloatingText(text: string, worldX: number, worldY: number, isCombo = false): void {
    this.floats.push({
      text,
      worldX,
      worldY,
      startTime: performance.now(),
      duration: FLOAT_DURATION_MS,
      isCombo,
    });
  }

  /**
   * Returns the current lerped visual position for a piece in a snap animation.
   * Returns null if the piece has no active animation (use logical piece.x/y instead).
   */
  getVisualPos(pieceId: number): { x: number; y: number } | null {
    const anim = this.snaps.get(pieceId);
    if (!anim) return null;
    const elapsed = performance.now() - anim.startTime;
    if (elapsed >= anim.duration) {
      this.snaps.delete(pieceId);
      return null;
    }
    const t = easeOutQuad(elapsed / anim.duration);
    return {
      x: anim.fromX + (anim.toX - anim.fromX) * t,
      y: anim.fromY + (anim.toY - anim.fromY) * t,
    };
  }

  /** Returns active floating texts, pruning expired ones in-place. */
  getActiveFloats(): FloatingText[] {
    const now = performance.now();
    this.floats = this.floats.filter((f) => now - f.startTime < f.duration);
    return this.floats;
  }

  /** Spawns confetti from the center area of the canvas on puzzle completion. */
  triggerConfetti(canvasW: number, canvasH: number): void {
    const speedBase = canvasW * 0.006;
    const gravBase = canvasH * 0.00016;
    this.confetti = [];
    for (let i = 0; i < 120; i++) {
      const angle = (Math.random() * Math.PI * 1.4) - Math.PI * 0.7; // upward cone
      const speed = speedBase * (0.5 + Math.random() * 1.5);
      this.confetti.push({
        x: canvasW * 0.25 + Math.random() * canvasW * 0.5,
        y: canvasH * 0.45 + Math.random() * canvasH * 0.15,
        vx: Math.cos(angle) * speed,
        vy: -Math.abs(Math.sin(angle) * speed) - speedBase * 0.5,
        gravity: gravBase + Math.random() * gravBase,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.18,
        alpha: 1,
        alphaDecay: 0.004 + Math.random() * 0.004,
        w: 5 + Math.random() * 7,
        h: 3 + Math.random() * 4,
      });
    }
  }

  /**
   * Advances confetti physics by one frame and returns the still-alive particles.
   * Call once per render frame.
   */
  stepAndGetConfetti(): ConfettiParticle[] {
    if (this.confetti.length === 0) return this.confetti;
    const alive: ConfettiParticle[] = [];
    for (const p of this.confetti) {
      p.vy += p.gravity;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.alpha -= p.alphaDecay;
      if (p.alpha > 0) alive.push(p);
    }
    this.confetti = alive;
    return alive;
  }

  clear(): void {
    this.snaps.clear();
    this.floats = [];
    this.confetti = [];
  }
}
