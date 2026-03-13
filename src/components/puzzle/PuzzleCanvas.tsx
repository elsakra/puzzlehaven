"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { PuzzleEngine } from "@/engine/PuzzleEngine";
import { PIECE_PRESETS, GameMode, Difficulty } from "@/engine/types";
import { updateStreak, markDailyCompleted } from "@/lib/storage";
import { analytics } from "@/lib/gtag";
import { puzzles } from "@/data/puzzles";
import PuzzleControls from "./PuzzleControls";
import CompletionModal from "./CompletionModal";

const PIECE_TIERS = Object.keys(PIECE_PRESETS).map(Number).sort((a, b) => a - b);

interface HintState {
  available: boolean;
  cooldownLeft: number;
}

interface PuzzleCanvasProps {
  imageUrl: string;
  puzzleId: string;
  puzzleTitle: string;
  puzzleCategory?: string;
  initialPieceCount?: number;
  seed?: number;
}

export default function PuzzleCanvas({
  imageUrl,
  puzzleId,
  puzzleTitle,
  puzzleCategory = "unknown",
  initialPieceCount = 48,
  seed,
}: PuzzleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<PuzzleEngine | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const [timer, setTimer] = useState(0);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState({ snapped: 0, total: 0 });
  const [completed, setCompleted] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>("classic");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [showPreview, setShowPreview] = useState(false);
  const [pieceCount, setPieceCount] = useState(initialPieceCount);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isViewTransformed, setIsViewTransformed] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [hintState, setHintState] = useState<HintState>({ available: false, cooldownLeft: 0 });
  const [showProgressToast, setShowProgressToast] = useState(false);
  const progressToastShownRef = useRef(false);

  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const box = canvasContainerRef.current;
    if (!canvas || !box) return;
    const rect = box.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
  }, []);

  const initEngine = useCallback(
    async (count: number, mode: GameMode, diff: Difficulty) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      engineRef.current?.destroy();
      setLoading(true);
      setCompleted(false);
      setTimedOut(false);
      setTimer(0);
      setMoves(0);
      setProgress({ snapped: 0, total: 0 });
      setScore(0);
      setIsViewTransformed(false);
      setCanUndo(false);
      setHintState({ available: false, cooldownLeft: 0 });
      setShowProgressToast(false);
      setShowPreview(false);
      progressToastShownRef.current = false;

      sizeCanvas();

      const engine = new PuzzleEngine(canvas, {
        onTimerUpdate: setTimer,
        onMoveCountUpdate: (mvCount) => {
          setMoves(mvCount);
          setCanUndo(engineRef.current?.canUndo() ?? false);
        },
        onComplete: (secs, mvs) => {
          setCompleted(true);
          setTimer(secs);
          setMoves(mvs);
          analytics.puzzleComplete(puzzleId, count, secs, mvs);
          if (puzzleId.startsWith("daily-")) {
            updateStreak();
            const today = new Date().toISOString().split("T")[0];
            markDailyCompleted(today, secs, count);
            analytics.dailyCompleted(today, secs, count);
          }
        },
        onTimedOut: (secs, mvs) => {
          setTimedOut(true);
          setCompleted(true);
          setTimer(secs);
          setMoves(mvs);
        },
        onProgress: (snapped, total) => {
          setProgress({ snapped, total });
          if (snapped > 0 && !progressToastShownRef.current) {
            progressToastShownRef.current = true;
            setShowProgressToast(true);
            setTimeout(() => setShowProgressToast(false), 4000);
          }
        },
        onTransformChange: setIsViewTransformed,
        onScoreUpdate: setScore,
      });

      // Sync initial mute state from the new engine
      setIsMuted(engine.isMuted());

      try {
        await engine.init(imageUrl, count, puzzleId, seed, mode, diff);
        engineRef.current = engine;
        analytics.puzzleStart(puzzleId, count, puzzleCategory);
        setHintState(engine.canHint());
      } catch (err) {
        console.error("Failed to init puzzle engine:", err);
      } finally {
        setLoading(false);
      }
    },
    [imageUrl, puzzleId, puzzleCategory, seed, sizeCanvas]
  );

  useEffect(() => {
    initEngine(pieceCount, gameMode, difficulty);
    return () => {
      engineRef.current?.destroy();
    };
    // gameMode and difficulty intentionally included — reinit when changed via handleStartNewGame
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pieceCount, gameMode, difficulty, initEngine]);

  useEffect(() => {
    const handleResize = () => {
      sizeCanvas();
      engineRef.current?.resize();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sizeCanvas]);

  // Poll hint cooldown every second
  useEffect(() => {
    const id = setInterval(() => {
      if (engineRef.current) {
        setHintState(engineRef.current.canHint());
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const togglePreview = useCallback(() => {
    if (gameMode === "mystery") return;
    setShowPreview((prev) => {
      const next = !prev;
      engineRef.current?.setPreview(next);
      return next;
    });
  }, [gameMode]);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => {
        setIsFullscreen(true);
        setTimeout(() => {
          sizeCanvas();
          engineRef.current?.resize();
        }, 100);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
        setTimeout(() => {
          sizeCanvas();
          engineRef.current?.resize();
        }, 100);
      });
    }
  }, [sizeCanvas]);

  const toggleMute = useCallback(() => {
    const newMuted = engineRef.current?.toggleMute() ?? false;
    setIsMuted(newMuted);
  }, []);

  const resetView = useCallback(() => {
    engineRef.current?.resetView();
  }, []);

  const handleHint = useCallback(() => {
    engineRef.current?.hint();
    setHintState({ available: false, cooldownLeft: 10 });
  }, []);

  const handleUndo = useCallback(() => {
    engineRef.current?.undo();
    setCanUndo(engineRef.current?.canUndo() ?? false);
  }, []);

  const handleSortEdges = useCallback(() => {
    engineRef.current?.sortEdges();
    setCanUndo(engineRef.current?.canUndo() ?? false);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept shortcuts when focus is inside a text field
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        handleUndo();
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      switch (e.key) {
        case "h":
        case "H":
          e.preventDefault();
          handleHint();
          break;
        case " ":
          e.preventDefault();
          togglePreview();
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "+":
        case "=":
          e.preventDefault();
          engineRef.current?.zoomIn();
          break;
        case "-":
          e.preventDefault();
          engineRef.current?.zoomOut();
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleHint, togglePreview, toggleFullscreen]);

  // Fire analytics when user leaves mid-puzzle
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!completed && progress.snapped > 0 && progress.total > 0) {
        analytics.puzzleAbandoned(puzzleId, progress.snapped, progress.total);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [completed, progress.snapped, progress.total, puzzleId]);

  const handleStartNewGame = useCallback(
    (newMode: GameMode, newCount: number, newDifficulty: Difficulty) => {
      if (newCount !== pieceCount) {
        analytics.pieceCountChange(puzzleId, pieceCount, newCount);
      }
      // Batch all three state updates — React will re-init once via useEffect
      setGameMode(newMode);
      setPieceCount(newCount);
      setDifficulty(newDifficulty);
    },
    [puzzleId, pieceCount]
  );

  const handlePlayAgain = useCallback(() => {
    setCompleted(false);
    setTimedOut(false);
    initEngine(pieceCount, gameMode, difficulty);
  }, [pieceCount, gameMode, difficulty, initEngine]);

  // Navigate to the next puzzle in the same category (wraps around)
  const handleNextPuzzle = useCallback((): (() => void) | null => {
    const currentPuzzle = puzzles.find((p) => p.id === puzzleId);
    if (!currentPuzzle) return null;
    const categoryPuzzles = puzzles.filter((p) => p.category === currentPuzzle.category);
    const idx = categoryPuzzles.findIndex((p) => p.id === puzzleId);
    if (idx === -1) return null;
    const next = categoryPuzzles[(idx + 1) % categoryPuzzles.length];
    return () => {
      window.location.href = `/puzzles/${next.category}/${next.slug}`;
    };
  }, [puzzleId]);

  const handleRandomPuzzle = useCallback(() => {
    const pool = puzzles.filter((p) => p.id !== puzzleId);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    window.location.href = `/puzzles/${pick.category}/${pick.slug}`;
  }, [puzzleId]);

  const handleTryHarder = useCallback((): (() => void) | null => {
    const idx = PIECE_TIERS.indexOf(pieceCount);
    if (idx === -1 || idx >= PIECE_TIERS.length - 1) return null;
    const nextTier = PIECE_TIERS[idx + 1];
    return () => {
      handleStartNewGame(gameMode, nextTier, difficulty);
    };
  }, [pieceCount, gameMode, difficulty, handleStartNewGame]);

  return (
    <div ref={containerRef} className="relative w-full flex flex-col gap-3">
      <PuzzleControls
        timer={timer}
        moves={moves}
        score={score}
        progress={progress}
        pieceCount={pieceCount}
        gameMode={gameMode}
        difficulty={difficulty}
        showPreview={showPreview}
        isFullscreen={isFullscreen}
        isMuted={isMuted}
        isViewTransformed={isViewTransformed}
        canHint={hintState.available}
        hintCooldownLeft={hintState.cooldownLeft}
        canUndo={canUndo}
        onNewGame={handleStartNewGame}
        onTogglePreview={togglePreview}
        onToggleFullscreen={toggleFullscreen}
        onToggleMute={toggleMute}
        onResetView={resetView}
        onHint={handleHint}
        onUndo={handleUndo}
        onSortEdges={handleSortEdges}
      />

      <div
        ref={canvasContainerRef}
        className="relative w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 aspect-square sm:aspect-[4/3]"
        style={{ touchAction: "none" }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-slate-600 border-t-indigo-400 rounded-full animate-spin" />
              </div>
              <p className="text-slate-400 text-sm font-medium">Loading puzzle...</p>
            </div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          style={{ touchAction: "none" }}
        />
      </div>

      {showProgressToast && !completed && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-slate-800/95 text-white text-sm px-4 py-2.5 rounded-full shadow-lg backdrop-blur-sm animate-[fadeIn_0.3s_ease-out] pointer-events-none">
          <svg className="w-4 h-4 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Progress saved — come back anytime!
        </div>
      )}

      {completed && (
        <CompletionModal
          timer={timer}
          moves={moves}
          score={score}
          pieceCount={pieceCount}
          gameMode={gameMode}
          timedOut={timedOut}
          puzzleTitle={puzzleTitle}
          puzzleUrl={typeof window !== "undefined" ? window.location.href : ""}
          imageUrl={imageUrl}
          onPlayAgain={handlePlayAgain}
          onNextPuzzle={handleNextPuzzle()}
          onRandomPuzzle={handleRandomPuzzle}
          onTryHarder={handleTryHarder()}
        />
      )}
    </div>
  );
}
