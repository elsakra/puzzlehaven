"use client";

import { useCallback } from "react";

interface CompletionModalProps {
  timer: number;
  moves: number;
  pieceCount: number;
  puzzleTitle: string;
  onNewGame: () => void;
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
  pieceCount,
  puzzleTitle,
  onNewGame,
}: CompletionModalProps) {
  const stars = getStars(timer, pieceCount);

  const shareText = `I solved "${puzzleTitle}" jigsaw puzzle!\n${formatTime(timer)} | ${pieceCount} pieces | ${"*".repeat(stars)}\nCan you beat my time?\n${typeof window !== "undefined" ? window.location.href : ""}`;

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
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl ring-1 ring-black/5">
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3].map((i) => (
            <svg
              key={i}
              className={`w-10 h-10 ${i <= stars ? "text-amber-400" : "text-slate-200"}`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-1">
          Puzzle Complete!
        </h2>

        <p className="text-slate-400 mb-6 text-sm">{puzzleTitle}</p>

        <div className="flex justify-center gap-6 mb-6">
          <div className="bg-slate-50 rounded-xl px-5 py-3 flex-1">
            <div className="text-xl font-bold text-slate-800 tabular-nums">
              {formatTime(timer)}
            </div>
            <div className="text-xs text-slate-400 mt-0.5 font-medium">Time</div>
          </div>
          <div className="bg-slate-50 rounded-xl px-5 py-3 flex-1">
            <div className="text-xl font-bold text-slate-800 tabular-nums">
              {pieceCount}
            </div>
            <div className="text-xs text-slate-400 mt-0.5 font-medium">Pieces</div>
          </div>
          <div className="bg-slate-50 rounded-xl px-5 py-3 flex-1">
            <div className="text-xl font-bold text-slate-800 tabular-nums">
              {moves}
            </div>
            <div className="text-xs text-slate-400 mt-0.5 font-medium">Moves</div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={handleShare}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all min-h-[48px] text-base shadow-sm"
          >
            Share Result
          </button>
          <div className="flex gap-2.5">
            <button
              onClick={handleCopy}
              className="flex-1 py-3 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors min-h-[48px]"
            >
              Copy
            </button>
            <button
              onClick={onNewGame}
              className="flex-1 py-3 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors min-h-[48px]"
            >
              New Puzzle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
