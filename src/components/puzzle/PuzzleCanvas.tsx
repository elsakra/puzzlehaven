"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { PuzzleEngine } from "@/engine/PuzzleEngine";
import PuzzleControls from "./PuzzleControls";
import CompletionModal from "./CompletionModal";

interface PuzzleCanvasProps {
  imageUrl: string;
  puzzleId: string;
  puzzleTitle: string;
  initialPieceCount?: number;
  seed?: number;
}

export default function PuzzleCanvas({
  imageUrl,
  puzzleId,
  puzzleTitle,
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

      sizeCanvas();

      const engine = new PuzzleEngine(canvas, {
        onTimerUpdate: setTimer,
        onMoveCountUpdate: setMoves,
        onComplete: (secs, mvs) => {
          setCompleted(true);
          setTimer(secs);
          setMoves(mvs);
        },
        onProgress: (snapped, total) => setProgress({ snapped, total }),
      });

      try {
        await engine.init(imageUrl, count, puzzleId, seed);
        engineRef.current = engine;
      } catch (err) {
        console.error("Failed to init puzzle engine:", err);
      } finally {
        setLoading(false);
      }
    },
    [imageUrl, puzzleId, seed, sizeCanvas]
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

  const handlePieceCountChange = useCallback((count: number) => {
    setPieceCount(count);
  }, []);

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
        onPieceCountChange={handlePieceCountChange}
        onTogglePreview={togglePreview}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
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
