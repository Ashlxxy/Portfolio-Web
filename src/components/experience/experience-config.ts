export const PORTFOLIO_MODES = ["classic", "persona"] as const;

export type PortfolioMode = (typeof PORTFOLIO_MODES)[number];

export const STORAGE_KEY = "ade-portfolio-mode";

export const MODE_TRACKS: Record<PortfolioMode, string> = {
  classic: "/assets/sounds/classic-background.mp3",
  persona: "/assets/sounds/persona-background.mp3",
};

export function isPortfolioMode(value: unknown): value is PortfolioMode {
  return PORTFOLIO_MODES.includes(value as PortfolioMode);
}

export function otherPortfolioMode(mode: PortfolioMode): PortfolioMode {
  return mode === "classic" ? "persona" : "classic";
}

export type ModeTransitionTiming = {
  switchDelay: number;
  finishDelay: number;
};

const PERSONA_ENTRY_TIMING: Record<"default" | "reduced", ModeTransitionTiming> = {
  default: { switchDelay: 330, finishDelay: 680 },
  reduced: { switchDelay: 0, finishDelay: 160 },
};

export function getModeTransitionTiming(
  mode: PortfolioMode,
  reducedMotion: boolean,
): ModeTransitionTiming | null {
  if (mode !== "persona") return null;
  return PERSONA_ENTRY_TIMING[reducedMotion ? "reduced" : "default"];
}
