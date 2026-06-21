"use client";

// components/night/SleepKathaCard.tsx — a bedtime story (nightKatha) with a
// real sleep timer that is ON BY DEFAULT (15 min). When the timer elapses the
// audio is paused, so a listener drifting off is not left with sound playing.
//
// We render our own controllable <audio> (rather than the shared AudioButton,
// which owns its element internally) so the timer can genuinely pause playback.
// The play/pause affordance mirrors AudioButton's look.
//
// TODO: replace with produced audio.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, Badge } from "@/components/ui";
import { t } from "@/lib/i18n";
import type { Lang, Localized, Story } from "@/lib/types";

interface SleepKathaCardProps {
  katha: Story;
  lang: Lang;
}

/** Sleep-timer choices, in minutes. 15 is the default (on by load). */
const TIMER_OPTIONS = [10, 15, 30, 45] as const;
const DEFAULT_MINUTES = 15;

const LABELS: Record<string, Localized> = {
  tag: { en: "Sleep katha", hi: "निद्रा कथा" },
  play: { en: "Play", hi: "सुनें" },
  pause: { en: "Pause", hi: "रोकें" },
  timer: { en: "Sleep timer", hi: "निद्रा टाइमर" },
  off: { en: "Off", hi: "बंद" },
  minutesShort: { en: "min", hi: "मिनट" },
  remaining: { en: "left", hi: "शेष" },
  willPause: {
    en: "The story will gently pause when the timer ends.",
    hi: "टाइमर समाप्त होने पर कथा धीरे से रुक जाएगी।",
  },
};

/** Format whole seconds as M:SS. */
function fmt(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function SleepKathaCard({ katha, lang }: SleepKathaCardProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  // Timer is on by default at 15 min. null => the user turned it off.
  const [timerMinutes, setTimerMinutes] = useState<number | null>(DEFAULT_MINUTES);
  // Seconds remaining while a timer is armed and audio is playing.
  const [remaining, setRemaining] = useState(DEFAULT_MINUTES * 60);

  // Keep play state in sync with the underlying element.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
    };
  }, []);

  const pauseAudio = useCallback(() => {
    const el = audioRef.current;
    if (el && !el.paused) el.pause();
  }, []);

  // The countdown: runs once per second only while audio is playing and a
  // timer is armed. On reaching zero it pauses the audio. setInterval is
  // cleaned up on every dependency change and on unmount.
  useEffect(() => {
    if (!playing || timerMinutes === null) return;
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          pauseAudio();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [playing, timerMinutes, pauseAudio]);

  // Pause anything still playing if the component unmounts.
  useEffect(() => {
    return () => {
      const el = audioRef.current;
      if (el && !el.paused) el.pause();
    };
  }, []);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      // If a timer is armed but already spent, refresh it for this listen.
      if (timerMinutes !== null && remaining <= 0) {
        setRemaining(timerMinutes * 60);
      }
      void el.play().catch(() => setPlaying(false));
    } else {
      el.pause();
    }
  }, [remaining, timerMinutes]);

  // Choosing a timer length (or Off) resets the remaining countdown.
  const chooseTimer = useCallback((minutes: number | null) => {
    setTimerMinutes(minutes);
    setRemaining(minutes === null ? 0 : minutes * 60);
  }, []);

  const showCountdown = timerMinutes !== null && playing && remaining > 0;

  const optionButtons = useMemo(
    () =>
      TIMER_OPTIONS.map((m) => ({
        minutes: m,
        active: timerMinutes === m,
      })),
    [timerMinutes],
  );

  return (
    <Card as="section" className="mb-5">
      <div className="mb-4 flex items-center justify-between">
        <Badge tone="muted">{t(LABELS.tag, lang)}</Badge>
      </div>

      <h2 className="font-serif text-xl leading-snug tracking-tight text-ink">
        {t(katha.title, lang)}
      </h2>

      <p className="mt-3 text-[15px] leading-relaxed text-ink/75">
        {t(katha.summary, lang)}
      </p>

      {/* Play / pause affordance (mirrors the shared AudioButton look). */}
      <div className="mt-6">
        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={
            playing ? t(LABELS.pause, lang) : t(LABELS.play, lang)
          }
          title="Placeholder audio — to be replaced with produced recording."
          className="inline-flex items-center gap-2.5 rounded-full border border-hairline bg-surface2 px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          <span
            aria-hidden="true"
            className="grid h-7 w-7 place-items-center rounded-full bg-[color:var(--accent)] text-white"
          >
            {playing ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.29-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
              </svg>
            )}
          </span>
          <span>{playing ? t(LABELS.pause, lang) : t(LABELS.play, lang)}</span>
        </button>
        {/* TODO: replace with produced audio. */}
        <audio ref={audioRef} src={katha.audio} preload="none" />
      </div>

      {/* Sleep timer — on by default, lower-contrast surface within the card. */}
      <div className="mt-5 rounded-2xl border border-hairline bg-surface2/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted">
            <svg
              aria-hidden="true"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="13" r="8" />
              <path d="M12 9v4l2 2" />
              <path d="M5 3 2 6" />
              <path d="m22 6-3-3" />
            </svg>
            <span className="font-medium text-ink/80">
              {t(LABELS.timer, lang)}
            </span>
          </div>
          <span
            className="font-serif text-base tabular-nums text-[color:var(--accent)]/90"
            aria-live="polite"
          >
            {showCountdown
              ? `${fmt(remaining)} ${t(LABELS.remaining, lang)}`
              : timerMinutes === null
                ? t(LABELS.off, lang)
                : `${timerMinutes} ${t(LABELS.minutesShort, lang)}`}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={t(LABELS.timer, lang)}>
          {optionButtons.map(({ minutes, active }) => (
            <button
              key={minutes}
              type="button"
              onClick={() => chooseTimer(minutes)}
              aria-pressed={active}
              className={[
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
                active
                  ? "border border-[color:var(--accent)]/40 bg-[color:var(--accent)]/15 text-[color:var(--accent)]"
                  : "border border-hairline bg-surface text-muted hover:text-ink",
              ].join(" ")}
            >
              {minutes} {t(LABELS.minutesShort, lang)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => chooseTimer(null)}
            aria-pressed={timerMinutes === null}
            className={[
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
              timerMinutes === null
                ? "border border-[color:var(--accent)]/40 bg-[color:var(--accent)]/15 text-[color:var(--accent)]"
                : "border border-hairline bg-surface text-muted hover:text-ink",
            ].join(" ")}
          >
            {t(LABELS.off, lang)}
          </button>
        </div>

        {timerMinutes !== null ? (
          <p className="mt-3 text-xs leading-relaxed text-faint">
            {t(LABELS.willPause, lang)}
          </p>
        ) : null}
      </div>
    </Card>
  );
}
