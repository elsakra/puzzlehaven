import { PieceState, PieceDefinition, PuzzleConfig, Difficulty, PieceRotation } from "./types";
import { RenderedPiece } from "./PieceRenderer";
import type { SnapAnimData } from "./AnimationManager";

const DEFAULT_SNAP_THRESHOLD = 15;
const MIN_SCALE = 0.02;
const MAX_SCALE = 60;

export interface DragState {
  pieceId: number;
  offsetX: number;
  offsetY: number;
  groupIds: number[];
}

type GestureMode = "idle" | "dragging" | "panning" | "pinching";

export class InteractionHandler {
  private canvas: HTMLCanvasElement;
  private hitCtx: CanvasRenderingContext2D;
  private pieces: PieceState[];
  private definitions: PieceDefinition[];
  private rendered: RenderedPiece[];
  private config: PuzzleConfig;
  private difficulty: Difficulty;
  private snapThreshold: number = DEFAULT_SNAP_THRESHOLD;
  private drag: DragState | null = null;
  private scale: number = 1;
  private panX: number = 0;
  private panY: number = 0;

  // Gesture tracking
  private mode: GestureMode = "idle";
  private activePointers: Map<number, { clientX: number; clientY: number }> = new Map();
  private lastPinchDist: number = 0;
  private lastPinchMidX: number = 0;
  private lastPinchMidY: number = 0;
  private panPointerId: number = -1;
  private panLastX: number = 0;
  private panLastY: number = 0;

  // Double-tap detection for mobile rotation
  private lastTapTime: number = 0;
  private lastTapId: number | null = null;

  onPieceMove: (() => void) | null = null;
  onPieceSnap: ((pieceId: number) => void) | null = null;
  onGroupMerge: (() => void) | null = null;
  onPiecePickup: (() => void) | null = null;
  onDragStart: (() => void) | null = null;
  onPieceRotate: (() => void) | null = null;
  onInteractionStart: (() => void) | null = null;
  onTransformChange: ((scale: number, panX: number, panY: number) => void) | null = null;
  onSnapAnimate: ((data: SnapAnimData[]) => void) | null = null;

