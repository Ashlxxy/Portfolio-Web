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
