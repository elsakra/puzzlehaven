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

const SNAP_DURATION_MS = 180;
const FLOAT_DURATION_MS = 900;

function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

export class AnimationManager {
  private snaps = new Map<number, SnapAnim>();
  private floats: FloatingText[] = [];

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

  clear(): void {
    this.snaps.clear();
    this.floats = [];
  }
}
