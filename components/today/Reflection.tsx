"use client";

// components/today/Reflection.tsx — the "deity of the day" card carrying a
// single line of today's wisdom, chosen per deity and rotated deterministically
// by day-of-year. The lines are warm and affirming, never fear-based.

import { Card } from "@/components/ui";
import { t } from "@/lib/i18n";
import type { Deity, Lang, Localized } from "@/lib/types";

interface ReflectionProps {
  deity: Deity;
  lang: Lang;
  /** Local day-of-year (1–366), resolved client-side by the page. */
  dayOfYear: number | null;
}

// Per-deity wisdom lines (English verbatim per the brief; faithful Hindi).
const WISDOM: Record<string, Localized[]> = {
  shiva: [
    {
      en: "Devotion asks for presence, not perfection.",
      hi: "भक्ति पूर्णता नहीं, उपस्थिति माँगती है।",
    },
    {
      en: "Stillness is not empty. It is where you finally hear.",
      hi: "स्थिरता रिक्त नहीं है। यहीं आप अंततः सुन पाते हैं।",
    },
    {
      en: "What remains when all else falls away — that is Shiva.",
      hi: "जब सब कुछ ढह जाता है और जो शेष रहता है — वही शिव हैं।",
    },
  ],
  rama: [
    {
      en: "Dharma is only ever the next right thing, done today.",
      hi: "धर्म सदा बस अगला उचित कार्य है, जो आज किया जाए।",
    },
    {
      en: "Rama walked his path one honest step at a time. So can you.",
      hi: "राम ने अपना मार्ग एक-एक सच्चे कदम से तय किया। आप भी कर सकते हैं।",
    },
    {
      en: "Steadiness is its own form of devotion.",
      hi: "स्थिरता स्वयं में भक्ति का एक रूप है।",
    },
  ],
  ganesha: [
    {
      en: "Before the work, quiet the obstacle within.",
      hi: "कार्य से पूर्व, भीतर की बाधा को शांत करें।",
    },
    {
      en: "What blocks the way often becomes the way.",
      hi: "जो मार्ग रोकता है, वही प्रायः मार्ग बन जाता है।",
    },
    {
      en: "Begin. The path clears for those who start.",
      hi: "आरंभ करें। जो शुरुआत करते हैं, उनके लिए मार्ग खुलता है।",
    },
  ],
};

// A gentle, deity-agnostic fallback for any deity without authored lines.
const FALLBACK: Localized[] = [
  {
    en: "Begin where you are. A single steady breath is already the practice.",
    hi: "जहाँ हैं वहीं से आरंभ करें। एक स्थिर श्वास ही अभ्यास का प्रारंभ है।",
  },
  {
    en: "What you return to each day is what you become.",
    hi: "जिसकी ओर आप प्रतिदिन लौटते हैं, वही आप बनते जाते हैं।",
  },
];

const LABEL = { en: "Today's wisdom", hi: "आज का बोध" } satisfies Localized;

export function Reflection({ deity, lang, dayOfYear }: ReflectionProps) {
  const lines = WISDOM[deity.id] ?? FALLBACK;
  const wisdom = dayOfYear === null ? null : lines[dayOfYear % lines.length];

  // "TODAY'S WISDOM · {DEITY}" — uppercased via CSS so the source copy stays clean.
  const label = `${t(LABEL, lang)} · ${t(deity.name, lang)}`;

  return (
    <Card as="section" className="mb-5">
      <div className="flex items-start gap-4">
        {/* Deity-of-the-day mark: the first Devanagari letter in the accent color. */}
        <div
          aria-hidden="true"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[color:var(--accent)]/25 bg-[color:var(--accent)]/[0.08]"
        >
          <span className="font-deva text-xl text-[color:var(--accent)]">
            {deity.devanagariName.charAt(0)}
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            {label}
          </p>
          <p className="mt-2 font-serif text-lg leading-snug text-ink">
            {wisdom ? (
              t(wisdom, lang)
            ) : (
              <span className="inline-block h-5 w-full animate-pulse rounded bg-line/60" />
            )}
          </p>
        </div>
      </div>
    </Card>
  );
}
