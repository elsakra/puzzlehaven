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

export interface PuzzleCallbacks {
  onTimerUpdate?: (seconds: number) => void;
  onMoveCountUpdate?: (count: number) => void;
  onComplete?: (seconds: number, moves: number) => void;
  onProgress?: (snapped: number, total: number) => void;
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
  };
  private interaction: InteractionHandler | null = null;
  private animFrameId: number = 0;
  private timerInterval: number = 0;
  private callbacks: PuzzleCallbacks = {};
  private showPreview: boolean = false;
  private scale: number = 1;
  private panX: number = 0;
  private panY: number = 0;
  private puzzleId: string = "";

  constructor(canvas: HTMLCanvasElement, callbacks?: PuzzleCallbacks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    if (callbacks) this.callbacks = callbacks;
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
    } else {
      this.initFreshState();
    }

    this.fitToCanvas();
    this.setupInteraction();
    this.startRenderLoop();
    this.callbacks.onProgress?.(
      this.state.pieces.filter((p) => p.snapped).length,
      this.state.pieces.length
    );
    this.callbacks.onTimerUpdate?.(this.state.timerSeconds);
    this.callbacks.onMoveCountUpdate?.(this.state.moveCount);
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
    };
  }

  private fitToCanvas() {
    const { imageWidth, imageHeight, tabSize } = this.config;
    const totalW = imageWidth * 2.0;
    const totalH = imageHeight * 1.7;

    const scaleX = this.canvas.width / totalW;
    const scaleY = this.canvas.height / totalH;
    this.scale = Math.min(scaleX, scaleY, 1);

    const usedW = totalW * this.scale;
    const usedH = totalH * this.scale;
    this.panX = (this.canvas.width - usedW) / 2 + tabSize * this.scale;
    this.panY = (this.canvas.height - usedH) / 2 + tabSize * this.scale;

    this.interaction?.setTransform(this.scale, this.panX, this.panY);
  }

  private setupInteraction() {
    this.interaction = new InteractionHandler(
      this.canvas,
      this.state.pieces,
      this.definitions,
      this.rendered,
      this.config
    );

    this.interaction.onInteractionStart = () => {
      if (!this.state.startedAt) {
        this.state.startedAt = Date.now();
        this.startTimer();
      }
    };

    this.interaction.onPieceMove = () => {
      this.state.moveCount++;
      this.callbacks.onMoveCountUpdate?.(this.state.moveCount);
      this.saveState();
    };

    this.interaction.onPieceSnap = () => {
      const snapped = this.state.pieces.filter((p) => p.snapped).length;
      this.callbacks.onProgress?.(snapped, this.state.pieces.length);
      this.saveState();

      if (snapped === this.state.pieces.length) {
        this.state.completed = true;
        this.stopTimer();
        this.callbacks.onComplete?.(
          this.state.timerSeconds,
          this.state.moveCount
        );
        this.clearSavedState();
      }
    };

    this.interaction.setTransform(this.scale, this.panX, this.panY);
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

    const sorted = [...this.state.pieces].sort(
      (a, b) => a.zIndex - b.zIndex
    );

    for (const piece of sorted) {
      const rp = this.rendered[piece.id];
      if (!rp) continue;

      ctx.drawImage(
        rp.canvas as HTMLCanvasElement,
        piece.x - rp.offsetX,
        piece.y - rp.offsetY
      );
    }

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
    this.fitToCanvas();
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

  destroy() {
    cancelAnimationFrame(this.animFrameId);
    this.stopTimer();
    this.interaction?.destroy();
  }

  getState(): GameState {
    return { ...this.state };
  }
}
