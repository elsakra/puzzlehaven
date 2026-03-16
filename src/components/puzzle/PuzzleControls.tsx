"use client";

import { useState, useRef, useEffect } from "react";
import { PIECE_PRESETS, GameMode, GAME_MODE_LABELS, Difficulty, DIFFICULTY_LABELS } from "@/engine/types";

const PIECE_OPTIONS = Object.keys(PIECE_PRESETS).map(Number).sort((a, b) => a - b);

interface PuzzleControlsProps {
  timer: number;
  moves: number;
  score: number;
  progress: { snapped: number; total: number };
  pieceCount: number;
  gameMode: GameMode;
  difficulty: Difficulty;
  showPreview: boolean;
  isFullscreen: boolean;
  isMuted: boolean;
  isViewTransformed: boolean;
  canHint: boolean;
  hintCooldownLeft: number;
  canUndo: boolean;
  onNewGame: (mode: GameMode, pieces: number, difficulty: Difficulty) => void;
  onTogglePreview: () => void;
  onToggleFullscreen: () => void;
  onToggleMute: () => void;
  onOpenSettings: () => void;
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
  gameMode,
  difficulty,
  showPreview,
  isFullscreen,
  isMuted,
  isViewTransformed,
  canHint,
  hintCooldownLeft,
  canUndo,
  onNewGame,
  onTogglePreview,
  onToggleFullscreen,
  onToggleMute,
  onOpenSettings,
  onResetView,
  onHint,
  onUndo,
  onSortEdges,
}: PuzzleControlsProps) {
  const pct =
    progress.total > 0
      ? Math.round((progress.snapped / progress.total) * 100)
      : 0;

  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingMode, setPendingMode] = useState<GameMode>(gameMode);
  const [pendingPieces, setPendingPieces] = useState(pieceCount);
  const [pendingDifficulty, setPendingDifficulty] = useState<Difficulty>(difficulty);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync pending values to current when menu opens
  useEffect(() => {
    if (menuOpen) {
      setPendingMode(gameMode);
      setPendingPieces(pieceCount);
      setPendingDifficulty(difficulty);
    }
  }, [menuOpen, gameMode, pieceCount, difficulty]);

  // Close on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const handleStartNewGame = () => {
    setMenuOpen(false);
    onNewGame(pendingMode, pendingPieces, pendingDifficulty);
  };

  // Timer display logic
  const isTimedMode = gameMode === "timed";
  const isZenMode = gameMode === "zen";
  const timerLow = isTimedMode && timer <= 60;
  const timerCritical = isTimedMode && timer <= 30;

  const modeInfo = GAME_MODE_LABELS[gameMode];

  return (
    <div className="flex flex-col mb-3">
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 px-1">
      <div className="flex items-center gap-4">
        {/* Timer — hidden in Zen, countdown display in Timed */}
        {!isZenMode && (
          <div
            className={`flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full transition-colors ${
              timerCritical
                ? "bg-red-100 text-red-700 border border-red-300 animate-pulse"
                : timerLow
                ? "bg-amber-100 text-amber-700 border border-amber-300"
                : isTimedMode
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {isTimedMode ? (
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2M12 2a10 10 0 100 20A10 10 0 0012 2z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
              </svg>
            )}
            <span className="tabular-nums">{formatTime(timer)}</span>
          </div>
        )}

        {/* Zen mode indicator (replaces timer) */}
        {isZenMode && (
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            <span>🌿</span>
            <span>Zen</span>
          </div>
        )}

        {/* Score badge — hidden in Zen */}
        {score > 0 && !isZenMode && (
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

        {/* New Game dropdown */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-white border rounded-lg transition-all min-h-[40px] ${
              menuOpen
                ? "border-indigo-400 ring-2 ring-indigo-200 text-indigo-700"
                : "border-slate-200 text-slate-700 hover:border-indigo-300"
            }`}
            title="Change game mode or piece count"
          >
            <span>{modeInfo.icon}</span>
            <span className="hidden sm:inline">{modeInfo.label} ·</span>
            <span className="hidden sm:inline">{DIFFICULTY_LABELS[difficulty].icon} ·</span>
            <span className="tabular-nums">{pieceCount}pc</span>
            <svg className={`w-3 h-3 text-slate-400 transition-transform ${menuOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute bottom-full mb-2 right-0 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 w-60 z-50">
              {/* Mode section */}
              <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-2">Mode</p>
              <div className="space-y-1 mb-3">
                {(["classic", "zen", "timed", "mystery"] as GameMode[]).map((m) => {
                  const info = GAME_MODE_LABELS[m];
                  return (
                    <button
                      key={m}
                      onClick={() => setPendingMode(m)}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-colors flex items-center gap-2 ${
                        pendingMode === m
                          ? "bg-indigo-50 border border-indigo-200"
                          : "hover:bg-slate-50 border border-transparent"
                      }`}
                    >
                      <span className="text-base">{info.icon}</span>
                      <span>
                        <span className={`block text-sm font-semibold ${pendingMode === m ? "text-indigo-700" : "text-slate-700"}`}>
                          {info.label}
                        </span>
                        <span className="block text-[11px] text-slate-400 leading-tight">{info.desc}</span>
                      </span>
                      {pendingMode === m && (
                        <svg className="w-4 h-4 text-indigo-500 ml-auto shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Difficulty section */}
              <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-2">Difficulty</p>
              <div className="space-y-1 mb-3">
                {(["easy", "medium", "hard"] as Difficulty[]).map((d) => {
                  const info = DIFFICULTY_LABELS[d];
                  return (
                    <button
                      key={d}
                      onClick={() => setPendingDifficulty(d)}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-colors flex items-center gap-2 ${
                        pendingDifficulty === d
                          ? "bg-amber-50 border border-amber-300"
                          : "hover:bg-slate-50 border border-transparent"
                      }`}
                    >
                      <span className="text-base">{info.icon}</span>
                      <span>
                        <span className={`block text-sm font-semibold ${pendingDifficulty === d ? "text-amber-700" : "text-slate-700"}`}>
                          {info.label}
                        </span>
                        <span className="block text-[11px] text-slate-400 leading-tight">{info.desc}</span>
                      </span>
                      {pendingDifficulty === d && (
                        <svg className="w-4 h-4 text-amber-500 ml-auto shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Hard mode tip */}
              {pendingDifficulty === "hard" && (
                <p className="text-[10px] text-slate-400 bg-slate-50 rounded-lg px-2.5 py-1.5 mb-2 leading-tight">
                  Right-click (desktop) or double-tap (mobile) a piece to rotate it 90°. Pieces only snap when correctly oriented.
                </p>
              )}

              {/* Pieces section */}
              <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-2">Pieces</p>
              <div className="grid grid-cols-4 gap-1.5 mb-3">
                {PIECE_OPTIONS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setPendingPieces(n)}
                    className={`py-2 rounded-lg text-sm font-semibold transition-colors ${
                      pendingPieces === n
                        ? "bg-indigo-500 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <button
                onClick={handleStartNewGame}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all text-sm shadow-sm"
              >
                Start New Game
              </button>
            </div>
          )}
        </div>

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

        {/* Preview toggle — disabled in Mystery mode */}
        <button
          onClick={gameMode !== "mystery" ? onTogglePreview : undefined}
          disabled={gameMode === "mystery"}
          className={`p-2.5 rounded-lg border min-h-[40px] min-w-[40px] flex items-center justify-center transition-all ${
            gameMode === "mystery"
              ? "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed"
              : showPreview
              ? "bg-indigo-50 border-indigo-300 text-indigo-600 shadow-sm"
              : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-500"
          }`}
          title={gameMode === "mystery" ? "Preview hidden in Mystery mode" : "Toggle preview image"}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {gameMode === "mystery" ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            ) : (
              <>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </>
            )}
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

        {/* Settings gear */}
        <button
          onClick={onOpenSettings}
          className="p-2.5 rounded-lg border bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-500 min-h-[40px] min-w-[40px] flex items-center justify-center transition-all"
          title="Game settings"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
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

    {/* Rotation hint — only shown when Hard difficulty is active */}
    {difficulty === "hard" && (
      <div className="flex items-center gap-1.5 px-1 mt-1.5">
        <svg className="w-3 h-3 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        <span className="text-xs text-slate-400">
          <span className="hidden sm:inline">Hard mode: </span>
          <strong className="font-semibold text-slate-500">Right-click</strong>
          <span className="text-slate-400"> (desktop) · </span>
          <strong className="font-semibold text-slate-500">Double-tap</strong>
          <span className="text-slate-400"> (mobile) to rotate pieces 90°</span>
        </span>
      </div>
    )}
    </div>
  );
}
