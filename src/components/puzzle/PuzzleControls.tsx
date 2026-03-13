"use client";

import { PIECE_PRESETS } from "@/engine/types";

interface PuzzleControlsProps {
  timer: number;
  moves: number;
  progress: { snapped: number; total: number };
  pieceCount: number;
  showPreview: boolean;
  onPieceCountChange: (count: number) => void;
  onTogglePreview: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PuzzleControls({
  timer,
  moves,
  progress,
  pieceCount,
  showPreview,
  onPieceCountChange,
  onTogglePreview,
  onToggleFullscreen,
  isFullscreen,
}: PuzzleControlsProps) {
  const pct =
    progress.total > 0
      ? Math.round((progress.snapped / progress.total) * 100)
      : 0;

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3 px-1">
      <div className="flex items-center gap-2 text-sm font-medium text-stone-700">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
        </svg>
        <span className="tabular-nums">{formatTime(timer)}</span>
      </div>

      <div className="flex items-center gap-2 text-sm text-stone-600">
        <span>{progress.snapped}/{progress.total}</span>
        <div className="w-20 h-2 bg-stone-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        <select
          value={pieceCount}
          onChange={(e) => onPieceCountChange(Number(e.target.value))}
          className="px-2.5 py-1.5 text-sm bg-white border border-stone-200 rounded-lg text-stone-700 cursor-pointer hover:border-stone-300 min-h-[44px]"
        >
          {Object.keys(PIECE_PRESETS).map((k) => (
            <option key={k} value={k}>
              {k} pieces
            </option>
          ))}
        </select>

        <button
          onClick={onTogglePreview}
          className={`px-3 py-1.5 text-sm rounded-lg border min-h-[44px] transition-colors ${
            showPreview
              ? "bg-amber-50 border-amber-300 text-amber-700"
              : "bg-white border-stone-200 text-stone-600 hover:border-stone-300"
          }`}
          title="Toggle preview image"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        <button
          onClick={onToggleFullscreen}
          className="px-3 py-1.5 text-sm rounded-lg border bg-white border-stone-200 text-stone-600 hover:border-stone-300 min-h-[44px] transition-colors"
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {isFullscreen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            )}
          </svg>
        </button>
      </div>
    </div>
  );
}
