"use client";

interface AdSlotProps {
  format: "leaderboard" | "sidebar" | "rectangle" | "mobile-banner";
  className?: string;
}

const dimensions: Record<string, { width: number; height: number }> = {
  leaderboard: { width: 728, height: 90 },
  sidebar: { width: 300, height: 250 },
  rectangle: { width: 300, height: 600 },
  "mobile-banner": { width: 320, height: 100 },
};

export default function AdSlot({ format, className = "" }: AdSlotProps) {
  const dim = dimensions[format];
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  if (!adsenseId) {
    return (
      <div
        className={`flex items-center justify-center bg-stone-100 border border-dashed border-stone-300 rounded-lg text-stone-400 text-xs ${className}`}
        style={{
          width: dim.width,
          height: dim.height,
          maxWidth: "100%",
        }}
      >
        Ad Space ({dim.width}x{dim.height})
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        width: dim.width,
        height: dim.height,
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: dim.width, height: dim.height }}
        data-ad-client={adsenseId}
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
