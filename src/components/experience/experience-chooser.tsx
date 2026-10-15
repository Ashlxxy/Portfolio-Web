"use client";

import { ArrowRight, X } from "lucide-react";
import type { PortfolioMode } from "./experience-config";

const choices = {
  classic: {
    eyebrow: "Original portfolio",
    label: "Classic Mode",
    description: "A modern scrolling portfolio with interactive 3D details.",
  },
  persona: {
    eyebrow: "Alternate experience",
    label: "Persona Mode",
    description: "A bold game-menu experience built around the same work.",
  },
} satisfies Record<
  PortfolioMode,
  { eyebrow: string; label: string; description: string }
>;

type ExperienceChooserProps = {
  currentMode: PortfolioMode | null;
  onSelect: (mode: PortfolioMode) => void;
  onClose: () => void;
};

export default function ExperienceChooser({
  currentMode,
  onSelect,
  onClose,
}: ExperienceChooserProps) {
  return (
    <div
      className="fixed inset-0 z-[100000] overflow-y-auto bg-[#06080d] text-white"
      role="dialog"
      aria-modal="true"
      aria-label="Choose portfolio experience"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,.1),transparent_28%),radial-gradient(circle_at_82%_70%,rgba(8,169,230,.24),transparent_32%)]" />
      <div className="relative mx-auto flex min-h-full w-full max-w-7xl flex-col justify-center px-5 py-16 sm:px-8 lg:px-12">
        {currentMode && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 text-sm font-sans backdrop-blur-md transition hover:border-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:right-8 sm:top-8"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Cancel
          </button>
        )}

        <header className="mb-9 max-w-3xl">
          <p className="mb-3 font-sans text-xs uppercase tracking-[0.38em] text-cyan-300">
            Ade Rainhard Pasaribu
          </p>
          <h1 className="text-balance font-display text-4xl uppercase leading-[0.9] sm:text-6xl lg:text-7xl">
            Choose your experience
          </h1>
          <p className="mt-5 max-w-xl font-sans text-sm leading-relaxed text-white/65 sm:text-base">
            Same work, two different ways to explore it. Your selection will
            also start the soundtrack for that experience.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-2">
          {(Object.entries(choices) as Array<
            [PortfolioMode, (typeof choices)[PortfolioMode]]
          >).map(([mode, choice]) => (
            <button
              key={mode}
              type="button"
              onClick={() => onSelect(mode)}
              className={`group relative min-h-64 overflow-hidden border p-7 text-left transition duration-300 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white sm:p-9 ${
                mode === "classic"
                  ? "rounded-[2rem] border-white/15 bg-white/[0.06] shadow-[0_24px_80px_rgba(0,0,0,.42)] hover:-translate-y-1 hover:border-white/40"
                  : "border-cyan-300 bg-[#08a9e6] text-[#080b11] shadow-[12px_12px_0_#f4f1e9] [clip-path:polygon(0_7%,5%_0,100%_0,100%_88%,94%_100%,0_100%)] hover:-translate-y-1 hover:shadow-[16px_16px_0_#f4f1e9]"
              }`}
            >
              {mode === "persona" && (
                <span className="pointer-events-none absolute -right-16 -top-28 h-80 w-40 rotate-[24deg] bg-[#f4f1e9] opacity-90" />
              )}
              <span
                className={`relative font-sans text-xs font-bold uppercase tracking-[0.28em] ${
                  mode === "classic" ? "text-white/50" : "text-[#082f49]"
                }`}
              >
                {choice.eyebrow}
              </span>
              <span className="relative mt-12 block font-display text-4xl uppercase sm:text-5xl">
                {choice.label}
              </span>
              <span
                className={`relative mt-4 block max-w-md font-sans text-sm leading-relaxed sm:text-base ${
                  mode === "classic" ? "text-white/65" : "text-[#07131d]/75"
                }`}
              >
                {choice.description}
              </span>
              <span className="relative mt-8 flex items-center gap-3 font-sans text-xs font-bold uppercase tracking-[0.22em]">
                Enter mode
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
