"use client";

// components/night/NightPrayerCard.tsx — the deity's night prayer.
// Devanagari (verbatim) + transliteration + meaning, with a single "Begin"
// that opens the session player on the night prayer. Hushed, lower-contrast
// styling befitting the end of the day, while keeping AA-legible text.

import Link from "next/link";
import { Card, Button, Badge } from "@/components/ui";
import { t } from "@/lib/i18n";
import type { Deity, Lang, Localized, Shloka } from "@/lib/types";

interface NightPrayerCardProps {
  deity: Deity;
  prayer: Shloka;
  lang: Lang;
}

const LABELS: Record<string, Localized> = {
  tag: { en: "Night prayer", hi: "रात्रि प्रार्थना" },
  begin: { en: "Begin", hi: "आरंभ करें" },
};

export function NightPrayerCard({ deity, prayer, lang }: NightPrayerCardProps) {
  // Session player picks the deity's night prayer when kind=night.
  const href = `/session?kind=night&deity=${deity.id}`;

  return (
    <Card as="section" className="mb-5">
      <div className="mb-4 flex items-center justify-between">
        <Badge tone="muted">{t(LABELS.tag, lang)}</Badge>
        <span className="font-deva text-lg text-[color:var(--accent)]/85">
          {deity.devanagariName}
        </span>
      </div>

      <h2 className="font-serif text-xl leading-snug tracking-tight text-ink">
        {t(prayer.title, lang)}
      </h2>

      {/* Devanagari preserved verbatim, always in the Devanagari face. */}
      <p className="mt-4 font-deva text-[21px] leading-[1.9] text-ink/90">
        {prayer.devanagari}
      </p>

      <p className="mt-3 text-[15px] italic leading-relaxed text-muted">
        {prayer.transliteration}
      </p>

      <p className="mt-4 text-[15px] leading-relaxed text-ink/80">
        {t(prayer.meaning, lang)}
      </p>

      <p className="mt-3 text-xs uppercase tracking-wide text-faint">
        {prayer.source}
      </p>

      <div className="mt-6">
        <Link href={href} className="inline-flex">
          <Button
            size="lg"
            className="bg-[color:var(--accent)] text-white hover:opacity-90 active:opacity-90"
          >
            {t(LABELS.begin, lang)}
          </Button>
        </Link>
      </div>
    </Card>
  );
}
