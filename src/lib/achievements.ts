import type { PuzzleStats } from "./stats";
import type { StreakData } from "./storage";

const EARNED_KEY = "puzzle_achievements";

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  check: (stats: PuzzleStats, streak: StreakData) => boolean;
}

export interface EarnedAchievement {
  id: string;
  earnedAt: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-solve",
    title: "First Piece",
    desc: "Complete your very first puzzle",
    icon: "🧩",
    check: (s) => s.totalSolved >= 1,
  },
  {
    id: "speed-demon",
    title: "Speed Demon",
    desc: "Solve a 24-piece puzzle in under 60 seconds",
    icon: "⚡",
    check: (s) => {
      const best24 = s.bestTimes[24];
      return best24 !== undefined && best24 < 60;
    },
  },
  {
    id: "puzzle-10",
    title: "Puzzle Lover",
    desc: "Complete 10 puzzles",
    icon: "🎯",
    check: (s) => s.totalSolved >= 10,
  },
  {
    id: "explorer",
    title: "Explorer",
    desc: "Play puzzles from all 8 categories",
    icon: "🗺️",
    check: (s) => Object.keys(s.categoryCount).length >= 8,
  },
  {
    id: "streak-3",
    title: "Habit Forming",
    desc: "Maintain a 3-day daily streak",
    icon: "🔥",
    check: (_, streak) => streak.current >= 3 || streak.best >= 3,
  },
  {
    id: "streak-7",
    title: "Weekly Warrior",
    desc: "Maintain a 7-day daily streak",
    icon: "🏆",
    check: (_, streak) => streak.current >= 7 || streak.best >= 7,
  },
  {
    id: "century",
    title: "Centurion",
    desc: "Solve 100 puzzles total",
    icon: "💯",
    check: (s) => s.totalSolved >= 100,
  },
  {
    id: "hardmode",
    title: "Iron Will",
    desc: "Complete any puzzle on Hard difficulty",
    icon: "💪",
    check: (s) => s.records.some((r) => r.difficulty === "hard"),
  },
];

export function getEarnedAchievements(): EarnedAchievement[] {
  try {
    const raw = localStorage.getItem(EARNED_KEY);
    if (raw) return JSON.parse(raw) as EarnedAchievement[];
  } catch {}
  return [];
}

/** Check all achievements and award any newly unlocked ones.
 *  Returns only the newly unlocked achievements (so callers can show toasts). */
export function checkAndAwardNew(
  stats: PuzzleStats,
  streak: StreakData
): Achievement[] {
  const already = new Set(getEarnedAchievements().map((e) => e.id));
  const nowEarned: EarnedAchievement[] = [];
  const newlyUnlocked: Achievement[] = [];

  for (const ach of ACHIEVEMENTS) {
    if (already.has(ach.id)) continue;
    if (ach.check(stats, streak)) {
      nowEarned.push({ id: ach.id, earnedAt: Date.now() });
      newlyUnlocked.push(ach);
    }
  }

  if (nowEarned.length > 0) {
    const all = [...getEarnedAchievements(), ...nowEarned];
    try {
      localStorage.setItem(EARNED_KEY, JSON.stringify(all));
    } catch {}
  }

  return newlyUnlocked;
}
