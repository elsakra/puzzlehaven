import { PieceDefinition, PuzzleConfig } from "./types";
import { createPiecePath2D } from "./PieceGenerator";

export interface RenderedPiece {
  id: number;
  canvas: OffscreenCanvas | HTMLCanvasElement;
  offsetX: number;
  offsetY: number;
  path: Path2D;
}

function createOffscreen(
  w: number,
  h: number
): OffscreenCanvas | HTMLCanvasElement {
  if (typeof OffscreenCanvas !== "undefined") {
    return new OffscreenCanvas(w, h);
  }
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

export function renderPiece(
  piece: PieceDefinition,
  image: HTMLImageElement | ImageBitmap,
  config: PuzzleConfig
): RenderedPiece {
  const { tabSize } = config;
  const padding = tabSize + 2;
  const canvasW = piece.width + padding * 2;
  const canvasH = piece.height + padding * 2;

  const offscreen = createOffscreen(canvasW, canvasH);
  const ctx = offscreen.getContext("2d") as
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D;
  if (!ctx) throw new Error("Failed to get 2d context");

  const path = createPiecePath2D(piece, tabSize);

  ctx.save();
  ctx.translate(padding, padding);

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = 3;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.fill(path);
  ctx.restore();

  ctx.save();
  ctx.clip(path);
  ctx.drawImage(
    image,
    piece.correctX - padding,
    piece.correctY - padding,
    canvasW,
    canvasH,
    -padding,
    -padding,
    canvasW,
    canvasH
  );
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = "rgba(0,0,0,0.15)";
  ctx.lineWidth = 1;
  ctx.stroke(path);
  ctx.restore();

  ctx.restore();

  return {
    id: piece.id,
    canvas: offscreen,
    offsetX: padding,
    offsetY: padding,
    path,
  };
}

export function renderAllPieces(
  pieces: PieceDefinition[],
  image: HTMLImageElement | ImageBitmap,
  config: PuzzleConfig
): RenderedPiece[] {
  return pieces.map((p) => renderPiece(p, image, config));
}
