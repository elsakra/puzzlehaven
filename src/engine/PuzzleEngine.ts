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
    const canvasW = this.canvas.width;
    const canvasH = this.canvas.height;
    const { imageWidth, imageHeight, tabSize } = this.config;

    const margin = tabSize * 2;
    const playAreaW = imageWidth + margin * 2;
    const playAreaH = imageHeight + margin * 2;

    this.state = {
      pieces: this.definitions.map((def, i) => {
        const spreadW = playAreaW * 1.5;
        const spreadH = playAreaH * 1.2;
        return {
          id: def.id,
          x: Math.random() * spreadW - margin,
          y: Math.random() * spreadH - margin,
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
    const totalW = imageWidth + tabSize * 4;
    const totalH = imageHeight + tabSize * 4;

    const scaleX = this.canvas.width / (totalW * 2);
    const scaleY = this.canvas.height / (totalH * 1.5);
    this.scale = Math.min(scaleX, scaleY, 1);

    this.panX = this.canvas.width * 0.05;
    this.panY = this.canvas.height * 0.05;

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

    ctx.save();
    ctx.translate(this.panX, this.panY);
    ctx.scale(this.scale, this.scale);

    this.drawBoard();

    if (this.showPreview && this.image) {
      ctx.globalAlpha = 0.2;
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

  private drawBoard() {
    const { imageWidth, imageHeight } = this.config;
    this.ctx.fillStyle = "rgba(0,0,0,0.04)";
    this.ctx.strokeStyle = "rgba(0,0,0,0.1)";
    this.ctx.lineWidth = 1;
    this.ctx.fillRect(0, 0, imageWidth, imageHeight);
    this.ctx.strokeRect(0, 0, imageWidth, imageHeight);
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
