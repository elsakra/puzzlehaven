export const GA_MEASUREMENT_ID = "G-PG49JWER6N";

// Extend window to include gtag
declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js" | "set",
      targetId: string | Date,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      params?: Record<string, any>
    ) => void;
    dataLayer: unknown[];
  }
}

type EventParams = Record<string, string | number | boolean | undefined>;

function fireEvent(action: string, params?: EventParams) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", action, params);
}

export const analytics = {
  /** Fired when a puzzle engine finishes initialising and play begins. */
  puzzleStart(puzzleId: string, pieceCount: number, category: string) {
    fireEvent("puzzle_start", {
      puzzle_id: puzzleId,
      piece_count: pieceCount,
      puzzle_category: category,
    });
  },

  /** Fired when the last piece snaps into place. */
  puzzleComplete(
    puzzleId: string,
    pieceCount: number,
    seconds: number,
    moves: number
  ) {
    fireEvent("puzzle_complete", {
      puzzle_id: puzzleId,
      piece_count: pieceCount,
      time_seconds: seconds,
      move_count: moves,
    });
  },

  /** Fired when the user changes the piece count selector. */
  pieceCountChange(puzzleId: string, fromCount: number, toCount: number) {
    fireEvent("piece_count_change", {
      puzzle_id: puzzleId,
      from_count: fromCount,
      to_count: toCount,
    });
  },

  /** Fired (in addition to puzzle_complete) specifically for the daily puzzle. */
  dailyCompleted(date: string, seconds: number, pieceCount: number) {
    fireEvent("daily_completed", {
      puzzle_date: date,
      time_seconds: seconds,
      piece_count: pieceCount,
    });
  },

  /** Fired when a user creates a custom puzzle from an uploaded photo. */
  customPuzzleCreated() {
    fireEvent("custom_puzzle_created");
  },

  /** Fired on beforeunload when a user leaves mid-puzzle without completing it. */
  puzzleAbandoned(puzzleId: string, snappedPieces: number, totalPieces: number) {
    fireEvent("puzzle_abandoned", {
      puzzle_id: puzzleId,
      snapped_pieces: snappedPieces,
      total_pieces: totalPieces,
    });
  },
};
