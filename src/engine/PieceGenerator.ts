import {
  PieceDefinition,
  PuzzleConfig,
  EdgePath,
  EdgeType,
  BezierCurve,
  Point,
} from "./types";

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateTabCurves(
  start: Point,
  end: Point,
  tabSize: number,
  outward: boolean,
  rand: () => number
): BezierCurve[] {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const len = Math.sqrt(dx * dx + dy * dy);

  const ux = dx / len;
  const uy = dy / len;
  const nx = outward ? -uy : uy;
  const ny = outward ? ux : -ux;

  const jitter = 0.04 + rand() * 0.04;
  const neckPos = 0.34 + (rand() - 0.5) * 0.04;
  const neckEnd = 0.66 + (rand() - 0.5) * 0.04;
  const tabHeight = tabSize * (0.8 + rand() * 0.4);
  const tabWidth = tabSize * (0.7 + rand() * 0.3);

  const p0 = start;
  const p1 = {
    x: start.x + ux * len * neckPos,
    y: start.y + uy * len * neckPos,
  };
  const p2 = {
    x: start.x + ux * len * neckEnd,
    y: start.y + uy * len * neckEnd,
  };
  const p3 = end;

  const neckMidX = (p1.x + p2.x) / 2;
  const neckMidY = (p1.y + p2.y) / 2;
  const tabTip = {
    x: neckMidX + nx * tabHeight,
    y: neckMidY + ny * tabHeight,
  };

  return [
    {
      cp1: { x: p0.x + ux * len * 0.1, y: p0.y + uy * len * 0.1 },
      cp2: {
        x: p1.x - nx * len * jitter,
        y: p1.y - ny * len * jitter,
      },
      end: p1,
    },
    {
      cp1: {
        x: p1.x + nx * tabHeight * 0.1 - ux * tabWidth * 0.3,
        y: p1.y + ny * tabHeight * 0.1 - uy * tabWidth * 0.3,
      },
      cp2: {
        x: tabTip.x - ux * tabWidth * 0.5,
        y: tabTip.y - uy * tabWidth * 0.5,
      },
      end: tabTip,
    },
    {
      cp1: {
        x: tabTip.x + ux * tabWidth * 0.5,
        y: tabTip.y + uy * tabWidth * 0.5,
      },
      cp2: {
        x: p2.x + nx * tabHeight * 0.1 + ux * tabWidth * 0.3,
        y: p2.y + ny * tabHeight * 0.1 + uy * tabWidth * 0.3,
      },
      end: p2,
    },
    {
      cp1: {
        x: p2.x - nx * len * jitter,
        y: p2.y - ny * len * jitter,
      },
      cp2: { x: p3.x - ux * len * 0.1, y: p3.y - uy * len * 0.1 },
      end: p3,
    },
  ];
}

function generateFlatEdge(start: Point, end: Point): EdgePath {
  return {
    type: "flat" as EdgeType,
    curves: [
      {
        cp1: {
          x: start.x + (end.x - start.x) / 3,
          y: start.y + (end.y - start.y) / 3,
        },
        cp2: {
          x: start.x + ((end.x - start.x) * 2) / 3,
          y: start.y + ((end.y - start.y) * 2) / 3,
        },
        end,
      },
    ],
  };
}

export function generatePieces(
  config: PuzzleConfig,
  seed: number = 42
): PieceDefinition[] {
  const { rows, cols, pieceWidth, pieceHeight, tabSize } = config;
  const rand = seededRandom(seed);

  const hEdges: boolean[][] = [];
  for (let r = 0; r < rows - 1; r++) {
    hEdges[r] = [];
    for (let c = 0; c < cols; c++) {
      hEdges[r][c] = rand() > 0.5;
    }
  }

  const vEdges: boolean[][] = [];
  for (let r = 0; r < rows; r++) {
    vEdges[r] = [];
    for (let c = 0; c < cols - 1; c++) {
      vEdges[r][c] = rand() > 0.5;
    }
  }

  const pieces: PieceDefinition[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const id = r * cols + c;
      const x = c * pieceWidth;
      const y = r * pieceHeight;

      const tl: Point = { x: 0, y: 0 };
      const tr: Point = { x: pieceWidth, y: 0 };
      const br: Point = { x: pieceWidth, y: pieceHeight };
      const bl: Point = { x: 0, y: pieceHeight };

      let topEdge: EdgePath;
      if (r === 0) {
        topEdge = generateFlatEdge(tl, tr);
      } else {
        const isTab = hEdges[r - 1][c];
        topEdge = {
          type: isTab ? "blank" : "tab",
          curves: generateTabCurves(tl, tr, tabSize, !isTab, rand),
        };
      }

      let rightEdge: EdgePath;
      if (c === cols - 1) {
        rightEdge = generateFlatEdge(tr, br);
      } else {
        const isTab = vEdges[r][c];
        rightEdge = {
          type: isTab ? "tab" : "blank",
          curves: generateTabCurves(tr, br, tabSize, isTab, rand),
        };
      }

      let bottomEdge: EdgePath;
      if (r === rows - 1) {
        bottomEdge = generateFlatEdge(br, bl);
      } else {
        const isTab = hEdges[r][c];
        bottomEdge = {
          type: isTab ? "tab" : "blank",
          curves: generateTabCurves(br, bl, tabSize, isTab, rand),
        };
      }

      let leftEdge: EdgePath;
      if (c === 0) {
        leftEdge = generateFlatEdge(bl, tl);
      } else {
        const isTab = vEdges[r][c - 1];
        leftEdge = {
          type: isTab ? "blank" : "tab",
          curves: generateTabCurves(bl, tl, tabSize, !isTab, rand),
        };
      }

      pieces.push({
        id,
        row: r,
        col: c,
        edges: {
          top: topEdge,
          right: rightEdge,
          bottom: bottomEdge,
          left: leftEdge,
        },
        correctX: x,
        correctY: y,
        width: pieceWidth,
        height: pieceHeight,
      });
    }
  }

  return pieces;
}

export function buildPiecePath(
  path: Path2D,
  piece: PieceDefinition,
  _tabSize: number
): void {
  const tl = { x: 0, y: 0 };

  const drawEdge = (edge: EdgePath, start: Point) => {
    let current = start;
    for (const curve of edge.curves) {
      path.bezierCurveTo(
        curve.cp1.x,
        curve.cp1.y,
        curve.cp2.x,
        curve.cp2.y,
        curve.end.x,
        curve.end.y
      );
      current = curve.end;
    }
    return current;
  };

  path.moveTo(tl.x, tl.y);

  let pos = tl;
  pos = drawEdge(piece.edges.top, pos);
  pos = drawEdge(piece.edges.right, pos);
  pos = drawEdge(piece.edges.bottom, pos);
  drawEdge(piece.edges.left, pos);

  path.closePath();
}

export function createPiecePath2D(
  piece: PieceDefinition,
  tabSize: number
): Path2D {
  const path = new Path2D();
  buildPiecePath(path, piece, tabSize);
  return path;
}
