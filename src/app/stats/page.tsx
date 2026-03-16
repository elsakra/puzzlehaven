"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStats, PuzzleStats, formatTime, totalTimeLabel, recentSolvedCount } from "@/lib/stats";
import { getStreak } from "@/lib/storage";
import type { StreakData } from "@/lib/storage";
import { ACHIEVEMENTS, getEarnedAchievements } from "@/lib/achievements";
import type { EarnedAchievement } from "@/lib/achievements";

const PIECE_COUNTS = [24, 48, 96, 150];
const CATEGORIES = ["animals", "nature", "landscapes", "art", "food", "travel", "holidays", "abstract"];
const CATEGORY_LABELS: Record<string, string> = {
  animals: "Animals", nature: "Nature", landscapes: "Landscapes", art: "Art",
  food: "Food", travel: "Travel", holidays: "Holidays", abstract: "Abstract",
};

export default function StatsPage() {
  const [stats, setStats] = useState<PuzzleStats | null>(null);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [earned, setEarned] = useState<EarnedAchievement[]>([]);

  useEffect(() => {
    setStats(getStats());
    setStreak(getStreak());
    setEarned(getEarnedAchievements());
  }, []);

  if (!stats || !streak) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-slate-400">
        Loading your stats…
      </div>
    );
  }

  const earnedIds = new Set(earned.map((e) => e.id));
  const maxCategoryCount = Math.max(1, ...CATEGORIES.map((c) => stats.categoryCount[c] ?? 0));
  const weeklySolved = recentSolvedCount(stats, 7);

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
      {/* Header */}
      <div className="mb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Your Stats</h1>
        <p className="text-slate-400 mt-1 text-sm">All data is stored privately on this device.</p>
      </div>

      {/* Streak card */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-5 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-1">Daily streak</div>
          <div className="text-4xl font-black text-slate-900">{streak.current}</div>
          <div className="text-sm text-slate-500 mt-0.5">Best: {streak.best} days</div>
        </div>
        <div className="text-5xl select-none">{streak.current >= 7 ? "🏆" : streak.current >= 3 ? "🔥" : "🧩"}</div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <StatCard label="Puzzles solved" value={stats.totalSolved.toString()} />
        <StatCard label="Total time" value={totalTimeLabel(stats.totalTimeSecs)} />
        <StatCard label="This week" value={weeklySolved.toString()} />
      </div>

      {/* Best times */}
      {PIECE_COUNTS.some((n) => stats.bestTimes[n] !== undefined) && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-3">Best times</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PIECE_COUNTS.map((n) => {
              const best = stats.bestTimes[n];
              return (
                <div key={n} className="bg-white border border-slate-100 rounded-xl p-4 text-center">
                  <div className="text-xs text-slate-400 font-medium mb-1">{n} pieces</div>
                  <div className="text-xl font-black text-slate-900">
                    {best !== undefined ? formatTime(best) : <span className="text-slate-300">—</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Category breakdown */}
      {stats.totalSolved > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-3">Categories played</h2>
          <div className="space-y-2">
            {CATEGORIES.map((cat) => {
              const count = stats.categoryCount[cat] ?? 0;
              const pct = maxCategoryCount > 0 ? (count / maxCategoryCount) * 100 : 0;
              return (
                <div key={cat} className="flex items-center gap-3">
                  <span className="w-20 text-sm text-slate-500 text-right shrink-0">
                    {CATEGORY_LABELS[cat]}
                  </span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-sm font-semibold text-slate-700 text-right shrink-0">
                    {count || ""}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Achievements */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-slate-800 mb-3">
          Achievements
          <span className="ml-2 text-sm font-normal text-slate-400">
            {earnedIds.size}/{ACHIEVEMENTS.length} unlocked
          </span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ACHIEVEMENTS.map((ach) => {
            const isEarned = earnedIds.has(ach.id);
            const earnedEntry = earned.find((e) => e.id === ach.id);
            return (
              <div
                key={ach.id}
                className={`rounded-2xl p-4 text-center border transition-all ${
                  isEarned
                    ? "bg-amber-50 border-amber-200"
                    : "bg-slate-50 border-slate-100 opacity-50 grayscale"
                }`}
              >
                <div className="text-3xl mb-2 select-none">{ach.icon}</div>
                <div className="text-xs font-bold text-slate-800 leading-tight">{ach.title}</div>
                <div className="text-xs text-slate-500 mt-1 leading-tight">{ach.desc}</div>
                {isEarned && earnedEntry && (
                  <div className="text-xs text-amber-500 mt-1.5 font-medium">
                    {new Date(earnedEntry.earnedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Empty state */}
      {stats.totalSolved === 0 && (
        <div className="text-center py-12 text-slate-400">
          <div className="text-4xl mb-3">🧩</div>
          <p className="text-base font-medium text-slate-600">No puzzles solved yet</p>
          <p className="text-sm mt-1">Complete your first puzzle to start tracking stats!</p>
          <Link
            href="/daily"
            className="inline-block mt-5 px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors"
          >
            Play today&apos;s puzzle
          </Link>
        </div>
      )}
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 text-center">
      <div className="text-2xl sm:text-3xl font-black text-slate-900">{value}</div>
      <div className="text-xs text-slate-400 mt-1">{label}</div>
    </div>
  );
}
