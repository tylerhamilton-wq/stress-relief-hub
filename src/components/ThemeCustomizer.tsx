import { useState, useEffect } from "react";
import { Palette, X, Check } from "lucide-react";

interface ThemePreset {
  name: string;
  emoji: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    border: string;
    input: string;
    ring: string;
  };
}

const THEME_PRESETS: ThemePreset[] = [
  {
    name: "Sage Garden",
    emoji: "🌿",
    colors: {
      background: "80 25% 96%",
      foreground: "160 20% 15%",
      card: "80 20% 99%",
      cardForeground: "160 20% 15%",
      primary: "152 35% 45%",
      primaryForeground: "80 25% 98%",
      secondary: "40 30% 92%",
      secondaryForeground: "160 20% 20%",
      muted: "80 15% 92%",
      mutedForeground: "160 10% 45%",
      accent: "28 60% 65%",
      accentForeground: "28 60% 15%",
      border: "80 15% 88%",
      input: "80 15% 88%",
      ring: "152 35% 45%",
    },
  },
  {
    name: "Ocean Calm",
    emoji: "🌊",
    colors: {
      background: "210 30% 96%",
      foreground: "220 25% 15%",
      card: "210 25% 99%",
      cardForeground: "220 25% 15%",
      primary: "205 60% 45%",
      primaryForeground: "210 30% 98%",
      secondary: "200 25% 91%",
      secondaryForeground: "220 25% 20%",
      muted: "210 18% 92%",
      mutedForeground: "220 12% 45%",
      accent: "175 50% 45%",
      accentForeground: "175 50% 10%",
      border: "210 18% 87%",
      input: "210 18% 87%",
      ring: "205 60% 45%",
    },
  },
  {
    name: "Sunset Warmth",
    emoji: "🌅",
    colors: {
      background: "30 35% 96%",
      foreground: "20 25% 15%",
      card: "35 30% 99%",
      cardForeground: "20 25% 15%",
      primary: "15 70% 55%",
      primaryForeground: "30 35% 98%",
      secondary: "35 40% 91%",
      secondaryForeground: "20 25% 20%",
      muted: "30 20% 92%",
      mutedForeground: "20 12% 45%",
      accent: "45 65% 55%",
      accentForeground: "45 65% 12%",
      border: "30 20% 87%",
      input: "30 20% 87%",
      ring: "15 70% 55%",
    },
  },
  {
    name: "Lavender Dream",
    emoji: "💜",
    colors: {
      background: "270 25% 96%",
      foreground: "280 20% 15%",
      card: "270 22% 99%",
      cardForeground: "280 20% 15%",
      primary: "265 45% 55%",
      primaryForeground: "270 25% 98%",
      secondary: "280 25% 92%",
      secondaryForeground: "280 20% 20%",
      muted: "270 15% 92%",
      mutedForeground: "280 10% 48%",
      accent: "320 45% 60%",
      accentForeground: "320 45% 12%",
      border: "270 15% 88%",
      input: "270 15% 88%",
      ring: "265 45% 55%",
    },
  },
  {
    name: "Cherry Blossom",
    emoji: "🌸",
    colors: {
      background: "340 30% 96%",
      foreground: "340 20% 15%",
      card: "340 25% 99%",
      cardForeground: "340 20% 15%",
      primary: "345 55% 58%",
      primaryForeground: "340 30% 98%",
      secondary: "340 30% 92%",
      secondaryForeground: "340 20% 20%",
      muted: "340 18% 92%",
      mutedForeground: "340 12% 48%",
      accent: "20 55% 58%",
      accentForeground: "20 55% 12%",
      border: "340 18% 88%",
      input: "340 18% 88%",
      ring: "345 55% 58%",
    },
  },
  {
    name: "Midnight Focus",
    emoji: "🌙",
    colors: {
      background: "230 20% 14%",
      foreground: "220 15% 88%",
      card: "230 18% 18%",
      cardForeground: "220 15% 88%",
      primary: "215 60% 55%",
      primaryForeground: "230 20% 10%",
      secondary: "230 15% 22%",
      secondaryForeground: "220 15% 85%",
      muted: "230 14% 22%",
      mutedForeground: "220 10% 55%",
      accent: "45 70% 55%",
      accentForeground: "45 70% 10%",
      border: "230 14% 24%",
      input: "230 14% 24%",
      ring: "215 60% 55%",
    },
  },
];

