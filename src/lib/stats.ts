import type { GameMode, Difficulty } from "@/engine/types";

const STATS_KEY = "puzzle_stats";

export interface PuzzleRecord {
  category: string;
  pieces: number;
  seconds: number;
  score: number;
  mode: GameMode;
  difficulty: Difficulty;
  completedAt: number;
}

export interface PuzzleStats {
  totalSolved: number;
  totalTimeSecs: number;
  categoryCount: Record<string, number>;
  bestTimes: Record<number, number>;
  records: PuzzleRecord[];
}

const DEFAULT_STATS: PuzzleStats = {
  totalSolved: 0,
  totalTimeSecs: 0,
  categoryCount: {},
  bestTimes: {},
  records: [],
};

export function getStats(): PuzzleStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PuzzleStats>;
      return {
        totalSolved: parsed.totalSolved ?? 0,
        totalTimeSecs: parsed.totalTimeSecs ?? 0,
        categoryCount: parsed.categoryCount ?? {},
        bestTimes: parsed.bestTimes ?? {},
        records: parsed.records ?? [],
      };
    }
  } catch {}
  return { ...DEFAULT_STATS, categoryCount: {}, bestTimes: {}, records: [] };
}

export function recordPuzzleComplete(
  category: string,
  pieces: number,
  seconds: number,
  score: number,
  mode: GameMode,
  difficulty: Difficulty
): PuzzleStats {
  const stats = getStats();

  stats.totalSolved += 1;
  stats.totalTimeSecs += seconds;
  stats.categoryCount[category] = (stats.categoryCount[category] ?? 0) + 1;

  const prevBest = stats.bestTimes[pieces];
  if (prevBest === undefined || seconds < prevBest) {
    stats.bestTimes[pieces] = seconds;
  }

  stats.records.push({ category, pieces, seconds, score, mode, difficulty, completedAt: Date.now() });
  // Keep last 500 records to avoid unbounded localStorage growth
  if (stats.records.length > 500) stats.records.splice(0, stats.records.length - 500);

  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {}

  return stats;
}

export function resetStats(): void {
  try {
    localStorage.removeItem(STATS_KEY);
  } catch {}
}

/** Count puzzles solved in the last N days */
export function recentSolvedCount(stats: PuzzleStats, days: number): number {
  const cutoff = Date.now() - days * 86400_000;
  return stats.records.filter((r) => r.completedAt >= cutoff).length;
}

export function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export function totalTimeLabel(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
