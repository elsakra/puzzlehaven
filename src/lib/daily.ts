import { puzzles, Puzzle } from "@/data/puzzles";

export function getDailyPuzzle(date?: Date): Puzzle {
  const d = date ?? new Date();
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  const index = seed % puzzles.length;
  return puzzles[index];
}

export function getDailySeed(date?: Date): number {
  const d = date ?? new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export function formatDate(date?: Date): string {
  const d = date ?? new Date();
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
