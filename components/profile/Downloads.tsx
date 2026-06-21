"use client";

// components/profile/Downloads.tsx — offline-practice section (stub).
//
// TODO: stub — non-functional. No real downloads are wired up yet. This section
// only holds the space and explains what it will do, with a calm empty state.

import type { Lang } from "@/lib/types";
import { t } from "@/lib/i18n";
import { Card } from "@/components/ui";

interface DownloadsProps {
  lang: Lang;
}

const copy = {
  heading: { en: "Downloads", hi: "डाउनलोड" },
  subtitle: {
    en: "Practices you save for offline are kept here.",
    hi: "ऑफ़लाइन के लिए सहेजे गए अभ्यास यहाँ रखे जाते हैं।",
  },
  empty: {
    en: "Download a practice to carry it offline.",
    hi: "किसी अभ्यास को डाउनलोड करें और उसे ऑफ़लाइन साथ रखें।",
  },
} as const;

export function Downloads({ lang }: DownloadsProps) {
  return (
    <Card as="section" aria-labelledby="downloads-heading">
      <h2
        id="downloads-heading"
        className="font-serif text-lg tracking-tight text-ink"
      >
        {t(copy.heading, lang)}
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        {t(copy.subtitle, lang)}
      </p>

      {/* Empty state — no real downloads. TODO: stub. */}
      <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-hairline bg-surface2/40 px-4 py-7 text-center">
        <span
          aria-hidden="true"
          className="grid h-10 w-10 place-items-center rounded-full bg-surface2 text-faint"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />
          </svg>
        </span>
        <p className="mx-auto max-w-xs text-[14px] leading-relaxed text-faint">
          {t(copy.empty, lang)}
        </p>
      </div>
    </Card>
  );
}
