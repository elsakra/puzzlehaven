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

  const shareText = `I solved "${puzzleTitle}" jigsaw puzzle!\n⏱️ ${formatTime(timer)} | 🧩 ${pieceCount} pieces | ${"⭐".repeat(stars)}\nCan you beat my time?\n${typeof window !== "undefined" ? window.location.href : ""}`;

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
        <div className="text-5xl mb-4">
          {"⭐".repeat(stars)}
          {"☆".repeat(3 - stars)}
        </div>

        <h2 className="text-2xl font-bold text-stone-800 mb-2">
          Puzzle Complete!
        </h2>

        <p className="text-stone-500 mb-6 text-sm">{puzzleTitle}</p>

        <div className="flex justify-center gap-8 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-stone-800 tabular-nums">
              {formatTime(timer)}
            </div>
            <div className="text-xs text-stone-500 mt-1">Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-stone-800 tabular-nums">
              {pieceCount}
            </div>
            <div className="text-xs text-stone-500 mt-1">Pieces</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-stone-800 tabular-nums">
              {moves}
            </div>
            <div className="text-xs text-stone-500 mt-1">Moves</div>
          </div>
        </div>

        <div className="bg-stone-50 rounded-lg p-3 mb-6 text-left text-xs text-stone-600 font-mono whitespace-pre-line">
          {shareText}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleShare}
            className="w-full py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors min-h-[48px] text-base"
          >
            Share Result
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 py-3 border border-stone-200 text-stone-600 font-medium rounded-xl hover:bg-stone-50 transition-colors min-h-[48px]"
            >
              Copy
            </button>
            <button
              onClick={onNewGame}
              className="flex-1 py-3 border border-stone-200 text-stone-600 font-medium rounded-xl hover:bg-stone-50 transition-colors min-h-[48px]"
            >
              New Puzzle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
