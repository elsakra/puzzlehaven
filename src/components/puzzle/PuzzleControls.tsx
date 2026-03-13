"use client";

import { PIECE_PRESETS } from "@/engine/types";

interface PuzzleControlsProps {
  timer: number;
  moves: number;
  score: number;
  progress: { snapped: number; total: number };
  pieceCount: number;
  showPreview: boolean;
  isFullscreen: boolean;
  isMuted: boolean;
  isViewTransformed: boolean;
  canHint: boolean;
  hintCooldownLeft: number;
  canUndo: boolean;
  onPieceCountChange: (count: number) => void;
  onTogglePreview: () => void;
  onToggleFullscreen: () => void;
  onToggleMute: () => void;
  onResetView: () => void;
  onHint: () => void;
  onUndo: () => void;
  onSortEdges: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PuzzleControls({
  timer,
  score,
  progress,
  pieceCount,
  showPreview,
  isFullscreen,
  isMuted,
  isViewTransformed,
  canHint,
  hintCooldownLeft,
  canUndo,
  onPieceCountChange,
  onTogglePreview,
  onToggleFullscreen,
  onToggleMute,
  onResetView,
  onHint,
  onUndo,
  onSortEdges,
}: PuzzleControlsProps) {
  const pct =
    progress.total > 0
      ? Math.round((progress.snapped / progress.total) * 100)
      : 0;

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3 px-1">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full">
          <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
          </svg>
          <span className="tabular-nums">{formatTime(timer)}</span>
        </div>

        {score > 0 && (
          <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
            <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="tabular-nums">{score.toLocaleString()}</span>
          </div>
        )}

        <div className="flex items-center gap-2.5">
          <span className="text-sm font-semibold text-slate-600 tabular-nums">
            {progress.snapped}/{progress.total}
          </span>
          <div className="w-24 h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${pct}%`,
                background:
                  pct === 100
                    ? "linear-gradient(90deg, #10b981, #34d399)"
                    : "linear-gradient(90deg, #6366f1, #818cf8)",
              }}
            />
          </div>
          {pct > 0 && (
            <span className="text-xs font-medium text-slate-400">{pct}%</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Undo button */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-2.5 rounded-lg border min-h-[40px] min-w-[40px] flex items-center justify-center transition-all ${
            canUndo
              ? "bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-500"
              : "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed"
          }`}
          title="Undo last move (Ctrl+Z)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
        </button>

        {/* Hint button */}
        <button
          onClick={onHint}
          disabled={!canHint}
          className={`relative p-2.5 rounded-lg border min-h-[40px] min-w-[40px] flex items-center justify-center transition-all ${
            canHint
              ? "bg-amber-50 border-amber-300 text-amber-600 hover:bg-amber-100"
              : "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed"
          }`}
          title={canHint ? "Show hint" : `Hint available in ${hintCooldownLeft}s`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
          </svg>
          {!canHint && hintCooldownLeft > 0 && (
            <span className="absolute -top-1 -right-1 text-[9px] font-bold bg-slate-400 text-white rounded-full w-4 h-4 flex items-center justify-center leading-none">
              {hintCooldownLeft}
            </span>
          )}
        </button>

        {/* Sort Edges button */}
        <button
          onClick={onSortEdges}
          disabled={progress.snapped === progress.total && progress.total > 0}
          className={`p-2.5 rounded-lg border min-h-[40px] min-w-[40px] flex items-center justify-center transition-all ${
            progress.snapped === progress.total && progress.total > 0
              ? "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed"
              : "bg-amber-50 border-amber-300 text-amber-600 hover:bg-amber-100"
          }`}
          title="Sort edge pieces into tray below the board"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
        </button>

        <select
          value={pieceCount}
          onChange={(e) => onPieceCountChange(Number(e.target.value))}
          className="px-3 py-2 text-sm font-medium bg-white border border-slate-200 rounded-lg text-slate-700 cursor-pointer hover:border-indigo-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none min-h-[40px] transition-all"
        >
          {Object.keys(PIECE_PRESETS).map((k) => (
            <option key={k} value={k}>
              {k} pieces
            </option>
          ))}
        </select>

        {/* Reset view — only visible when user has panned/zoomed */}
        {isViewTransformed && (
          <button
            onClick={onResetView}
            className="p-2.5 rounded-lg border bg-indigo-50 border-indigo-300 text-indigo-600 shadow-sm hover:bg-indigo-100 min-h-[40px] min-w-[40px] flex items-center justify-center transition-all"
            title="Reset view"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M15 15v4.5M15 15h4.5M9 15H4.5M9 15v4.5M15 9h4.5M15 9V4.5" />
            </svg>
          </button>
        )}

        {/* Preview toggle */}
        <button
          onClick={onTogglePreview}
          className={`p-2.5 rounded-lg border min-h-[40px] min-w-[40px] flex items-center justify-center transition-all ${
            showPreview
              ? "bg-indigo-50 border-indigo-300 text-indigo-600 shadow-sm"
              : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-500"
          }`}
          title="Toggle preview image"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Mute toggle */}
        <button
          onClick={onToggleMute}
          className={`p-2.5 rounded-lg border min-h-[40px] min-w-[40px] flex items-center justify-center transition-all ${
            isMuted
              ? "bg-slate-100 border-slate-300 text-slate-400"
              : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-500"
          }`}
          title={isMuted ? "Unmute sounds" : "Mute sounds"}
        >
          {isMuted ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
          )}
        </button>

        {/* Fullscreen toggle */}
        <button
          onClick={onToggleFullscreen}
          className="p-2.5 rounded-lg border bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-500 min-h-[40px] min-w-[40px] flex items-center justify-center transition-all"
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
