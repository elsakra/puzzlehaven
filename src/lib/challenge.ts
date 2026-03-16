export interface ChallengeData {
  /** Time in seconds */
  t: number;
  /** Piece count */
  p: number;
  /** Score */
  s: number;
  /** Stars (1-3) */
  x: number;
}

export function encodeChallenge(
  timeSeconds: number,
  pieceCount: number,
  score: number,
  stars: number
): string {
  const data: ChallengeData = { t: timeSeconds, p: pieceCount, s: score, x: stars };
  return btoa(JSON.stringify(data));
}

export function decodeChallenge(encoded: string): ChallengeData | null {
  try {
    const raw = JSON.parse(atob(encoded));
    if (
      typeof raw.t !== "number" ||
      typeof raw.p !== "number" ||
      typeof raw.s !== "number" ||
      typeof raw.x !== "number"
    ) {
      return null;
    }
    return raw as ChallengeData;
  } catch {
    return null;
  }
}
