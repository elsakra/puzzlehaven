import type { Metadata } from "next";
import PuzzleCanvas from "@/components/puzzle/PuzzleCanvas";
import { getDailyPuzzle } from "@/lib/daily";
import { formatDate, getDailySeed } from "@/lib/daily";
import DailyInfo from "./DailyInfo";

export const metadata: Metadata = {
  title: "Daily Jigsaw Puzzle — Free Online",
  description:
    "Play today's free daily jigsaw puzzle. A new challenge every day. Share your time and build your streak!",
};

export default function DailyPage() {
  const puzzle = getDailyPuzzle();
  const seed = getDailySeed();
  const today = formatDate();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          Daily Challenge
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-2">
          {puzzle.title}
        </h1>
        <p className="text-slate-400 mt-2">{today}</p>
      </div>

      <DailyInfo />

      <PuzzleCanvas
        imageUrl={puzzle.imageUrl}
        puzzleId={`daily-${seed}`}
        puzzleTitle={puzzle.title}
        initialPieceCount={48}
        seed={seed}
      />

      <div className="mt-8 text-center">
        <p className="text-slate-600 leading-relaxed max-w-xl mx-auto">
          {puzzle.description}
        </p>
        <p className="text-slate-400 text-sm mt-3">
          Everyone gets the same puzzle each day. Solve it, share your time, and
          see how you compare!
        </p>
      </div>
    </div>
  );
}
