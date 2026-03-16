"use client";

import { useEffect, useRef } from "react";
import {
  UserSettings,
  BackgroundTheme,
  SnapSensitivity,
  BACKGROUND_THEMES,
  SNAP_THRESHOLDS,
  saveSettings,
} from "@/lib/settings";

interface SettingsModalProps {
  settings: UserSettings;
  isMuted: boolean;
  onClose: () => void;
  onSettingsChange: (next: UserSettings) => void;
  onMuteToggle: () => void;
}

const BG_ORDER: BackgroundTheme[] = ["dark", "slate", "forest", "midnight", "warm"];
const SNAP_ORDER: SnapSensitivity[] = ["low", "medium", "high"];
const SNAP_DESC: Record<SnapSensitivity, string> = {
  low: "Precise placement needed",
  medium: "Balanced (default)",
  high: "Snaps from further away",
};

export default function SettingsModal({
  settings,
  isMuted,
  onClose,
  onSettingsChange,
  onMuteToggle,
}: SettingsModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  function updateAndSave(partial: Partial<UserSettings>) {
    const next: UserSettings = { ...settings, ...partial };
    saveSettings(next);
    onSettingsChange(next);
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className="relative bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-white"
        role="dialog"
        aria-modal="true"
        aria-label="Game settings"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">Settings</h2>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Background theme */}
        <section className="mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Background
          </p>
          <div className="flex items-center gap-3">
            {BG_ORDER.map((theme) => {
              const t = BACKGROUND_THEMES[theme];
              const active = settings.backgroundTheme === theme;
              return (
                <button
                  key={theme}
                  title={t.label}
                  aria-label={`${t.label} background`}
                  onClick={() => updateAndSave({ backgroundTheme: theme })}
                  className={`w-9 h-9 rounded-full border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    active ? "border-white scale-110" : "border-transparent hover:border-white/40"
                  }`}
                  style={{ background: t.board }}
                />
              );
            })}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {BACKGROUND_THEMES[settings.backgroundTheme].label}
          </p>
        </section>

        {/* Snap sensitivity */}
        <section className="mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Snap sensitivity
          </p>
          <div className="flex gap-2">
            {SNAP_ORDER.map((s) => {
              const active = settings.snapSensitivity === s;
              return (
                <button
                  key={s}
                  onClick={() => updateAndSave({ snapSensitivity: s })}
                  className={`flex-1 py-2 text-sm font-medium rounded-xl border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    active
                      ? "bg-white text-slate-900 border-transparent"
                      : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-slate-400 mt-2">{SNAP_DESC[settings.snapSensitivity]}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Threshold: {SNAP_THRESHOLDS[settings.snapSensitivity]}px
          </p>
        </section>

        {/* Sound */}
        <section>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Sound
          </p>
          <button
            onClick={() => {
              onMuteToggle();
              updateAndSave({ soundEnabled: isMuted });
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
              !isMuted
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                : "bg-white/5 border-white/10 text-slate-400"
            }`}
          >
            {!isMuted ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-3.536-9.536a5 5 0 000 7.072" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
            Sound {!isMuted ? "On" : "Off"}
          </button>
        </section>
      </div>
    </div>
  );
}
