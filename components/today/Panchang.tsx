"use client";

// components/today/Panchang.tsx — a single, calm line of almanac context for
// the day. Reads the deterministic mock panchang (stable per calendar day) and
// renders just its self-contained note line. A quiet moon glyph sets the tone.
//
// TODO: real panchang API (tithi/paksha/nakshatra by date + location).

import { Card } from "@/components/ui";
import { t } from "@/lib/i18n";
import { getTodayPanchang } from "@/lib/panchang";
import type { Lang } from "@/lib/types";

interface PanchangProps {
  lang: Lang;
}

export function Panchang({ lang }: PanchangProps) {
  // Deterministic by calendar day; safe to compute on every render (pure).
  const panchang = getTodayPanchang();

  return (
    <Card as="section" className="mb-5 flex items-start gap-3.5 py-4">
      <span
        aria-hidden="true"
        className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[color:var(--accent)]/10 text-[color:var(--accent)]"
      >
        <MoonGlyph />
      </span>
      <p className="text-[14.5px] leading-relaxed text-ink/90">
        {t(panchang.note, lang)}
      </p>
    </Card>
  );
}

/** A slim crescent moon — drawn, not an emoji. */
function MoonGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5Z" />
    </svg>
  );
}