  /** The id of the piece currently being dragged (or null when not dragging). */
  liftedPieceId: number | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    pieces: PieceState[],
    definitions: PieceDefinition[],
    rendered: RenderedPiece[],
    config: PuzzleConfig,
    difficulty: Difficulty = "medium",
    snapThreshold: number = DEFAULT_SNAP_THRESHOLD
  ) {
    this.canvas = canvas;
    this.pieces = pieces;
    this.definitions = definitions;
    this.rendered = rendered;
    this.config = config;
    this.difficulty = difficulty;
    this.snapThreshold = snapThreshold;

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

  updatePieces(pieces: PieceState[]) {
    this.pieces = pieces;
  }

  private bindEvents() {
    this.canvas.addEventListener("pointerdown", this.onPointerDown);
    this.canvas.addEventListener("pointermove", this.onPointerMove);
    this.canvas.addEventListener("pointerup", this.onPointerUp);
    this.canvas.addEventListener("pointercancel", this.onPointerCancel);
    this.canvas.addEventListener("wheel", this.onWheel, { passive: false });
    this.canvas.addEventListener("contextmenu", this.onContextMenu);
    this.canvas.style.touchAction = "none";
  }

  destroy() {
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    this.canvas.removeEventListener("pointermove", this.onPointerMove);
    this.canvas.removeEventListener("pointerup", this.onPointerUp);
    this.canvas.removeEventListener("pointercancel", this.onPointerCancel);
    this.canvas.removeEventListener("wheel", this.onWheel);
    this.canvas.removeEventListener("contextmenu", this.onContextMenu);
  }

  private clientToCanvas(clientX: number, clientY: number): { x: number; y: number } | null {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    return {
      x: (clientX - rect.left) * (this.canvas.width / rect.width),
      y: (clientY - rect.top) * (this.canvas.height / rect.height),
    };
  }

  private screenToWorld(clientX: number, clientY: number): { x: number; y: number } | null {
    const canvas = this.clientToCanvas(clientX, clientY);
    if (!canvas) return null;
    return {
      x: (canvas.x - this.panX) / this.scale,
      y: (canvas.y - this.panY) / this.scale,
    };
  }

  private zoomAt(canvasX: number, canvasY: number, factor: number) {
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, this.scale * factor));
    if (newScale === this.scale) return;
    const worldX = (canvasX - this.panX) / this.scale;
    const worldY = (canvasY - this.panY) / this.scale;
    this.scale = newScale;
    this.panX = canvasX - worldX * this.scale;
    this.panY = canvasY - worldY * this.scale;
    this.onTransformChange?.(this.scale, this.panX, this.panY);
  }

  private pinchDist(
    a: { clientX: number; clientY: number },
    b: { clientX: number; clientY: number }
  ): number {
    return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
  }

  private pinchMid(
    a: { clientX: number; clientY: number },
    b: { clientX: number; clientY: number }
  ): { x: number; y: number } {
    return { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 };
  }

  private hitTest(worldX: number, worldY: number): number | null {
    const sorted = [...this.pieces]
      .filter((p) => !p.snapped)
      .sort((a, b) => b.zIndex - a.zIndex);

    this.hitCtx.resetTransform();

    for (const piece of sorted) {
      const rp = this.rendered[piece.id];
      const def = this.definitions[piece.id];
      const rotation = piece.rotation ?? 0;

      let localX = worldX - piece.x;
      let localY = worldY - piece.y;

      if (rotation !== 0) {
        // Inverse-rotate the world point into the piece's unrotated local coordinate space
        const cx = def.width / 2;
        const cy = def.height / 2;
        const dx = localX - cx;
        const dy = localY - cy;
        const angle = -(rotation * Math.PI) / 180;
        localX = cx + dx * Math.cos(angle) - dy * Math.sin(angle);
        localY = cy + dx * Math.sin(angle) + dy * Math.cos(angle);
      }

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

    this.activePointers.set(e.pointerId, { clientX: e.clientX, clientY: e.clientY });

    // Transition to pinch when a second finger lands
    if (this.activePointers.size === 2) {
      this.drag = null;
      this.mode = "pinching";
      const pts = Array.from(this.activePointers.values());
      this.lastPinchDist = this.pinchDist(pts[0], pts[1]);
      const mid = this.pinchMid(pts[0], pts[1]);
      this.lastPinchMidX = mid.x;
      this.lastPinchMidY = mid.y;
      return;
    }

    // Ignore 3+ fingers
    if (this.activePointers.size > 2) return;

    // Single pointer — notify game started
    this.onInteractionStart?.();

    const world = this.screenToWorld(e.clientX, e.clientY);
    if (!world) return;

    const hitId = this.hitTest(world.x, world.y);

    if (hitId !== null) {
      // Double-tap on touch devices rotates the piece instead of dragging
      const now = Date.now();
      if (
        e.pointerType === "touch" &&
        now - this.lastTapTime < 300 &&
        this.lastTapId === hitId
      ) {
        this.lastTapTime = 0;
        this.lastTapId = null;
        this.onPieceRotate?.();
        this.rotatePiece(hitId);
        this.mode = "idle";
        return;
      }
      this.lastTapTime = now;
      this.lastTapId = hitId;

      const piece = this.pieces[hitId];
      const groupPieces = this.getGroupPieces(piece.groupId);
      const maxZ = Math.max(...this.pieces.map((p) => p.zIndex));
      groupPieces.forEach((p) => { p.zIndex = maxZ + 1; });

      this.liftedPieceId = hitId;
      this.onDragStart?.();
      this.drag = {
        pieceId: hitId,
        offsetX: world.x - piece.x,
        offsetY: world.y - piece.y,
        groupIds: groupPieces.map((p) => p.id),
      };
      this.mode = "dragging";
      this.onPiecePickup?.();
    } else {
      // Empty space — pan
      this.mode = "panning";
      this.panPointerId = e.pointerId;
      this.panLastX = e.clientX;
      this.panLastY = e.clientY;
    }
  };

  private onPointerMove = (e: PointerEvent) => {
    e.preventDefault();

    if (this.activePointers.has(e.pointerId)) {
      this.activePointers.set(e.pointerId, { clientX: e.clientX, clientY: e.clientY });
    }

    if (this.mode === "dragging" && this.drag) {
      const world = this.screenToWorld(e.clientX, e.clientY);
      if (!world) return;
      const dx = world.x - this.drag.offsetX - this.pieces[this.drag.pieceId].x;
      const dy = world.y - this.drag.offsetY - this.pieces[this.drag.pieceId].y;
      for (const id of this.drag.groupIds) {
        this.pieces[id].x += dx;
        this.pieces[id].y += dy;
      }
      this.onPieceMove?.();
      return;
    }

    if (this.mode === "panning" && e.pointerId === this.panPointerId) {
      const cur = this.clientToCanvas(e.clientX, e.clientY);
      const prev = this.clientToCanvas(this.panLastX, this.panLastY);
      if (cur && prev) {
        this.panX += cur.x - prev.x;
        this.panY += cur.y - prev.y;
        this.onTransformChange?.(this.scale, this.panX, this.panY);
      }
      this.panLastX = e.clientX;
      this.panLastY = e.clientY;
      return;
    }

    if (this.mode === "pinching" && this.activePointers.size === 2) {
      const pts = Array.from(this.activePointers.values());
      const newDist = this.pinchDist(pts[0], pts[1]);
      const newMid = this.pinchMid(pts[0], pts[1]);
      const newMidC = this.clientToCanvas(newMid.x, newMid.y);
      const prevMidC = this.clientToCanvas(this.lastPinchMidX, this.lastPinchMidY);

      if (newMidC && prevMidC && this.lastPinchDist > 0) {
        const factor = newDist / this.lastPinchDist;
        const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, this.scale * factor));

        // Keep the world point under the old midpoint aligned to the new midpoint
        const worldX = (prevMidC.x - this.panX) / this.scale;
        const worldY = (prevMidC.y - this.panY) / this.scale;
        this.scale = newScale;
        this.panX = newMidC.x - worldX * this.scale;
        this.panY = newMidC.y - worldY * this.scale;
        this.onTransformChange?.(this.scale, this.panX, this.panY);
      }

      this.lastPinchDist = newDist;
      this.lastPinchMidX = newMid.x;
      this.lastPinchMidY = newMid.y;
    }
  };

  private onPointerUp = (e: PointerEvent) => {
    const wasMode = this.mode;

    this.activePointers.delete(e.pointerId);

    if (wasMode === "dragging" && this.drag) {
      this.liftedPieceId = null;
      for (const id of this.drag.groupIds) {
        this.trySnap(id);
      }
      this.tryMergeGroups(this.drag.pieceId);
      this.drag = null;
      this.onPieceMove?.();
    }

    if (this.activePointers.size === 0) {
      this.mode = "idle";
    } else if (this.activePointers.size < 2 && wasMode === "pinching") {
      this.mode = "idle";
    }
  };

  private onPointerCancel = (e: PointerEvent) => {
    this.activePointers.delete(e.pointerId);
    if (this.mode === "dragging" && this.drag) {
      this.liftedPieceId = null;
      this.drag = null;
      this.onPieceMove?.();
    }
    if (this.activePointers.size === 0) {
      this.mode = "idle";
    }
  };

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const canvasPos = this.clientToCanvas(e.clientX, e.clientY);
    if (!canvasPos) return;

    let delta = e.deltaY;
    if (e.deltaMode === 1) delta *= 30;  // line mode
    if (e.deltaMode === 2) delta *= 300; // page mode

    const factor = Math.pow(0.998, delta);
    this.zoomAt(canvasPos.x, canvasPos.y, factor);
  };

  private rotatePiece(pieceId: number) {
    const piece = this.pieces[pieceId];
    const groupPieces = this.getGroupPieces(piece.groupId);
    for (const gp of groupPieces) {
      gp.rotation = (((gp.rotation ?? 0) + 90) % 360) as PieceRotation;
    }
  }

  private onContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    const world = this.screenToWorld(e.clientX, e.clientY);
    if (!world) return;
    const hitId = this.hitTest(world.x, world.y);
    if (hitId !== null) {
      this.onPieceRotate?.();
      this.rotatePiece(hitId);
    }
  };

  private trySnap(pieceId: number) {
    const piece = this.pieces[pieceId];
    if (piece.snapped) return;

    // Hard mode: piece must be at correct rotation (0°) to snap
    if (this.difficulty === "hard" && (piece.rotation ?? 0) !== 0) return;

    const def = this.definitions[pieceId];
    const dx = Math.abs(piece.x - def.correctX);
    const dy = Math.abs(piece.y - def.correctY);

    if (dx < this.snapThreshold && dy < this.snapThreshold) {
      const groupPieces = this.getGroupPieces(piece.groupId);
      const offsetX = def.correctX - piece.x;
      const offsetY = def.correctY - piece.y;

      // Capture pre-snap positions for smooth animation before teleporting
      const animData: SnapAnimData[] = groupPieces.map((gp) => ({
        pieceId: gp.id,
        fromX: gp.x,
        fromY: gp.y,
        toX: gp.x + offsetX,
        toY: gp.y + offsetY,
      }));

      for (const gp of groupPieces) {
        gp.x += offsetX;
        gp.y += offsetY;
        gp.snapped = true;
      }

      this.onSnapAnimate?.(animData);
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
        Math.abs(actualDx - expectedDx) < this.snapThreshold &&
        Math.abs(actualDy - expectedDy) < this.snapThreshold
      ) {
        this.mergeGroups(piece.groupId, neighbor.groupId);
        this.onGroupMerge?.();
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
