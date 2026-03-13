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
  const padding = tabSize + 6;
  const shadowPad = 12;
  const totalPad = padding + shadowPad;
  const canvasW = piece.width + totalPad * 2;
  const canvasH = piece.height + totalPad * 2;

  const offscreen = createOffscreen(canvasW, canvasH);
  const ctx = offscreen.getContext("2d") as
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D;
  if (!ctx) throw new Error("Failed to get 2d context");

  const path = createPiecePath2D(piece, tabSize);

  ctx.save();
  ctx.translate(totalPad, totalPad);

  ctx.save();
  ctx.fillStyle = "#e8e0d4";
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 4;
  ctx.fill(path);
  ctx.restore();

  ctx.save();
  ctx.clip(path);
  const srcX = Math.max(0, piece.correctX - totalPad);
  const srcY = Math.max(0, piece.correctY - totalPad);
  const srcRight = Math.min(
    image.width,
    piece.correctX + piece.width + totalPad
  );
  const srcBottom = Math.min(
    image.height,
    piece.correctY + piece.height + totalPad
  );
  const srcW = srcRight - srcX;
  const srcH = srcBottom - srcY;
  const destX = srcX - piece.correctX - totalPad;
  const destY = srcY - piece.correctY - totalPad;
  if (srcW > 0 && srcH > 0) {
    ctx.drawImage(image, srcX, srcY, srcW, srcH, destX, destY, srcW, srcH);
  }
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 1.5;
  ctx.stroke(path);
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = "rgba(0,0,0,0.25)";
  ctx.lineWidth = 0.8;
  ctx.stroke(path);
  ctx.restore();

  ctx.restore();

  return {
    id: piece.id,
    canvas: offscreen,
    offsetX: totalPad,
    offsetY: totalPad,
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
