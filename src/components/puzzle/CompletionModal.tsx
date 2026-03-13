"use client";

import { useCallback } from "react";

interface CompletionModalProps {
  timer: number;
  moves: number;
  score: number;
  pieceCount: number;
  puzzleTitle: string;
  onPlayAgain: () => void;
  onNextPuzzle: (() => void) | null;
  onRandomPuzzle: () => void;
  onTryHarder: (() => void) | null;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getStars(seconds: number, pieceCount: number): number {
  const basetime = pieceCount * 3;
  if (seconds <= basetime * 0.5) return 3;
  if (seconds <= basetime) return 2;
  return 1;
}

export default function CompletionModal({
  timer,
  moves,
  score,
  pieceCount,
  puzzleTitle,
  onPlayAgain,
  onNextPuzzle,
  onRandomPuzzle,
  onTryHarder,
}: CompletionModalProps) {
  const stars = getStars(timer, pieceCount);

  const shareText = `I solved "${puzzleTitle}" jigsaw puzzle!\n${formatTime(timer)} | ${pieceCount} pieces | ${"⭐".repeat(stars)}\nScore: ${score.toLocaleString()}\nCan you beat my time?\n${typeof window !== "undefined" ? window.location.href : ""}`;

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch {}
    } else {
      await navigator.clipboard.writeText(shareText);
    }
  }, [shareText]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(shareText);
  }, [shareText]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl ring-1 ring-black/5">
        {/* Stars */}
        <div className="flex justify-center gap-2 mb-3">
          {[1, 2, 3].map((i) => (
            <svg
              key={i}
              className={`w-9 h-9 ${i <= stars ? "text-amber-400" : "text-slate-200"}`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-0.5">
          Puzzle Complete!
        </h2>
        <p className="text-slate-400 mb-5 text-sm">{puzzleTitle}</p>

        {/* Stats: 4 columns */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {[
            { label: "Time", value: formatTime(timer) },
            { label: "Score", value: score.toLocaleString() },
            { label: "Pieces", value: pieceCount },
            { label: "Moves", value: moves },
          ].map(({ label, value }) => (
            <div key={label} className="bg-slate-50 rounded-xl px-2 py-2.5">
              <div className="text-base font-bold text-slate-800 tabular-nums leading-tight">
                {value}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-medium uppercase tracking-wide">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Primary action buttons — 2×2 grid */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            onClick={onPlayAgain}
            className="py-3 bg-amber-50 text-amber-700 font-semibold rounded-xl hover:bg-amber-100 transition-colors min-h-[48px] text-sm"
          >
            ↺ Play Again
          </button>
          <button
            onClick={onNextPuzzle ?? onRandomPuzzle}
            className="py-3 bg-amber-50 text-amber-700 font-semibold rounded-xl hover:bg-amber-100 transition-colors min-h-[48px] text-sm"
          >
            {onNextPuzzle ? "→ Next Puzzle" : "🎲 Random"}
          </button>
          <button
            onClick={onRandomPuzzle}
            className="py-3 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors min-h-[48px] text-sm"
          >
            🎲 Random Puzzle
          </button>
          <button
            onClick={onTryHarder ?? undefined}
            disabled={!onTryHarder}
            className={`py-3 border rounded-xl font-medium transition-colors min-h-[48px] text-sm ${
              onTryHarder
                ? "border-slate-200 text-slate-600 hover:bg-slate-50"
                : "border-slate-100 text-slate-300 cursor-default"
            }`}
          >
            {onTryHarder ? "↑ Try Harder" : "↑ Max Pieces"}
          </button>
        </div>

        {/* Share buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all min-h-[44px] text-sm shadow-sm"
          >
            Share Result
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 border border-slate-200 text-slate-500 font-medium rounded-xl hover:bg-slate-50 transition-colors min-h-[44px] text-sm"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
