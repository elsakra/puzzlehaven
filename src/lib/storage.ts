const STREAK_KEY = "puzzle_streak";
const LAST_DAILY_KEY = "puzzle_last_daily";

export interface StreakData {
  current: number;
  best: number;
  lastDate: string;
}

export function getStreak(): StreakData {
  try {
    const data = localStorage.getItem(STREAK_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return { current: 0, best: 0, lastDate: "" };
}

export function updateStreak(): StreakData {
  const today = new Date().toISOString().split("T")[0];
  const streak = getStreak();

  if (streak.lastDate === today) return streak;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (streak.lastDate === yesterdayStr) {
    streak.current += 1;
  } else {
    streak.current = 1;
  }

  streak.best = Math.max(streak.best, streak.current);
  streak.lastDate = today;

  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
  } catch {}

  return streak;
}

export function markDailyCompleted(date: string, time: number, pieces: number) {
  try {
    const data = {
      date,
      time,
      pieces,
      completedAt: Date.now(),
    };
    localStorage.setItem(LAST_DAILY_KEY, JSON.stringify(data));
  } catch {}
}

export function getDailyCompletion(): { date: string; time: number; pieces: number } | null {
  try {
    const data = localStorage.getItem(LAST_DAILY_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return null;
}
