export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function getStars(seconds: number, pieceCount: number): number {
  const baseTime = pieceCount * 3;
  if (seconds <= baseTime * 0.5) return 3;
  if (seconds <= baseTime) return 2;
  return 1;
}

export function buildShareText(params: {
  title: string;
  time: number;
  pieces: number;
  isDaily?: boolean;
  url?: string;
}): string {
  const { title, time, pieces, isDaily, url } = params;
  const stars = getStars(time, pieces);
  const starStr = "\u2B50".repeat(stars);

  const lines = [];
  if (isDaily) {
    const today = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
    lines.push(`\uD83E\uDDE9 Daily Puzzle \u2014 ${today}`);
  } else {
    lines.push(`\uD83E\uDDE9 ${title}`);
  }
  lines.push(`\u23F1\uFE0F ${formatTime(time)} | \uD83E\uDDE9 ${pieces} pieces | ${starStr}`);
  lines.push("Can you beat my time?");
  if (url) lines.push(url);

  return lines.join("\n");
}
