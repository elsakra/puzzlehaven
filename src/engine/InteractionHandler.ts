import { PieceState, PieceDefinition, PuzzleConfig } from "./types";
import { RenderedPiece } from "./PieceRenderer";

const SNAP_THRESHOLD = 15;

export interface DragState {
  pieceId: number;
  offsetX: number;
  offsetY: number;
  groupIds: number[];
}

export class InteractionHandler {
  private canvas: HTMLCanvasElement;
  private hitCtx: CanvasRenderingContext2D;
  private pieces: PieceState[];
  private definitions: PieceDefinition[];
  private rendered: RenderedPiece[];
  private config: PuzzleConfig;
  private drag: DragState | null = null;
  private scale: number = 1;
  private panX: number = 0;
  private panY: number = 0;

  onPieceMove: (() => void) | null = null;
  onPieceSnap: ((pieceId: number) => void) | null = null;
  onInteractionStart: (() => void) | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    pieces: PieceState[],
    definitions: PieceDefinition[],
    rendered: RenderedPiece[],
    config: PuzzleConfig
  ) {
    this.canvas = canvas;
    this.pieces = pieces;
    this.definitions = definitions;
    this.rendered = rendered;
    this.config = config;

    const hitCanvas = document.createElement("canvas");
    hitCanvas.width = 1;
    hitCanvas.height = 1;
    this.hitCtx = hitCanvas.getContext("2d")!;

    this.bindEvents();
  }

  setTransform(scale: number, panX: number, panY: number) {
    this.scale = scale;
    this.panX = panX;
    this.panY = panY;
  }

  private bindEvents() {
    this.canvas.addEventListener("pointerdown", this.onPointerDown);
    this.canvas.addEventListener("pointermove", this.onPointerMove);
    this.canvas.addEventListener("pointerup", this.onPointerUp);
    this.canvas.addEventListener("pointercancel", this.onPointerUp);
    this.canvas.style.touchAction = "none";
  }

  destroy() {
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    this.canvas.removeEventListener("pointermove", this.onPointerMove);
    this.canvas.removeEventListener("pointerup", this.onPointerUp);
    this.canvas.removeEventListener("pointercancel", this.onPointerUp);
  }

  private screenToWorld(clientX: number, clientY: number): { x: number; y: number } | null {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    const sx = (clientX - rect.left) * (this.canvas.width / rect.width);
    const sy = (clientY - rect.top) * (this.canvas.height / rect.height);
    return {
      x: (sx - this.panX) / this.scale,
      y: (sy - this.panY) / this.scale,
    };
  }

  private hitTest(worldX: number, worldY: number): number | null {
    const sorted = [...this.pieces]
      .filter((p) => !p.snapped)
      .sort((a, b) => b.zIndex - a.zIndex);

    this.hitCtx.resetTransform();

    for (const piece of sorted) {
      const rp = this.rendered[piece.id];
      const localX = worldX - piece.x;
      const localY = worldY - piece.y;

      if (this.hitCtx.isPointInPath(rp.path, localX, localY)) {
        return piece.id;
      }
    }
    return null;
  }

  private getGroupPieces(groupId: number): PieceState[] {
    return this.pieces.filter((p) => p.groupId === groupId);
  }

  private onPointerDown = (e: PointerEvent) => {
    e.preventDefault();
    this.canvas.setPointerCapture(e.pointerId);
    this.onInteractionStart?.();

    const world = this.screenToWorld(e.clientX, e.clientY);
    if (!world) return;
    const { x, y } = world;
    const hitId = this.hitTest(x, y);

    if (hitId === null) return;

    const piece = this.pieces[hitId];
    const groupPieces = this.getGroupPieces(piece.groupId);

    const maxZ = Math.max(...this.pieces.map((p) => p.zIndex));
    groupPieces.forEach((p) => {
      p.zIndex = maxZ + 1;
    });

    this.drag = {
      pieceId: hitId,
      offsetX: x - piece.x,
      offsetY: y - piece.y,
      groupIds: groupPieces.map((p) => p.id),
    };
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.drag) return;
    e.preventDefault();

    const world = this.screenToWorld(e.clientX, e.clientY);
    if (!world) return;
    const { x, y } = world;
    const dx = x - this.drag.offsetX - this.pieces[this.drag.pieceId].x;
    const dy = y - this.drag.offsetY - this.pieces[this.drag.pieceId].y;

    for (const id of this.drag.groupIds) {
      this.pieces[id].x += dx;
      this.pieces[id].y += dy;
    }

    this.onPieceMove?.();
  };

  private onPointerUp = (e: PointerEvent) => {
    if (!this.drag) return;

    for (const id of this.drag.groupIds) {
      this.trySnap(id);
    }

    this.tryMergeGroups(this.drag.pieceId);
    this.drag = null;
    this.onPieceMove?.();
  };

  private trySnap(pieceId: number) {
    const piece = this.pieces[pieceId];
    if (piece.snapped) return;

    const def = this.definitions[pieceId];
    const dx = Math.abs(piece.x - def.correctX);
    const dy = Math.abs(piece.y - def.correctY);

    if (dx < SNAP_THRESHOLD && dy < SNAP_THRESHOLD) {
      const groupPieces = this.getGroupPieces(piece.groupId);
      const offsetX = def.correctX - piece.x;
      const offsetY = def.correctY - piece.y;

      for (const gp of groupPieces) {
        gp.x += offsetX;
        gp.y += offsetY;
        gp.snapped = true;
      }

      this.onPieceSnap?.(pieceId);
    }
  }

  private tryMergeGroups(pieceId: number) {
    const piece = this.pieces[pieceId];
    const def = this.definitions[pieceId];
    const { rows, cols } = this.config;

    const neighbors = [
      { dr: -1, dc: 0 },
      { dr: 1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: 1 },
    ];

    for (const { dr, dc } of neighbors) {
      const nr = def.row + dr;
      const nc = def.col + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;

      const neighborId = nr * cols + nc;
      const neighbor = this.pieces[neighborId];
      const neighborDef = this.definitions[neighborId];

      if (neighbor.groupId === piece.groupId) continue;

      const expectedDx = neighborDef.correctX - def.correctX;
      const expectedDy = neighborDef.correctY - def.correctY;
      const actualDx = neighbor.x - piece.x;
      const actualDy = neighbor.y - piece.y;

      if (
        Math.abs(actualDx - expectedDx) < SNAP_THRESHOLD &&
        Math.abs(actualDy - expectedDy) < SNAP_THRESHOLD
      ) {
        this.mergeGroups(piece.groupId, neighbor.groupId);
      }
    }
  }

  private mergeGroups(groupA: number, groupB: number) {
    const targetGroup = Math.min(groupA, groupB);
    const sourceGroup = Math.max(groupA, groupB);

    for (const piece of this.pieces) {
      if (piece.groupId === sourceGroup) {
        piece.groupId = targetGroup;
      }
    }
  }
}
