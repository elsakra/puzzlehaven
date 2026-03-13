"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { PuzzleEngine } from "@/engine/PuzzleEngine";
import { updateStreak, markDailyCompleted } from "@/lib/storage";
import { analytics } from "@/lib/gtag";
import PuzzleControls from "./PuzzleControls";
import CompletionModal from "./CompletionModal";

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
  const [progress, setProgress] = useState({ snapped: 0, total: 0 });
  const [completed, setCompleted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [pieceCount, setPieceCount] = useState(initialPieceCount);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isViewTransformed, setIsViewTransformed] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [hintState, setHintState] = useState<HintState>({ available: false, cooldownLeft: 0 });

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
    async (count: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      engineRef.current?.destroy();
      setLoading(true);
      setCompleted(false);
      setTimer(0);
      setMoves(0);
      setProgress({ snapped: 0, total: 0 });
      setIsViewTransformed(false);
      setCanUndo(false);
      setHintState({ available: false, cooldownLeft: 0 });

      sizeCanvas();

      const engine = new PuzzleEngine(canvas, {
        onTimerUpdate: setTimer,
        onMoveCountUpdate: (count) => {
          setMoves(count);
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
        onProgress: (snapped, total) => setProgress({ snapped, total }),
        onTransformChange: setIsViewTransformed,
      });

      // Sync initial mute state from the new engine
      setIsMuted(engine.isMuted());

      try {
        await engine.init(imageUrl, count, puzzleId, seed);
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
    initEngine(pieceCount);
    return () => {
      engineRef.current?.destroy();
    };
  }, [pieceCount, initEngine]);

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
    setShowPreview((prev) => {
      const next = !prev;
      engineRef.current?.setPreview(next);
      return next;
    });
  }, []);

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

  // Keyboard shortcuts: Ctrl+Z / Cmd+Z for undo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo]);

  const handlePieceCountChange = useCallback(
    (count: number) => {
      analytics.pieceCountChange(puzzleId, pieceCount, count);
      setPieceCount(count);
    },
    [puzzleId, pieceCount]
  );

  const handleNewGame = useCallback(() => {
    setCompleted(false);
    initEngine(pieceCount);
  }, [pieceCount, initEngine]);

  return (
    <div ref={containerRef} className="relative w-full flex flex-col gap-3">
      <PuzzleControls
        timer={timer}
        moves={moves}
        progress={progress}
        pieceCount={pieceCount}
        showPreview={showPreview}
        isFullscreen={isFullscreen}
        isMuted={isMuted}
        isViewTransformed={isViewTransformed}
        canHint={hintState.available}
        hintCooldownLeft={hintState.cooldownLeft}
        canUndo={canUndo}
        onPieceCountChange={handlePieceCountChange}
        onTogglePreview={togglePreview}
        onToggleFullscreen={toggleFullscreen}
        onToggleMute={toggleMute}
        onResetView={resetView}
        onHint={handleHint}
        onUndo={handleUndo}
      />

      <div
        ref={canvasContainerRef}
        className="relative w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
        style={{ aspectRatio: "4/3" }}
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
        />
      </div>

      {completed && (
        <CompletionModal
          timer={timer}
          moves={moves}
          pieceCount={pieceCount}
          puzzleTitle={puzzleTitle}
          onNewGame={handleNewGame}
        />
      )}
    </div>
  );
}
