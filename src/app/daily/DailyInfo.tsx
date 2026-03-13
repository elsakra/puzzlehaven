"use client";

import { useEffect, useState } from "react";
import { getStreak } from "@/lib/storage";

export default function DailyInfo() {
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);

  useEffect(() => {
    const data = getStreak();
    setStreak(data.current);
    setBest(data.best);
  }, []);

  if (streak === 0 && best === 0) return null;

  return (
    <div className="flex justify-center gap-6 mb-6">
      <div className="text-center">
        <div className="text-2xl font-bold text-amber-600 tabular-nums">{streak}</div>
        <div className="text-xs text-stone-500">Current Streak</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-stone-700 tabular-nums">{best}</div>
        <div className="text-xs text-stone-500">Best Streak</div>
      </div>
    </div>
  );
}
