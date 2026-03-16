const SETTINGS_KEY = "puzzle_settings";

export type SnapSensitivity = "low" | "medium" | "high";
export type BackgroundTheme = "dark" | "slate" | "forest" | "midnight" | "warm";

export interface UserSettings {
  snapSensitivity: SnapSensitivity;
  backgroundTheme: BackgroundTheme;
  soundEnabled: boolean;
}

export const SNAP_THRESHOLDS: Record<SnapSensitivity, number> = {
  low: 8,
  medium: 15,
  high: 25,
};

export const BACKGROUND_THEMES: Record<
  BackgroundTheme,
  { label: string; bg: string; board: string; dot: string }
> = {
  dark: {
    label: "Dark",
    bg: "#1a2232",
    board: "#243044",
    dot: "rgba(255,255,255,0.04)",
  },
  slate: {
    label: "Slate",
    bg: "#1e2535",
    board: "#2a3348",
    dot: "rgba(148,163,184,0.06)",
  },
  forest: {
    label: "Forest",
    bg: "#132217",
    board: "#1d3326",
    dot: "rgba(134,239,172,0.05)",
  },
  midnight: {
    label: "Midnight",
    bg: "#0d0d18",
    board: "#141422",
    dot: "rgba(167,139,250,0.05)",
  },
  warm: {
    label: "Warm",
    bg: "#241a10",
    board: "#352511",
    dot: "rgba(251,191,36,0.05)",
  },
};

export const DEFAULT_SETTINGS: UserSettings = {
  snapSensitivity: "medium",
  backgroundTheme: "dark",
  soundEnabled: true,
};

export function getSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<UserSettings>;
      return {
        snapSensitivity: parsed.snapSensitivity ?? DEFAULT_SETTINGS.snapSensitivity,
        backgroundTheme: parsed.backgroundTheme ?? DEFAULT_SETTINGS.backgroundTheme,
        soundEnabled: parsed.soundEnabled ?? DEFAULT_SETTINGS.soundEnabled,
      };
    }
  } catch {}
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}