const STORAGE_KEY = "studentzen-theme";

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || "Sage Garden";
  });

  useEffect(() => {
    const preset = THEME_PRESETS.find((t) => t.name === currentTheme);
    if (!preset) return;
    const root = document.documentElement;
    const c = preset.colors;
    root.style.setProperty("--background", c.background);
    root.style.setProperty("--foreground", c.foreground);
    root.style.setProperty("--card", c.card);
    root.style.setProperty("--card-foreground", c.cardForeground);
    root.style.setProperty("--popover", c.card);
    root.style.setProperty("--popover-foreground", c.cardForeground);
    root.style.setProperty("--primary", c.primary);
    root.style.setProperty("--primary-foreground", c.primaryForeground);
    root.style.setProperty("--secondary", c.secondary);
    root.style.setProperty("--secondary-foreground", c.secondaryForeground);
    root.style.setProperty("--muted", c.muted);
    root.style.setProperty("--muted-foreground", c.mutedForeground);
    root.style.setProperty("--accent", c.accent);
    root.style.setProperty("--accent-foreground", c.accentForeground);
    root.style.setProperty("--border", c.border);
    root.style.setProperty("--input", c.input);
    root.style.setProperty("--ring", c.ring);
    root.style.setProperty("--sidebar-background", c.background);
    root.style.setProperty("--sidebar-foreground", c.foreground);
    root.style.setProperty("--sidebar-primary", c.primary);
    root.style.setProperty("--sidebar-primary-foreground", c.primaryForeground);
    root.style.setProperty("--sidebar-accent", c.muted);
    root.style.setProperty("--sidebar-accent-foreground", c.secondaryForeground);
    root.style.setProperty("--sidebar-border", c.border);
    root.style.setProperty("--sidebar-ring", c.ring);
    localStorage.setItem(STORAGE_KEY, currentTheme);
  }, [currentTheme]);

  return { currentTheme, setCurrentTheme };
};

interface Props {
  open: boolean;
  onClose: () => void;
  currentTheme: string;
  setCurrentTheme: (name: string) => void;
}

const ThemeCustomizer = ({ open, onClose, currentTheme, setCurrentTheme }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-sm rounded-2xl border bg-card p-5 shadow-lg animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Theme</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {THEME_PRESETS.map((preset) => {
            const isActive = currentTheme === preset.name;
            // Parse primary HSL for swatch
            const primaryHSL = `hsl(${preset.colors.primary})`;
            const accentHSL = `hsl(${preset.colors.accent})`;
            const bgHSL = `hsl(${preset.colors.background})`;
            const fgHSL = `hsl(${preset.colors.foreground})`;

            return (
              <button
                key={preset.name}
                onClick={() => setCurrentTheme(preset.name)}
                className={`relative flex flex-col items-start gap-2 rounded-xl border-2 p-3 text-left transition-all ${
                  isActive
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-transparent bg-muted/40 hover:border-muted-foreground/20"
                }`}
              >
                {isActive && (
                  <div className="absolute right-2 top-2">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div className="flex gap-1.5">
                  <div className="h-6 w-6 rounded-full border" style={{ background: primaryHSL }} />
                  <div className="h-6 w-6 rounded-full border" style={{ background: accentHSL }} />
                  <div className="h-6 w-6 rounded-full border" style={{ background: bgHSL }} />
                  <div className="h-6 w-6 rounded-full border" style={{ background: fgHSL }} />
                </div>
                <span className="text-sm font-medium" style={{ color: fgHSL }}>
                  {preset.emoji} {preset.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
