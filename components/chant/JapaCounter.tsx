"use client";

// components/chant/JapaCounter.tsx
// A 108-bead japa counter for the Chant screen.
//   - A big central count sits inside a circular progress ring.
//   - A large, accessible tap target (a real <button>) increments the count.
//   - Progress toward 108 is shown as the ring fill and a "of 108" line.
//   - At 108 the round completes with a tasteful, gold celebration.
//   - A reset returns to zero.
//   - Each tap gives subtle haptic feedback where supported (navigator.vibrate),
//     guarded for SSR + unsupported devices, and respects reduced-motion.
//
// The visual language matches the Today screen: dark surfaces, hairline borders,
// the chosen deity's --accent for the active ring, gold for completion.

import { useCallback, useEffect, useRef, useState } from "react";
import type { Lang, Localized } from "@/lib/types";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui";

const MALA = 108;

interface JapaCounterProps {
  lang: Lang;
  /** The name / mantra being repeated, shown gently above the counter. */
  name?: Localized;
}

const copy: Record<string, Localized> = {
  tapToCount: { en: "Tap to count", hi: "गिनने के लिए स्पर्श करें" },
  ofMala: { en: "of 108", hi: "१०८ में से" },
  reset: { en: "Reset", hi: "पुनः आरंभ" },
  malaComplete: { en: "One mala complete", hi: "एक माला पूर्ण" },
  malaCompleteBody: {
    en: "One hundred and eight, offered. Rest a moment in the quiet, or begin another round.",
    hi: "एक सौ आठ, अर्पित। एक क्षण मौन में विश्राम करें, या एक और दौर आरंभ करें।",
  },
  beginAgain: { en: "Begin again", hi: "फिर से आरंभ करें" },
  countLabel: { en: "Increment japa count", hi: "जप गणना बढ़ाएँ" },
  repeating: { en: "Repeating", hi: "जप" },
};

/** Whether the user has asked the system to reduce motion. */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Subtle haptic tick where supported; silent everywhere else. */
function vibrate(pattern: number | number[]): void {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  if (prefersReducedMotion()) return;
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // Some browsers throw on certain patterns; never let it surface.
  }
}

export function JapaCounter({ lang, name }: JapaCounterProps) {
  const [count, setCount] = useState(0);
  // Brief pulse on the count when it ticks, for a quiet sense of touch.
  const [pulse, setPulse] = useState(false);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const complete = count >= MALA;
  const progress = Math.min(count / MALA, 1);

  useEffect(() => {
    return () => {
      if (pulseTimer.current) clearTimeout(pulseTimer.current);
    };
  }, []);

  const increment = useCallback(() => {
    setCount((c) => Math.min(c + 1, MALA));
    vibrate(10);
    setPulse(true);
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
    pulseTimer.current = setTimeout(() => setPulse(false), 160);
  }, []);

  const reset = useCallback(() => {
    setCount(0);
    setPulse(false);
    vibrate([12, 40, 12]);
  }, []);

  // Geometry for the circular progress ring (viewBox 0 0 200 200).
  const RADIUS = 88;
  const CIRC = 2 * Math.PI * RADIUS;

  return (
    <div className="flex flex-col items-center gap-7">
      {/* The name being repeated — quiet, above the counter. */}
      {name ? (
        <div className="text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-faint">
            {t(copy.repeating, lang)}
          </p>
          <p className="mt-1.5 font-serif text-lg leading-tight text-ink">
            {t(name, lang)}
          </p>
        </div>
      ) : null}

      {/* The tap target: a real button wrapping the ring + count. */}
      <div className="relative">
        {/* Faint accent glow behind the dial. */}
        <div
          aria-hidden="true"
          className="glow-accent pointer-events-none absolute -inset-6 rounded-full"
        />
        <button
          type="button"
          onClick={increment}
          disabled={complete}
          aria-label={t(copy.countLabel, lang)}
          className={[
            "group relative grid h-64 w-64 place-items-center rounded-full",
            "border border-hairline bg-surface",
            "shadow-[0_1px_2px_rgba(0,0,0,0.35),0_24px_60px_-28px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(244,236,221,0.05)]",
            "transition-transform duration-150 active:scale-[0.97]",
            "disabled:cursor-default disabled:active:scale-100",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          ].join(" ")}
        >
          {/* Progress ring. */}
          <svg
            className="absolute inset-0 h-full w-full -rotate-90"
            viewBox="0 0 200 200"
            aria-hidden="true"
          >
            <circle
              cx="100"
              cy="100"
              r={RADIUS}
              fill="none"
              stroke="var(--hairline)"
              strokeWidth="5"
            />
            <circle
              cx="100"
              cy="100"
              r={RADIUS}
              fill="none"
              stroke={complete ? "var(--gold)" : "var(--accent)"}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - progress)}
              className="transition-[stroke-dashoffset] duration-300 ease-out"
            />
          </svg>

          <span className="flex flex-col items-center">
            <span
              className={[
                "font-serif text-7xl leading-none tabular-nums transition-transform duration-150",
                pulse ? "scale-[1.04]" : "scale-100",
                complete ? "text-gold" : "text-ink",
              ].join(" ")}
            >
              {count}
            </span>
            <span className="mt-2 text-sm text-muted">{t(copy.ofMala, lang)}</span>
            {!complete ? (
              <span className="mt-3 text-[11px] uppercase tracking-[0.16em] text-faint transition-colors group-hover:text-[color:var(--accent)]">
                {t(copy.tapToCount, lang)}
              </span>
            ) : null}
          </span>
        </button>
      </div>

      {/* Completion celebration — tasteful, gold, no emoji. */}
      {complete ? (
        <div
          role="status"
          className="w-full rounded-3xl border border-gold/30 bg-gold/10 p-5 text-center"
        >
          <p className="flex items-center justify-center gap-2 font-serif text-lg text-gold">
            <LotusMark />
            {t(copy.malaComplete, lang)}
          </p>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink/80">
            {t(copy.malaCompleteBody, lang)}
          </p>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" size="sm" onClick={reset}>
              {t(copy.beginAgain, lang)}
            </Button>
          </div>
        </div>
      ) : (
        // Reset only appears once counting has begun.
        count > 0 ? (
          <Button variant="ghost" size="sm" onClick={reset}>
            {t(copy.reset, lang)}
          </Button>
        ) : null
      )}
    </div>
  );
}

/** A small lotus glyph for the completion banner — drawn, not an emoji. */
function LotusMark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 4c1.8 2.2 1.8 5.5 0 8-1.8-2.5-1.8-5.8 0-8Z" />
      <path d="M12 12c-1.6-1.4-3.9-1.7-6-.8 0 3 2.6 5.3 6 5.3" />
      <path d="M12 12c1.6-1.4 3.9-1.7 6-.8 0 3-2.6 5.3-6 5.3" />
      <path d="M5 17c2 1.6 4.4 2.4 7 2.4s5-.8 7-2.4" />
    </svg>
  );
}
