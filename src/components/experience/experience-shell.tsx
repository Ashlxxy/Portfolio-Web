"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AudioLines, RefreshCw, Volume2, VolumeX } from "lucide-react";
import { useReducedMotion } from "motion/react";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import AppOverlays from "@/components/app-overlays";
import PersonaPortfolio from "@/components/persona/persona-portfolio";
import ExperienceChooser from "./experience-chooser";
import transitionStyles from "./persona-entry-transition.module.css";
import {
  MODE_TRACKS,
  STORAGE_KEY,
  getModeTransitionTiming,
  isPortfolioMode,
  type PortfolioMode,
} from "./experience-config";

export default function ExperienceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mode, setMode] = useState<PortfolioMode | null>(null);
  const [ready, setReady] = useState(false);
  const [chooserOpen, setChooserOpen] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioUnavailable, setAudioUnavailable] = useState(false);
  const [personaEntryActive, setPersonaEntryActive] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement>(null);
  const transitionTimers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    if (!isHome) return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const storedMode = isPortfolioMode(stored) ? stored : null;
    setMode(storedMode);
    setChooserOpen(!storedMode);
    setReady(true);

    if (storedMode && audioRef.current) {
      audioRef.current.src = MODE_TRACKS[storedMode];
      audioRef.current.load();
    }
  }, [isHome]);

  useEffect(() => () => {
    transitionTimers.current.forEach(clearTimeout);
  }, []);

  const classic = (
    <>
      <Header />
      {children}
      <Footer />
      <AppOverlays />
    </>
  );

  if (!isHome) return classic;

  function applyMode(nextMode: PortfolioMode) {
    window.localStorage.setItem(STORAGE_KEY, nextMode);
    setMode(nextMode);
    setChooserOpen(false);
  }

  function startAudio(nextMode: PortfolioMode) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.src = MODE_TRACKS[nextMode];
    audio.currentTime = 0;
    audio.volume = 0.24;
    audio.loop = true;
    setAudioUnavailable(false);
    void audio
      .play()
      .then(() => setAudioPlaying(true))
      .catch(() => setAudioPlaying(false));
  }

  function selectMode(nextMode: PortfolioMode) {
    if (personaEntryActive) return;
    startAudio(nextMode);

    const timing = getModeTransitionTiming(nextMode, shouldReduceMotion === true);
    if (!timing) {
      applyMode(nextMode);
      return;
    }

    setPersonaEntryActive(true);
    transitionTimers.current.push(
      setTimeout(() => applyMode(nextMode), timing.switchDelay),
      setTimeout(() => setPersonaEntryActive(false), timing.finishDelay),
    );
  }

  function toggleAudio() {
    const audio = audioRef.current;
    if (!audio || !mode) return;
    if (audioPlaying) {
      audio.pause();
      setAudioPlaying(false);
      return;
    }
    if (!audio.src) audio.src = MODE_TRACKS[mode];
    setAudioUnavailable(false);
    void audio
      .play()
      .then(() => setAudioPlaying(true))
      .catch(() => setAudioPlaying(false));
  }

  if (!ready) {
    return <div className="min-h-screen bg-[#06080d]" aria-hidden="true" />;
  }

  return (
    <>
      {mode === "persona" ? <PersonaPortfolio /> : mode === "classic" ? classic : null}

      {chooserOpen && (
        <ExperienceChooser
          currentMode={mode}
          onSelect={selectMode}
          onClose={() => setChooserOpen(false)}
        />
      )}

      {mode && !chooserOpen && (
        <div className="fixed bottom-4 right-4 z-[99999] flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full border border-white/15 bg-[#06080d]/90 p-2 font-sans text-white shadow-2xl backdrop-blur-xl sm:bottom-6 sm:right-6">
          <button
            type="button"
            onClick={() => setChooserOpen(true)}
            aria-label="Switch Experience"
            className="flex min-h-10 items-center gap-2 rounded-full px-3 text-xs font-semibold uppercase tracking-[0.12em] transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Switch Experience</span>
            <span className="sm:hidden">Switch</span>
          </button>
          <span className="h-6 w-px bg-white/15" aria-hidden="true" />
          <button
            type="button"
            onClick={toggleAudio}
            disabled={audioUnavailable}
            aria-pressed={audioPlaying}
            aria-label={
              audioUnavailable
                ? "Music unavailable"
                : audioPlaying
                  ? "Pause Music"
                  : "Play Music"
            }
            className="flex min-h-10 items-center gap-2 rounded-full px-3 text-xs font-semibold uppercase tracking-[0.12em] transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {audioUnavailable ? (
              <AudioLines className="h-4 w-4" aria-hidden="true" />
            ) : audioPlaying ? (
              <Volume2 className="h-4 w-4" aria-hidden="true" />
            ) : (
              <VolumeX className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">
              {audioUnavailable
                ? "Music unavailable"
                : audioPlaying
                  ? "Pause Music"
                  : "Play Music"}
            </span>
          </button>
        </div>
      )}

      {personaEntryActive && (
        <div className={transitionStyles.overlay} aria-hidden="true">
          <span className={`${transitionStyles.layer} ${transitionStyles.paper}`} />
          <span className={`${transitionStyles.layer} ${transitionStyles.ink}`} />
          <span className={`${transitionStyles.layer} ${transitionStyles.blue}`} />
        </div>
      )}

      <audio
        ref={audioRef}
        preload="metadata"
        onPlay={() => setAudioPlaying(true)}
        onPause={() => setAudioPlaying(false)}
        onError={() => {
          setAudioPlaying(false);
          setAudioUnavailable(true);
        }}
      />
      <p className="sr-only" aria-live="polite">
        {audioUnavailable
          ? "Background music is unavailable."
          : audioPlaying
            ? `${mode} background music is playing.`
            : "Background music is paused."}
      </p>
    </>
  );
}
