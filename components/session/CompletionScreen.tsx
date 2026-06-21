"use client";

// components/session/CompletionScreen.tsx — stage 3 of the session player.
// On mount it marks today's practice done (once), shows a warm closing line,
// animates the streak with a gold flourish, surfaces any new milestone, invites
// a one-line reflection, and offers the way back to Today.

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSaarthi } from "@/lib/state";
import { t } from "@/lib/i18n";
import type { Lang, ResolvedPractice } from "@/lib/types";
import {
  SESSION_COPY,
  MILESTONE_LINES,
  type SessionConfig,
} from "./shared";

interface CompletionScreenProps {
  practice: ResolvedPractice;
  lang: Lang;
  config: SessionConfig;
}

export function CompletionScreen({
  practice,
  lang,
}: CompletionScreenProps) {
  const router = useRouter();
  const { markPracticeDone, addReflection } = useSaarthi();
  const copy = SESSION_COPY.completion;

  // Mark done exactly once, on mount. We capture the result (streak / milestone)
  // synchronously and animate from it. A ref guards against double-invocation
  // (e.g. React 18 strict-mode dev double effects).
  const ranRef = useRef(false);
  const [result, setResult] = useState<{
    alreadyDone: boolean;
    streak: number;
    newMilestone: number | null;
  } | null>(null);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;
    setResult(markPracticeDone());
  }, [markPracticeDone]);

  // A stable closing line for this completion (rotates across sessions).
  const closing = useMemo(() => {
    const lines = SESSION_COPY.completion.closing;
    return lines[Math.floor(Math.random() * lines.length)];
  }, []);

  // Animate the streak number: count up to the final value with a gold flourish.
  const finalStreak = result?.streak ?? 0;
  const [displayStreak, setDisplayStreak] = useState(0);
  const [flourish, setFlourish] = useState(false);

  useEffect(() => {
    if (result === null) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || finalStreak <= 0) {
      // No motion: show the final value at once.
      setDisplayStreak(finalStreak);
      setFlourish(true);
      return;
    }

    // Count up over ~900ms, then trigger the gold flourish pulse.
    const start = Math.max(0, finalStreak - 1);
    setDisplayStreak(start);
    let current = start;
    const stepMs = finalStreak - start > 0 ? 220 : 0;
    const id = setInterval(() => {
      current += 1;
      setDisplayStreak(current);
      if (current >= finalStreak) {
        clearInterval(id);
        setFlourish(true);
      }
    }, stepMs || 1000);
    // Ensure the flourish fires even if there was nothing to count.
    const t0 = setTimeout(() => setFlourish(true), 950);
    return () => {
      clearInterval(id);
      clearTimeout(t0);
    };
  }, [result, finalStreak]);

  // Reflection input.
  const [reflection, setReflection] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSaveReflection = () => {
    const trimmed = reflection.trim();
    if (trimmed === "") return;
    // Tag the reflection with the practice title in English (the canonical form).
    addReflection(trimmed, practice.title.en);
    setSaved(true);
  };

  const milestoneLine =
    result?.newMilestone != null ? MILESTONE_LINES[result.newMilestone] : null;

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col items-center px-6 pb-12 pt-16 text-center">
      {/* Gold flourish behind the streak. */}
      <div className="relative">
        <div
          aria-hidden="true"
          className={[
            "glow-saffron pointer-events-none absolute inset-0 -m-16 transition-opacity duration-700",
            flourish ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />
        <FlourishMark active={flourish} />
      </div>

      {/* Closing line. */}
      <p className="mt-8 max-w-sm font-serif text-2xl leading-snug tracking-tight text-ink">
        {t(closing, lang)}
      </p>

      {/* Streak count-up with a gold flourish. */}
      <div className="mt-8 flex flex-col items-center">
        <span
          className={[
            "font-serif text-6xl font-medium tabular-nums text-gold transition-transform duration-500",
            flourish ? "scale-100" : "scale-95",
          ].join(" ")}
          style={{
            textShadow: flourish
              ? "0 0 28px rgba(217,164,65,0.45)"
              : "none",
          }}
        >
          {displayStreak}
        </span>
        <span className="mt-1 text-sm text-muted">
          {t(copy.dayStreak, lang)}
        </span>
        {result?.alreadyDone ? (
          <span className="mt-2 text-[13px] text-faint">
            {t(copy.alreadyToday, lang)}
          </span>
        ) : null}
      </div>

      {/* Milestone line, if one was earned. */}
      {milestoneLine ? (
        <div className="mt-7 rounded-2xl border border-gold/30 bg-goldsoft px-5 py-4">
          <p className="text-[15px] font-medium leading-relaxed text-gold">
            {t(milestoneLine, lang)}
          </p>
        </div>
      ) : null}

      {/* Reflection. */}
      <div className="mt-10 w-full text-left">
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted">
          {t(copy.reflectHeading, lang)}
        </h2>
        <p className="mt-1.5 text-[15px] leading-relaxed text-ink/90">
          {t(copy.reflectPrompt, lang)}
        </p>

        {saved ? (
          <div className="mt-3 flex items-center gap-2 rounded-2xl border border-gold/30 bg-gold/8 px-4 py-3.5 text-[15px] font-medium text-gold">
            <CheckMark />
            {t(copy.reflectSaved, lang)}
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-2.5">
            <input
              type="text"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveReflection();
              }}
              placeholder={t(copy.reflectPrompt, lang)}
              maxLength={240}
              className="w-full rounded-2xl border border-hairline bg-surface px-4 py-3.5 text-[15px] text-ink placeholder:text-faint transition-colors focus:border-[color:var(--accent)] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSaveReflection}
              disabled={reflection.trim() === ""}
              className="inline-flex h-11 items-center justify-center rounded-full border border-hairline bg-surface2 px-5 text-[15px] font-medium text-ink transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
            >
              {t(copy.reflectSave, lang)}
            </button>
          </div>
        )}
      </div>

      {/* Return to Today. */}
      <div className="mt-auto w-full pt-10">
        <button
          type="button"
          onClick={() => router.push("/today")}
          className="inline-flex h-13 w-full items-center justify-center rounded-full bg-saffron px-6 py-3.5 text-base font-medium text-white shadow-[0_10px_28px_-12px_rgba(232,132,60,0.6)] transition-colors hover:bg-saffrondeep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          {t(copy.returnToday, lang)}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A gold lotus / flourish mark that settles in when the session is complete.
// Reduced-motion safe (the scale transition is short; the spin is omitted).
// ---------------------------------------------------------------------------
function FlourishMark({ active }: { active: boolean }) {
  return (
    <div
      className={[
        "relative grid h-20 w-20 place-items-center rounded-full border border-gold/40 bg-goldsoft transition-all duration-700",
        active ? "scale-100 opacity-100" : "scale-90 opacity-70",
      ].join(" ")}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gold"
        aria-hidden="true"
      >
        {/* A simple lotus glyph. */}
        <path d="M12 21c-4 0-7-2.2-7-5 1.8.3 3 .9 4 1.7C10.2 14.5 11 12 12 10c1 2 1.8 4.5 3 7.7 1-.8 2.2-1.4 4-1.7 0 2.8-3 5-7 5Z" />
        <path d="M12 10c-1.5-2-1.5-5 0-7 1.5 2 1.5 5 0 7Z" />
        <path d="M12 10C9.5 9 8 6.5 8 4c2.2.6 3.6 2.4 4 6Z" />
        <path d="M12 10c2.5-1 4-3.5 4-6-2.2.6-3.6 2.4-4 6Z" />
      </svg>
    </div>
  );
}

function CheckMark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}
