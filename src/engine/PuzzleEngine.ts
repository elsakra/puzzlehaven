import {
  PieceDefinition,
  PieceState,
  PuzzleConfig,
  GameState,
  PIECE_PRESETS,
} from "./types";
import { generatePieces } from "./PieceGenerator";
import { renderAllPieces, RenderedPiece } from "./PieceRenderer";
import { InteractionHandler } from "./InteractionHandler";
import { SoundManager } from "./SoundManager";
import { AnimationManager, ConfettiParticle } from "./AnimationManager";

export interface PuzzleCallbacks {
  onTimerUpdate?: (seconds: number) => void;
  onMoveCountUpdate?: (count: number) => void;
  onComplete?: (seconds: number, moves: number) => void;
  onProgress?: (snapped: number, total: number) => void;
  onTransformChange?: (isTransformed: boolean) => void;
  onScoreUpdate?: (score: number) => void;
}

export class PuzzleEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private image: HTMLImageElement | null = null;
  private config!: PuzzleConfig;
  private definitions: PieceDefinition[] = [];
  private rendered: RenderedPiece[] = [];
  private state: GameState = {
    pieces: [],
    timerSeconds: 0,
    moveCount: 0,
    completed: false,
    startedAt: null,
    score: 0,
    lastSnapAt: null,
  };
  private interaction: InteractionHandler | null = null;
  private animFrameId: number = 0;
  private timerInterval: number = 0;
  private callbacks: PuzzleCallbacks = {};
  private showPreview: boolean = false;
  private puzzleId: string = "";

  // Base transform — set by fitToCanvas, recalculated on resize
  private baseScale: number = 1;
  private basePanX: number = 0;
  private basePanY: number = 0;

  // User transform — accumulates user pan/zoom, reset on resize
  private userScale: number = 1;
  private userPanX: number = 0;
  private userPanY: number = 0;

  // Combined rendering transform
  private scale: number = 1;
  private panX: number = 0;
  private panY: number = 0;

  private sound: SoundManager;
  private anim: AnimationManager;

  // Hint system
  private hintPieceId: number | null = null;
  private hintStartTime: number = 0;
  private lastHintTime: number = 0;
  private readonly HINT_DURATION_MS = 3000;
  private readonly HINT_COOLDOWN_MS = 10000;

  // Undo system
  private moveHistory: GameState[] = [];
  private readonly MAX_HISTORY = 50;

  constructor(canvas: HTMLCanvasElement, callbacks?: PuzzleCallbacks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    if (callbacks) this.callbacks = callbacks;
    this.sound = new SoundManager();
    this.anim = new AnimationManager();
  }

  async init(
    imageUrl: string,
    pieceCount: number,
    puzzleId: string,
    seed?: number
  ) {
    this.puzzleId = puzzleId;
    this.image = await this.loadImage(imageUrl);

    const preset = PIECE_PRESETS[pieceCount] || PIECE_PRESETS[48];
    const pieceWidth = Math.floor(this.image.width / preset.cols);
    const pieceHeight = Math.floor(this.image.height / preset.rows);
    const tabSize = Math.floor(Math.min(pieceWidth, pieceHeight) * 0.2);

    this.config = {
      rows: preset.rows,
      cols: preset.cols,
      pieceWidth,
      pieceHeight,
      tabSize,
      imageWidth: this.image.width,
      imageHeight: this.image.height,
    };

    this.definitions = generatePieces(this.config, seed ?? 42);
    this.rendered = renderAllPieces(this.definitions, this.image, this.config);

    const saved = this.loadState();
    if (saved) {
      this.state = saved;
      // Reset startedAt so the timer re-arms on next interaction.
      // Without this, the timer never starts because onInteractionStart
      // guards on `!this.state.startedAt`, which would be truthy from the save.
      this.state.startedAt = null;
    } else {
      this.initFreshState();
    }
    // Ensure backward-compatible saves have score fields
    if (this.state.score === undefined) this.state.score = 0;
    if (this.state.lastSnapAt === undefined) this.state.lastSnapAt = null;

    this.userScale = 1;
    this.userPanX = 0;
    this.userPanY = 0;

    this.fitToCanvas();
    this.setupInteraction();
    this.startRenderLoop();
    this.callbacks.onProgress?.(
      this.state.pieces.filter((p) => p.snapped).length,
      this.state.pieces.length
    );
    this.callbacks.onTimerUpdate?.(this.state.timerSeconds);
    this.callbacks.onMoveCountUpdate?.(this.state.moveCount);
    this.callbacks.onScoreUpdate?.(this.state.score);
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  private initFreshState() {
    const { imageWidth, imageHeight, tabSize } = this.config;

    const boardRight = imageWidth + tabSize;
    const boardBottom = imageHeight + tabSize;
    const margin = tabSize * 2;

    const zones: { x: number; y: number; w: number; h: number }[] = [
      {
        x: boardRight + margin,
        y: -margin,
        w: imageWidth * 0.6,
        h: imageHeight + margin * 2,
      },
      {
        x: -margin,
        y: boardBottom + margin,
        w: imageWidth + margin * 2,
        h: imageHeight * 0.4,
      },
      {
        x: boardRight + margin,
        y: boardBottom + margin * 0.5,
        w: imageWidth * 0.4,
        h: imageHeight * 0.4,
      },
    ];

    this.state = {
      pieces: this.definitions.map((def, i) => {
        const zone = zones[i % zones.length];
        return {
          id: def.id,
          x: zone.x + Math.random() * zone.w,
          y: zone.y + Math.random() * zone.h,
          snapped: false,
          groupId: i,
          zIndex: i,
        };
      }),
      timerSeconds: 0,
      moveCount: 0,
      completed: false,
      startedAt: null,
      score: 0,
      lastSnapAt: null,
    };
  }

  private fitToCanvas() {
    const { imageWidth, imageHeight, tabSize } = this.config;
    const totalW = imageWidth * 2.0;
    const totalH = imageHeight * 1.7;

    const scaleX = this.canvas.width / totalW;
    const scaleY = this.canvas.height / totalH;
    this.baseScale = Math.min(scaleX, scaleY, 1);

    const usedW = totalW * this.baseScale;
    const usedH = totalH * this.baseScale;
    this.basePanX = (this.canvas.width - usedW) / 2 + tabSize * this.baseScale;
    this.basePanY = (this.canvas.height - usedH) / 2 + tabSize * this.baseScale;

    this.applyTransform();
  }

  private applyTransform() {
    this.scale = this.baseScale * this.userScale;
    this.panX = this.basePanX + this.userPanX;
    this.panY = this.basePanY + this.userPanY;
    this.interaction?.setTransform(this.scale, this.panX, this.panY);
  }

  private isViewTransformed(): boolean {
    return (
      Math.abs(this.userScale - 1) > 0.01 ||
      Math.abs(this.userPanX) > 5 ||
      Math.abs(this.userPanY) > 5
    );
  }

  resetView() {
    this.userScale = 1;
    this.userPanX = 0;
    this.userPanY = 0;
    this.applyTransform();
    this.callbacks.onTransformChange?.(false);
  }

  zoomIn() {
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;
    const factor = 1.25;
    const newScale = Math.min(60, this.scale * factor);
    const worldX = (cx - this.panX) / this.scale;
    const worldY = (cy - this.panY) / this.scale;
    this.scale = newScale;
    this.panX = cx - worldX * this.scale;
    this.panY = cy - worldY * this.scale;
    this.userScale = this.scale / this.baseScale;
    this.userPanX = this.panX - this.basePanX;
    this.userPanY = this.panY - this.basePanY;
    this.interaction?.setTransform(this.scale, this.panX, this.panY);
    this.callbacks.onTransformChange?.(this.isViewTransformed());
  }

  zoomOut() {
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;
    const factor = 1 / 1.25;
    const newScale = Math.max(0.02, this.scale * factor);
    const worldX = (cx - this.panX) / this.scale;
    const worldY = (cy - this.panY) / this.scale;
    this.scale = newScale;
    this.panX = cx - worldX * this.scale;
    this.panY = cy - worldY * this.scale;
    this.userScale = this.scale / this.baseScale;
    this.userPanX = this.panX - this.basePanX;
    this.userPanY = this.panY - this.basePanY;
    this.interaction?.setTransform(this.scale, this.panX, this.panY);
    this.callbacks.onTransformChange?.(this.isViewTransformed());
  }

  private setupInteraction() {
    this.interaction = new InteractionHandler(
      this.canvas,
      this.state.pieces,
      this.definitions,
      this.rendered,
      this.config
    );

    this.interaction.setTransform(this.scale, this.panX, this.panY);

    this.interaction.onInteractionStart = () => {
      if (!this.state.startedAt) {
        this.state.startedAt = Date.now();
        this.startTimer();
      }
    };

    this.interaction.onDragStart = () => {
      this.pushHistory();
    };

    this.interaction.onPiecePickup = () => {
      this.sound.pickup();
    };

    this.interaction.onPieceMove = () => {
      this.state.moveCount++;
      this.callbacks.onMoveCountUpdate?.(this.state.moveCount);
      this.saveState();
    };

    this.interaction.onSnapAnimate = (data) => {
      this.anim.addSnap(data);
    };

    this.interaction.onPieceSnap = (pieceId: number) => {
      const snapped = this.state.pieces.filter((p) => p.snapped).length;
      this.callbacks.onProgress?.(snapped, this.state.pieces.length);

      // Scoring: +10 per snap; +50 combo bonus if snapped within 5 s of last snap
      const now = Date.now();
      let points = 10;
      const isCombo = this.state.lastSnapAt !== null && now - this.state.lastSnapAt < 5000;
      if (isCombo) points += 50;
      this.state.score += points;
      this.state.lastSnapAt = now;
      this.callbacks.onScoreUpdate?.(this.state.score);

      // Floating score text at piece's correct board position
      const def = this.definitions[pieceId];
      if (def) {
        const tx = def.correctX + def.width / 2;
        const ty = def.correctY + def.height / 2;
        this.anim.addFloatingText(isCombo ? `+${points} Combo!` : `+${points}`, tx, ty, isCombo);
      }

      this.saveState();

      if (snapped === this.state.pieces.length) {
        this.state.completed = true;
        this.stopTimer();
        this.sound.complete();
        this.anim.triggerConfetti(this.canvas.width, this.canvas.height);
        this.callbacks.onComplete?.(
          this.state.timerSeconds,
          this.state.moveCount
        );
        this.clearSavedState();
      } else {
        this.sound.snap();
      }
    };

    this.interaction.onGroupMerge = () => {
      // +5 per group merge
      this.state.score += 5;
      this.callbacks.onScoreUpdate?.(this.state.score);
      this.sound.merge();
    };

    this.interaction.onTransformChange = (scale, panX, panY) => {
      this.scale = scale;
      this.panX = panX;
      this.panY = panY;
      if (this.baseScale !== 0) {
        this.userScale = scale / this.baseScale;
        this.userPanX = panX - this.basePanX;
        this.userPanY = panY - this.basePanY;
      }
      this.callbacks.onTransformChange?.(this.isViewTransformed());
    };
  }

  private startTimer() {
    this.timerInterval = window.setInterval(() => {
      this.state.timerSeconds++;
      this.callbacks.onTimerUpdate?.(this.state.timerSeconds);
    }, 1000);
  }

  private stopTimer() {
    clearInterval(this.timerInterval);
  }

  private startRenderLoop() {
    const render = () => {
      this.draw();
      this.animFrameId = requestAnimationFrame(render);
    };
    this.animFrameId = requestAnimationFrame(render);
  }

  private draw() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.drawBackground();

    ctx.save();
    ctx.translate(this.panX, this.panY);
    ctx.scale(this.scale, this.scale);

    this.drawBoard();

    if (this.showPreview && this.image) {
      ctx.globalAlpha = 0.25;
      ctx.drawImage(this.image, 0, 0);
      ctx.globalAlpha = 1;
    }

    const sorted = [...this.state.pieces].sort((a, b) => a.zIndex - b.zIndex);

    // Determine which group is being lifted for the scale effect
    const liftedId = this.interaction?.liftedPieceId ?? null;
    const liftedGroupId =
      liftedId !== null ? (this.state.pieces[liftedId]?.groupId ?? null) : null;

    for (const piece of sorted) {
      const rp = this.rendered[piece.id];
      if (!rp) continue;

      // Use animated visual position (lerp to snap target) or logical position
      const visual = this.anim.getVisualPos(piece.id);
      const px = visual?.x ?? piece.x;
      const py = visual?.y ?? piece.y;
      const drawX = px - rp.offsetX;
      const drawY = py - rp.offsetY;

      const isLifted = liftedGroupId !== null && piece.groupId === liftedGroupId;

      if (isLifted) {
        const def = this.definitions[piece.id];
        const cx = px + (def?.width ?? 0) / 2;
        const cy = py + (def?.height ?? 0) / 2;
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 20 / this.scale;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 6 / this.scale;
        ctx.translate(cx, cy);
        ctx.scale(1.05, 1.05);
        ctx.translate(-cx, -cy);
        ctx.drawImage(rp.canvas as HTMLCanvasElement, drawX, drawY);
        ctx.restore();
      } else {
        ctx.drawImage(rp.canvas as HTMLCanvasElement, drawX, drawY);
      }
    }

    this.drawHint(ctx);
    this.drawFloatingTexts(ctx);

    ctx.restore();

    // Confetti renders in screen space (not affected by world pan/zoom)
    const confetti = this.anim.stepAndGetConfetti();
    if (confetti.length > 0) {
      this.drawConfetti(confetti);
    }
  }

  private drawFloatingTexts(ctx: CanvasRenderingContext2D) {
    const floats = this.anim.getActiveFloats();
    if (floats.length === 0) return;

    const now = performance.now();
    for (const ft of floats) {
      const elapsed = now - ft.startTime;
      const progress = elapsed / ft.duration;
      // Fade out over the second half; keep full opacity the first half
      const alpha = Math.max(0, 1 - progress * 2);
      if (alpha <= 0) continue;

      // Drift upward 50 world units over the animation lifetime
      const driftY = progress * 50;

      ctx.save();
      ctx.globalAlpha = alpha;

      // Keep font size constant in screen pixels regardless of world zoom
      const screenPx = ft.isCombo ? 15 : 13;
      const worldPx = Math.round(screenPx / this.scale);
      ctx.font = `bold ${worldPx}px -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Legibility shadow
      ctx.shadowColor = "rgba(0,0,0,0.7)";
      ctx.shadowBlur = 4 / this.scale;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 1 / this.scale;

      ctx.fillStyle = ft.isCombo ? "#ffd700" : "#fbbf24";
      ctx.fillText(ft.text, ft.worldX, ft.worldY - driftY);
      ctx.restore();
    }
  }

  private drawConfetti(particles: ConfettiParticle[]) {
    const { ctx } = this;
    for (const p of particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
  }

  private drawHint(ctx: CanvasRenderingContext2D) {
    if (this.hintPieceId === null) return;
    const elapsed = Date.now() - this.hintStartTime;
    if (elapsed > this.HINT_DURATION_MS) {
      this.hintPieceId = null;
      return;
    }

    const piece = this.state.pieces[this.hintPieceId];
    const def = this.definitions[this.hintPieceId];
    if (!piece || !def) return;

    const progress = elapsed / this.HINT_DURATION_MS;
    const pulse = Math.sin(elapsed * 0.012) * 0.5 + 0.5;
    const alpha = (1 - progress * 0.5) * pulse;

    const cx = def.width / 2;
    const cy = def.height / 2;

    // Glow ring on current piece position
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = "#f6c90e";
    ctx.lineWidth = 4;
    ctx.shadowColor = "#f6c90e";
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(piece.x + cx, piece.y + cy, Math.max(cx, cy) + 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Target crosshair at correct position on board
    const tx = def.correctX + cx;
    const ty = def.correctY + cy;
    const r = Math.max(cx, cy) + 8;

    ctx.save();
    ctx.globalAlpha = (1 - progress * 0.5) * (0.5 + pulse * 0.5);
    ctx.strokeStyle = "#f6c90e";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.shadowColor = "#f6c90e";
    ctx.shadowBlur = 12;

    // Dashed circle on board target
    ctx.beginPath();
    ctx.arc(tx, ty, r, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshair lines
    ctx.setLineDash([]);
    ctx.lineWidth = 2;
    const arm = r * 0.6;
    ctx.beginPath();
    ctx.moveTo(tx - arm, ty);
    ctx.lineTo(tx + arm, ty);
    ctx.moveTo(tx, ty - arm);
    ctx.lineTo(tx, ty + arm);
    ctx.stroke();
    ctx.restore();
  }

  private drawBackground() {
    const { ctx, canvas } = this;
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#2d3748");
    gradient.addColorStop(0.5, "#1a202c");
    gradient.addColorStop(1, "#171923");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.globalAlpha = 0.03;
    const dotSpacing = 30;
    ctx.fillStyle = "#ffffff";
    for (let x = 0; x < canvas.width; x += dotSpacing) {
      for (let y = 0; y < canvas.height; y += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  private drawBoard() {
    const { imageWidth, imageHeight } = this.config;
    const r = 6;

    this.ctx.save();
    this.ctx.fillStyle = "rgba(255,255,255,0.06)";
    this.ctx.strokeStyle = "rgba(255,255,255,0.12)";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.roundRect(0, 0, imageWidth, imageHeight, r);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.strokeStyle = "rgba(255,255,255,0.04)";
    this.ctx.lineWidth = 0.5;
    const { pieceWidth, pieceHeight, rows, cols } = this.config;
    for (let c = 1; c < cols; c++) {
      const x = c * pieceWidth;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, imageHeight);
      this.ctx.stroke();
    }
    for (let r2 = 1; r2 < rows; r2++) {
      const y = r2 * pieceHeight;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(imageWidth, y);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  setPreview(show: boolean) {
    this.showPreview = show;
  }

  resize() {
    // Reset user transform on resize so the puzzle re-fits the new viewport
    this.userScale = 1;
    this.userPanX = 0;
    this.userPanY = 0;
    this.fitToCanvas();
    this.callbacks.onTransformChange?.(false);
  }

  toggleMute(): boolean {
    return this.sound.toggleMute();
  }

  isMuted(): boolean {
    return this.sound.muted;
  }

  private saveState() {
    try {
      const key = `puzzle_${this.puzzleId}`;
      localStorage.setItem(key, JSON.stringify(this.state));
    } catch {}
  }

  private loadState(): GameState | null {
    try {
      const key = `puzzle_${this.puzzleId}`;
      const data = localStorage.getItem(key);
      if (!data) return null;
      const saved = JSON.parse(data) as GameState;
      if (saved.pieces.length !== this.definitions.length) return null;
      return saved;
    } catch {
      return null;
    }
  }

  private clearSavedState() {
    try {
      localStorage.removeItem(`puzzle_${this.puzzleId}`);
    } catch {}
  }

  private pushHistory() {
    const snapshot: GameState = JSON.parse(JSON.stringify(this.state));
    this.moveHistory.push(snapshot);
    if (this.moveHistory.length > this.MAX_HISTORY) {
      this.moveHistory.shift();
    }
  }

  undo() {
    if (this.moveHistory.length === 0) return;
    const prev = this.moveHistory.pop()!;
    this.state = prev;
    this.anim.clear();
    this.interaction?.updatePieces(this.state.pieces);
    this.callbacks.onProgress?.(
      this.state.pieces.filter((p) => p.snapped).length,
      this.state.pieces.length
    );
    this.callbacks.onTimerUpdate?.(this.state.timerSeconds);
    this.callbacks.onMoveCountUpdate?.(this.state.moveCount);
    this.callbacks.onScoreUpdate?.(this.state.score);
    this.saveState();
  }

  canUndo(): boolean {
    return this.moveHistory.length > 0;
  }

  hint() {
    const now = Date.now();
    if (now - this.lastHintTime < this.HINT_COOLDOWN_MS) return;

    const unsnapped = this.state.pieces.filter((p) => !p.snapped);
    if (unsnapped.length === 0) return;

    let best = unsnapped[0];
    let bestDist = Infinity;
    for (const piece of unsnapped) {
      const def = this.definitions[piece.id];
      if (!def) continue;
      const dx = piece.x - def.correctX;
      const dy = piece.y - def.correctY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < bestDist) {
        bestDist = dist;
        best = piece;
      }
    }

    this.hintPieceId = best.id;
    this.hintStartTime = now;
    this.lastHintTime = now;
    this.sound.hint();
  }

  canHint(): { available: boolean; cooldownLeft: number } {
    const elapsed = Date.now() - this.lastHintTime;
    const remaining = Math.max(0, this.HINT_COOLDOWN_MS - elapsed);
    return {
      available: remaining === 0 && !this.state.completed,
      cooldownLeft: Math.ceil(remaining / 1000),
    };
  }

  destroy() {
    cancelAnimationFrame(this.animFrameId);
    this.stopTimer();
    this.interaction?.destroy();
    this.sound.destroy();
    this.anim.clear();
  }

  getState(): GameState {
    return { ...this.state };
  }
}
