"use client";

import { useCallback } from "react";
import type { GameMode } from "@/engine/types";

interface CompletionModalProps {
  timer: number;
  moves: number;
  score: number;
  pieceCount: number;
  gameMode?: GameMode;
  timedOut?: boolean;
  puzzleTitle: string;
  puzzleUrl: string;
  imageUrl: string;
  /** If set, this player is responding to a challenge */
  challengerTime?: number;
  challengerScore?: number;
  challengerStars?: number;
  onPlayAgain: () => void;
  onNextPuzzle: (() => void) | null;
  onRandomPuzzle: () => void;
  onTryHarder: (() => void) | null;
  onChallengeShare?: () => void;
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
  gameMode = "classic",
  timedOut = false,
  puzzleTitle,
  puzzleUrl,
  imageUrl,
  challengerTime,
  challengerScore,
  challengerStars,
  onPlayAgain,
  onNextPuzzle,
  onRandomPuzzle,
  onTryHarder,
  onChallengeShare,
}: CompletionModalProps) {
  const stars = timedOut ? 0 : getStars(timer, pieceCount);
  const isZen = gameMode === "zen";
  const isChallenge = typeof challengerTime === "number" && !timedOut && !isZen;
  const playerWon = isChallenge && timer < (challengerTime ?? Infinity);

  const shareText = timedOut
    ? `I ran out of time on "${puzzleTitle}" jigsaw puzzle!\n${pieceCount} pieces · ${moves} moves\nThink you can beat the clock?\n${puzzleUrl}`
    : `I solved "${puzzleTitle}" jigsaw puzzle!\n${formatTime(timer)} | ${pieceCount} pieces | ${"⭐".repeat(stars)}\nScore: ${score.toLocaleString()}\nCan you beat my time?\n${puzzleUrl}`;

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

  const handlePinterestShare = useCallback(() => {
    const url = encodeURIComponent(puzzleUrl);
    const media = encodeURIComponent(imageUrl);
    const desc = timedOut
      ? encodeURIComponent(`Can you beat the clock on "${puzzleTitle}" online jigsaw puzzle? ${pieceCount} pieces · Try now!`)
      : encodeURIComponent(`I just solved "${puzzleTitle}" online jigsaw puzzle! ${formatTime(timer)} · ${pieceCount} pieces · ${"⭐".repeat(stars)} Can you beat my time?`);
    window.open(
      `https://pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${desc}`,
      "_blank",
      "width=600,height=500"
    );
  }, [puzzleUrl, imageUrl, puzzleTitle, timer, pieceCount, stars, timedOut]);

  const handleTwitterShare = useCallback(() => {
    const text = timedOut
      ? encodeURIComponent(`I ran out of time on "${puzzleTitle}" jigsaw puzzle! ${pieceCount} pieces · ${moves} moves\n\nThink you can beat the clock?`)
      : encodeURIComponent(`I solved "${puzzleTitle}" jigsaw puzzle! ${formatTime(timer)} · ${pieceCount} pieces · ${"⭐".repeat(stars)} · Score: ${score.toLocaleString()}\n\nCan you beat my time?`);
    const url = encodeURIComponent(puzzleUrl);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
      "width=600,height=500"
    );
  }, [puzzleUrl, puzzleTitle, timer, pieceCount, stars, score, moves, timedOut]);

  const handleFacebookShare = useCallback(() => {
    const url = encodeURIComponent(puzzleUrl);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
      "width=600,height=500"
    );
  }, [puzzleUrl]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl ring-1 ring-black/5">
        {timedOut ? (
          /* Time's Up state */
          <div className="mb-4">
            <div className="text-5xl mb-2">⏱</div>
            <h2 className="text-2xl font-bold text-red-600 mb-0.5">Time&apos;s Up!</h2>
            <p className="text-slate-400 text-sm">{puzzleTitle}</p>
          </div>
        ) : isZen ? (
          /* Zen completion */
          <div className="mb-4">
            <div className="text-5xl mb-2">🌿</div>
            <h2 className="text-2xl font-bold text-emerald-700 mb-0.5">Puzzle Complete!</h2>
            <p className="text-slate-400 text-sm">{puzzleTitle}</p>
          </div>
        ) : (
          /* Classic / Timed / Mystery success */
          <>
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
              {gameMode === "timed" ? "⏱ Challenge Complete!" : "Puzzle Complete!"}
            </h2>
            <p className="text-slate-400 mb-5 text-sm">{puzzleTitle}</p>
          </>
        )}

        {/* Challenge result — shown when responding to a friend's challenge */}
        {isChallenge && (
          <div className={`mb-4 rounded-2xl px-4 py-3 ${playerWon ? "bg-emerald-50 ring-1 ring-emerald-200" : "bg-amber-50 ring-1 ring-amber-200"}`}>
            <div className="text-lg font-bold mb-2">
              {playerWon ? "🎉 You beat the challenge!" : "😅 Not quite — try again!"}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-white/70 rounded-xl py-2 px-3">
                <div className={`font-bold tabular-nums text-base ${playerWon ? "text-emerald-600" : "text-slate-800"}`}>
                  {formatTime(timer)}
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Your time</div>
              </div>
              <div className="bg-white/70 rounded-xl py-2 px-3">
                <div className="font-bold tabular-nums text-base text-slate-500">
                  {formatTime(challengerTime!)}
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Friend&apos;s time</div>
              </div>
            </div>
            {challengerScore !== undefined && (
              <div className="mt-1.5 grid grid-cols-2 gap-2 text-sm">
                <div className="bg-white/70 rounded-xl py-2 px-3">
                  <div className={`font-bold tabular-nums text-base ${score > challengerScore ? "text-emerald-600" : "text-slate-800"}`}>
                    {score.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Your score</div>
                </div>
                <div className="bg-white/70 rounded-xl py-2 px-3">
                  <div className="font-bold tabular-nums text-base text-slate-500">
                    {challengerScore.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Friend&apos;s score</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats — hide score in Zen, hide time in Time's Up */}
        <div className={`grid gap-2 mb-5 ${timedOut || isZen ? "grid-cols-2" : "grid-cols-4"}`}>
          {timedOut ? (
            <>
              <div className="bg-red-50 rounded-xl px-2 py-2.5">
                <div className="text-base font-bold text-red-700 tabular-nums leading-tight">{pieceCount}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-medium uppercase tracking-wide">Pieces</div>
              </div>
              <div className="bg-slate-50 rounded-xl px-2 py-2.5">
                <div className="text-base font-bold text-slate-800 tabular-nums leading-tight">{moves}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-medium uppercase tracking-wide">Moves</div>
              </div>
            </>
          ) : isZen ? (
            <>
              <div className="bg-emerald-50 rounded-xl px-2 py-2.5">
                <div className="text-base font-bold text-emerald-700 tabular-nums leading-tight">{formatTime(timer)}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-medium uppercase tracking-wide">Time</div>
              </div>
              <div className="bg-slate-50 rounded-xl px-2 py-2.5">
                <div className="text-base font-bold text-slate-800 tabular-nums leading-tight">{moves}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-medium uppercase tracking-wide">Moves</div>
              </div>
            </>
          ) : (
            [
              { label: "Time", value: formatTime(timer) },
              { label: "Score", value: score.toLocaleString() },
              { label: "Pieces", value: pieceCount },
              { label: "Moves", value: moves },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 rounded-xl px-2 py-2.5">
                <div className="text-base font-bold text-slate-800 tabular-nums leading-tight">{value}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-medium uppercase tracking-wide">{label}</div>
              </div>
            ))
          )}
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

        {/* Challenge a Friend — only when the player genuinely completed the puzzle */}
        {!timedOut && !isZen && onChallengeShare && (
          <button
            onClick={onChallengeShare}
            className="w-full mb-2 py-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-bold rounded-xl hover:from-amber-500 hover:to-orange-500 transition-all min-h-[48px] text-sm shadow-sm flex items-center justify-center gap-2"
          >
            <span>🏆</span>
            <span>Challenge a Friend</span>
          </button>
        )}

        {/* Share buttons */}
        <div className="flex gap-2 mb-2">
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

        {/* Social share */}
        <div className="flex gap-2 justify-center pt-1 border-t border-slate-100">
          <span className="self-center text-[11px] text-slate-400 font-medium mr-1">Share on</span>
          {/* Pinterest */}
          <button
            onClick={handlePinterestShare}
            aria-label="Share on Pinterest"
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#E60023] hover:bg-[#c8001e] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
            </svg>
          </button>
          {/* Twitter / X */}
          <button
            onClick={handleTwitterShare}
            aria-label="Share on X / Twitter"
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-black hover:bg-slate-800 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </button>
          {/* Facebook */}
          <button
            onClick={handleFacebookShare}
            aria-label="Share on Facebook"
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
