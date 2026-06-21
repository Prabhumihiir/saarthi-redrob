"use client";

// components/session/PlayingScreen.tsx — stage 2 of the session player.
// A full-screen, darkest-surface sit driven by a self-managed timer whose total
// duration is the CHOSEN length (config.minutes) — NOT the short placeholder
// audio length. The practice audio and the chosen background bed are looped
// underneath; both are placeholders.
//
// TODO: replace with produced audio + produced deity voice.

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { backgrounds } from "@/lib/content";
import { t } from "@/lib/i18n";
import type { Lang, ResolvedPractice } from "@/lib/types";
import {
  SESSION_COPY,
  SPEED_OPTIONS,
  SLEEP_OPTIONS,
  type SessionConfig,
  formatClock,
} from "./shared";

interface PlayingScreenProps {
  practice: ResolvedPractice;
  lang: Lang;
  config: SessionConfig;
  onComplete: () => void;
}

export function PlayingScreen({
  practice,
  lang,
  config,
  onComplete,
}: PlayingScreenProps) {
  const router = useRouter();
  const copy = SESSION_COPY.playing;

  const totalSeconds = config.minutes * 60;

  // --- Timer state (the source of truth for the session's progress) ---
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speedIdx, setSpeedIdx] = useState(1); // default 1x
  const [sleepIdx, setSleepIdx] = useState(0); // default Off
  const [bgOn, setBgOn] = useState(config.backgroundId !== "silence");
  const [showText, setShowText] = useState(false);

  const speed = SPEED_OPTIONS[speedIdx];
  const sleepMinutes = SLEEP_OPTIONS[sleepIdx];

  // The sleep cutoff, in elapsed-seconds. Recomputed whenever the user changes
  // the sleep option (relative to the current elapsed time).
  const sleepCutoffRef = useRef<number | null>(null);

  // --- Audio elements (looped beds; placeholders) ---
  const mainAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);

  const background = backgrounds.find((b) => b.id === config.backgroundId);
  const backgroundSrc = background?.audio ?? null;

  // The single interval timer. We tick by real seconds and scale by speed, so a
  // 1.25x sit finishes proportionally sooner. Cleaned up on unmount / pause.
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completedRef = useRef(false);

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  }, [onComplete]);

  // Drive the timer. Runs only while playing.
  useEffect(() => {
    if (!playing) return;
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + speed; // speed scales how fast time passes
        // Sleep timer: if a cutoff is set and we've passed it, stop playback.
        if (
          sleepCutoffRef.current !== null &&
          next >= sleepCutoffRef.current
        ) {
          setPlaying(false);
        }
        if (next >= totalSeconds) {
          // Reached the end of the chosen length — complete the session.
          finish();
          return totalSeconds;
        }
        return next;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [playing, speed, totalSeconds, finish]);

  // Keep the audio elements in step with play/pause + speed + background toggle.
  // Clean teardown of both audio elements happens on unmount.
  useEffect(() => {
    const main = mainAudioRef.current;
    const bg = bgAudioRef.current;
    if (main) main.playbackRate = speed;
    if (playing) {
      if (main) void main.play().catch(() => {});
      if (bg && bgOn) void bg.play().catch(() => {});
    } else {
      if (main) main.pause();
      if (bg) bg.pause();
    }
    if (bg && !bgOn) bg.pause();
  }, [playing, speed, bgOn]);

  // Final teardown — pause and detach so nothing keeps playing after leaving.
  useEffect(() => {
    return () => {
      const main = mainAudioRef.current;
      const bg = bgAudioRef.current;
      if (main) main.pause();
      if (bg) bg.pause();
    };
  }, []);

  // --- Control handlers ---
  const togglePlay = () => setPlaying((p) => !p);

  const cycleSpeed = () =>
    setSpeedIdx((i) => (i + 1) % SPEED_OPTIONS.length);

  const cycleSleep = () => {
    setSleepIdx((i) => {
      const next = (i + 1) % SLEEP_OPTIONS.length;
      const mins = SLEEP_OPTIONS[next];
      // Set the cutoff relative to the current elapsed point (read fresh).
      sleepCutoffRef.current =
        mins === null ? null : elapsed + mins * 60;
      return next;
    });
  };

  const toggleBg = () => setBgOn((b) => !b);

  // Scrubbing seeks the timer.
  const onScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value);
    setElapsed(next);
    if (next >= totalSeconds) finish();
  };

  const handleLeave = () => {
    // Stop everything before navigating away.
    setPlaying(false);
    router.push("/today");
  };

  const remaining = Math.max(0, totalSeconds - elapsed);
  const progressPct = totalSeconds > 0 ? (elapsed / totalSeconds) * 100 : 0;
  const hasTranscript = Boolean(practice.transcript);

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden">
      {/* Faint top-down accent gradient over the darkest surface. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[color:var(--accent)]/10 via-transparent to-transparent"
      />

      {/* Top bar: leave + intention. */}
      <div className="relative z-10 px-5 pt-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleLeave}
            className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
            aria-label={t(copy.leave, lang)}
          >
            <ChevronLeft />
            {t(copy.leave, lang)}
          </button>

          {hasTranscript ? (
            <button
              type="button"
              onClick={() => setShowText((s) => !s)}
              aria-pressed={showText}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-hairline bg-surface/70 px-3.5 text-sm text-muted transition-colors hover:border-[color:var(--accent)]/60 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
            >
              <BookIcon />
              {t(showText ? copy.hideText : copy.showText, lang)}
            </button>
          ) : (
            <span className="h-9" />
          )}
        </div>

        {config.intention ? (
          <div className="mt-4 text-center">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
              {t(copy.intentionLabel, lang)}
            </p>
            <p className="mt-1 font-serif text-lg leading-snug text-ink/90">
              {config.intention}
            </p>
          </div>
        ) : null}
      </div>

      {/* Center: breathing / flame visual, or the transcript when revealed. */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-6">
        {showText && practice.transcript ? (
          <Transcript practice={practice} lang={lang} />
        ) : (
          <BreathingFlame paused={!playing} deityName={t(practice.deityName, lang)} />
        )}
      </div>

      {/* Bottom: controls. */}
      <div className="relative z-10 px-5 pb-9">
        {/* Scrubber + clock. */}
        <div className="mb-5">
          <input
            type="range"
            min={0}
            max={totalSeconds}
            step={1}
            value={Math.min(elapsed, totalSeconds)}
            onChange={onScrub}
            aria-label={t(practice.title, lang)}
            className="session-scrub h-1.5 w-full cursor-pointer appearance-none rounded-full"
            style={
              {
                background: `linear-gradient(to right, var(--accent) ${progressPct}%, var(--hairline) ${progressPct}%)`,
              } as React.CSSProperties
            }
          />
          <div className="mt-2 flex items-center justify-between text-xs tabular-nums text-muted">
            <span>{formatClock(elapsed)}</span>
            <span>-{formatClock(remaining)}</span>
          </div>
        </div>

        {/* Play / pause — centered, prominent. */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={t(playing ? copy.pause : copy.play, lang)}
            className="grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full bg-[color:var(--accent)] text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.7)] transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>

        {/* Secondary controls row: speed · sleep · background. */}
        <div className="mt-6 flex items-stretch justify-center gap-2.5">
          <PillControl
            label={t(copy.speed, lang)}
            value={`${speed}x`}
            onClick={cycleSpeed}
          />
          <PillControl
            label={t(copy.sleepTimer, lang)}
            value={
              sleepMinutes === null
                ? t(copy.sleepOff, lang)
                : `${sleepMinutes} ${t(copy.minutesUnit, lang)}`
            }
            onClick={cycleSleep}
            active={sleepMinutes !== null}
          />
          {backgroundSrc ? (
            <PillControl
              label={t(copy.background, lang)}
              value={t(bgOn ? copy.backgroundOn : copy.backgroundOff, lang)}
              onClick={toggleBg}
              active={bgOn}
            />
          ) : null}
        </div>

        {/* Complete now. */}
        <div className="mt-6">
          <button
            type="button"
            onClick={finish}
            className="inline-flex h-11 w-full items-center justify-center rounded-full border border-hairline bg-surface/70 text-[15px] font-medium text-muted transition-colors hover:border-[color:var(--accent)]/60 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
          >
            {t(copy.complete, lang)}
          </button>
        </div>
      </div>

      {/* Looped audio beds (placeholders). The timer — not these — owns the
          session length, so both loop. */}
      {practice.audio ? (
        <audio
          ref={mainAudioRef}
          src={practice.audio}
          loop
          preload="auto"
          aria-hidden="true"
        />
      ) : null}
      {backgroundSrc ? (
        <audio
          ref={bgAudioRef}
          src={backgroundSrc}
          loop
          preload="auto"
          aria-hidden="true"
        />
      ) : null}

      {/* Local styles for the range thumb (kept scoped to this screen). */}
      <style>{`
        .session-scrub::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 9999px;
          background: var(--accent);
          border: 3px solid var(--bg);
          box-shadow: 0 2px 6px rgba(0,0,0,0.5);
          cursor: pointer;
        }
        .session-scrub::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 9999px;
          background: var(--accent);
          border: 3px solid var(--bg);
          box-shadow: 0 2px 6px rgba(0,0,0,0.5);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Breathing flame — a soft, slow pulse honouring reduced-motion (the
// .animate-breathe utility is disabled under prefers-reduced-motion).
// ---------------------------------------------------------------------------
function BreathingFlame({
  paused,
  deityName,
}: {
  paused: boolean;
  deityName: string;
}) {
  return (
    <div className="relative grid place-items-center">
      {/* Outer radial glow. */}
      <div
        aria-hidden="true"
        className="glow-accent absolute h-72 w-72 rounded-full"
      />
      {/* Breathing rings. */}
      <div
        aria-hidden="true"
        className={[
          "relative grid h-44 w-44 place-items-center rounded-full border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/5",
          paused ? "" : "animate-breathe",
        ].join(" ")}
      >
        <div className="grid h-28 w-28 place-items-center rounded-full border border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10">
          {/* The flame core — the deity's name in Devanagari, glowing. */}
          <span className="font-deva text-3xl text-[color:var(--accent)] drop-shadow-[0_0_18px_color-mix(in_srgb,var(--accent)_55%,transparent)]">
            {deityName}
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Transcript — Devanagari (gold/light), transliteration (italic muted), meaning.
// ---------------------------------------------------------------------------
function Transcript({
  practice,
  lang,
}: {
  practice: ResolvedPractice;
  lang: Lang;
}) {
  const tr = practice.transcript;
  if (!tr) return null;
  return (
    <div className="max-h-full w-full max-w-md overflow-y-auto px-1 text-center">
      <p className="devanagari font-deva text-[26px] leading-[1.85] text-gold">
        {tr.devanagari}
      </p>
      <p className="mt-5 text-[15px] italic leading-relaxed text-muted">
        {tr.transliteration}
      </p>
      <p className="mt-5 text-[15px] leading-relaxed text-ink/90">
        {t(tr.meaning, lang)}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A small labelled pill control (speed / sleep / background).
// ---------------------------------------------------------------------------
function PillControl({
  label,
  value,
  onClick,
  active,
}: {
  label: string;
  value: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex min-w-0 flex-1 flex-col items-center rounded-2xl border px-2 py-2.5 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]",
        active
          ? "border-[color:var(--accent)]/60 bg-[color:var(--accent)]/10"
          : "border-hairline bg-surface/70 hover:border-[color:var(--accent)]/40",
      ].join(" ")}
    >
      <span className="text-[10px] font-medium uppercase tracking-wide text-muted">
        {label}
      </span>
      <span
        className={[
          "mt-0.5 text-sm tabular-nums",
          active ? "text-[color:var(--accent)]" : "text-ink",
        ].join(" ")}
      >
        {value}
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Icons (drawn, no emoji).
// ---------------------------------------------------------------------------
function PlayIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.29-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v15H6.5A2.5 2.5 0 0 0 4 19.5z" />
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v5H6.5A2.5 2.5 0 0 1 4 19.5z" />
    </svg>
  );
}
