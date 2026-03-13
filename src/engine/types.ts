export interface Point {
  x: number;
  y: number;
}

export interface BezierCurve {
  cp1: Point;
  cp2: Point;
  end: Point;
}

export type EdgeType = "flat" | "tab" | "blank";

export interface EdgePath {
  type: EdgeType;
  curves: BezierCurve[];
}

export interface PieceDefinition {
  id: number;
  row: number;
  col: number;
  edges: {
    top: EdgePath;
    right: EdgePath;
    bottom: EdgePath;
    left: EdgePath;
  };
  correctX: number;
  correctY: number;
  width: number;
  height: number;
}

export interface PieceState {
  id: number;
  x: number;
  y: number;
  snapped: boolean;
  groupId: number;
  zIndex: number;
}

export interface PuzzleConfig {
  rows: number;
  cols: number;
  pieceWidth: number;
  pieceHeight: number;
  tabSize: number;
  imageWidth: number;
  imageHeight: number;
}

export interface GameState {
  pieces: PieceState[];
  timerSeconds: number;
  moveCount: number;
  completed: boolean;
  startedAt: number | null;
  score: number;
  lastSnapAt: number | null;
}

export const PIECE_PRESETS: Record<number, { rows: number; cols: number }> = {
  24: { rows: 4, cols: 6 },
  48: { rows: 6, cols: 8 },
  96: { rows: 8, cols: 12 },
  150: { rows: 10, cols: 15 },
};
