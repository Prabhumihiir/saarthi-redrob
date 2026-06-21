"use client";

// components/satsang/PresenceLine.tsx — a gentle "X are practicing now" line.
//
// POC STUB: there is no real community backend. The number is computed
// deterministically from the current hour (so it feels alive and shifts
// through the day) and is only resolved AFTER mount — never during SSR or
// the first client render — to avoid any hydration mismatch. While it is
// resolving we render a calm, fixed-width placeholder.

import { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import type { Lang, Localized } from "@/lib/types";

interface PresenceLineProps {
  lang: Lang;
}

const COPY = {
  // {n} is substituted with the live count.
  practicingNow: {
    en: "{n} are practicing now",
    hi: "{n} लोग अभी अभ्यास कर रहे हैं",
  },
} satisfies Record<string, Localized>;

/**
 * A believable, deterministic presence count. Seeded by the day + hour so it
 * holds steady within a render but drifts gently across the day, and gives a
 * warmer number in the morning and evening practice windows.
 */
function seededPresence(now: Date): number {
  const dayOfMonth = now.getDate();
  const hour = now.getHours();
  // A small day-seeded base so two people don't see the exact same number,
  // bounded to a calm, plausible range.
  const base = 180 + ((dayOfMonth * 37) % 90);
  // Morning (5–9) and evening (18–21) feel busier; deep night feels quiet.
  const window =
    hour >= 5 && hour <= 9 ? 120 : hour >= 18 && hour <= 21 ? 90 : hour >= 0 && hour <= 4 ? -70 : 20;
  // A gentle per-hour wobble so the figure isn't suspiciously round.
  const wobble = ((hour * 13) % 17) - 8;
  return Math.max(24, base + window + wobble);
}

export function PresenceLine({ lang }: PresenceLineProps) {
  // Resolve only after mount — keeps SSR and first paint identical.
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    setCount(seededPresence(new Date()));
  }, []);

  return (
    <div className="flex items-center justify-center gap-2.5 py-1 text-sm text-muted">
      <span aria-hidden="true" className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--accent)]/60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--accent)]" />
      </span>
      {count === null ? (
        <span
          aria-hidden="true"
          className="inline-block h-3.5 w-40 animate-pulse rounded bg-line/60"
        />
      ) : (
        <span aria-live="polite">
          <span className="font-semibold text-ink">{count.toLocaleString(lang === "hi" ? "hi-IN" : "en-IN")}</span>{" "}
          {t(COPY.practicingNow, lang).replace("{n} ", "")}
        </span>
      )}
    </div>
  );
}
