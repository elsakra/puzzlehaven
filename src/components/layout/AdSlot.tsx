"use client";

interface AdSlotProps {
  format: "leaderboard" | "sidebar" | "rectangle" | "mobile-banner";
  /** AdSense ad unit slot ID (10-digit number from AdSense dashboard).
   *  Leave undefined until you have created the ad unit — the component
   *  shows a labelled placeholder until a valid slotId is provided. */
  slotId?: string;
  className?: string;
}

const dimensions: Record<string, { width: number; height: number }> = {
  leaderboard: { width: 728, height: 90 },
  sidebar: { width: 300, height: 250 },
  rectangle: { width: 300, height: 600 },
  "mobile-banner": { width: 320, height: 100 },
};

export default function AdSlot({ format, slotId, className = "" }: AdSlotProps) {
  const dim = dimensions[format];
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  // No publisher ID configured at all — dev/preview placeholder
  if (!adsenseId) {
    return (
      <div
        className={`flex items-center justify-center bg-stone-100 border border-dashed border-stone-300 rounded text-stone-400 text-xs ${className}`}
        style={{ width: dim.width, height: dim.height, maxWidth: "100%" }}
      >
        Ad ({dim.width}×{dim.height})
      </div>
    );
  }

  // Publisher ID present but no slot ID yet — show subtle reserved space.
  // Google Auto Ads (enabled in AdSense dashboard) will fill this area automatically.
  if (!slotId) {
    return (
      <div
        className={`flex items-center justify-center bg-stone-50 border border-dashed border-stone-200 rounded text-stone-300 text-xs ${className}`}
        style={{ width: dim.width, height: dim.height, maxWidth: "100%" }}
        aria-hidden="true"
      />
    );
  }

  // Full manual ad unit — renders once slotId is provided
  return (
    <div
      className={className}
      style={{ width: dim.width, height: dim.height, maxWidth: "100%", overflow: "hidden" }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: dim.width, height: dim.height }}
        data-ad-client={adsenseId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <script
        dangerouslySetInnerHTML={{ __html: "(adsbygoogle = window.adsbygoogle || []).push({});" }}
      />
    </div>
  );
}
