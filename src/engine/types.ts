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

export type PieceRotation = 0 | 90 | 180 | 270;

export interface PieceState {
  id: number;
  x: number;
  y: number;
  snapped: boolean;
  groupId: number;
  zIndex: number;
  rotation: PieceRotation;
}

export type Difficulty = "easy" | "medium" | "hard";

export const DIFFICULTY_LABELS: Record<Difficulty, { label: string; icon: string; desc: string }> = {
  easy:   { label: "Easy",   icon: "🌱", desc: "Edge pieces pre-placed" },
  medium: { label: "Medium", icon: "🧩", desc: "Standard scatter" },
  hard:   { label: "Hard",   icon: "🔥", desc: "Pieces start rotated" },
};

export interface PuzzleConfig {
  rows: number;
  cols: number;
  pieceWidth: number;
  pieceHeight: number;
  tabSize: number;
  imageWidth: number;
  imageHeight: number;
}

export type GameMode = "classic" | "zen" | "timed" | "mystery";

export const TIMED_LIMITS: Record<number, number> = {
  24: 180,
  48: 480,
  96: 900,
  150: 1800,
};

export const GAME_MODE_LABELS: Record<GameMode, { label: string; icon: string; desc: string }> = {
  classic: { label: "Classic", icon: "🧩", desc: "Timer, score, full preview" },
  zen: { label: "Zen", icon: "🌿", desc: "No timer, relaxed scatter" },
  timed: { label: "Timed", icon: "⏱", desc: "Race against the clock" },
  mystery: { label: "Mystery", icon: "🔮", desc: "No preview — discover as you solve" },
};

export interface GameState {
  pieces: PieceState[];
  timerSeconds: number;
  moveCount: number;
  completed: boolean;
  startedAt: number | null;
  score: number;
  lastSnapAt: number | null;
  trayOpen: boolean;
  gameMode: GameMode;
  timedSecondsLeft: number;
  difficulty: Difficulty;
}

export const PIECE_PRESETS: Record<number, { rows: number; cols: number }> = {
  24: { rows: 4, cols: 6 },
  48: { rows: 6, cols: 8 },
  96: { rows: 8, cols: 12 },
  150: { rows: 10, cols: 15 },
};
