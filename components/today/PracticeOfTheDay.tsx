"use client";

// components/today/PracticeOfTheDay.tsx — the heart of the daily loop.
// Shows one shloka chosen deterministically by the day of the year, so it is
// stable for the whole day and rotates predictably through the deity's verses.
// The primary CTA opens the session player on exactly this shloka.

import Link from "next/link";
import { Card, Button, AudioButton, Badge } from "@/components/ui";
import { t } from "@/lib/i18n";
import type { Deity, Lang, Shloka } from "@/lib/types";

interface PracticeOfTheDayProps {
  deity: Deity;
  lang: Lang;
  /** Local day-of-year (1–366), resolved client-side by the page. */
  dayOfYear: number | null;
}

/** Pick today's shloka deterministically by day-of-year. */
function shlokaForDay(shlokas: Shloka[], dayOfYear: number): Shloka {
  return shlokas[dayOfYear % shlokas.length];
}

const LABELS = {
  todaysPractice: { en: "Today's practice", hi: "आज का अभ्यास" },
  begin: { en: "Begin practice", hi: "अभ्यास आरंभ करें" },
  listen: { en: "Listen", hi: "सुनें" },
} satisfies Record<string, Record<Lang, string>>;

export function PracticeOfTheDay({
  deity,
  lang,
  dayOfYear,
}: PracticeOfTheDayProps) {
  const hasShlokas = deity.shlokas.length > 0;
  const shloka =
    hasShlokas && dayOfYear !== null
      ? shlokaForDay(deity.shlokas, dayOfYear)
      : null;

  // Session player deep-link for today's exact shloka.
  const sessionHref = shloka
    ? `/session?kind=shloka&deity=${deity.id}&item=${shloka.id}`
    : "/session?kind=shloka&deity=" + deity.id;

  return (
    <Card as="section" className="mb-5">
      <div className="mb-4 flex items-center justify-between">
        <Badge tone="saffron">{t(LABELS.todaysPractice, lang)}</Badge>
        <span className="font-deva text-lg text-[color:var(--accent)]">
          {deity.devanagariName}
        </span>
      </div>

      {shloka ? (
        <ShlokaBody shloka={shloka} lang={lang} />
      ) : (
        // Calm placeholder until the day-of-year resolves on the client.
        <div className="space-y-3" aria-hidden="true">
          <div className="h-7 w-3/4 animate-pulse rounded bg-line/70" />
          <div className="h-5 w-full animate-pulse rounded bg-line/60" />
          <div className="h-5 w-5/6 animate-pulse rounded bg-line/60" />
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link href={sessionHref} className="inline-flex">
          <Button
            size="lg"
            className="bg-[color:var(--accent)] text-white hover:opacity-90 active:opacity-90"
          >
            {t(LABELS.begin, lang)}
          </Button>
        </Link>
        {shloka ? (
          <AudioButton
            // TODO: replace with produced audio.
            src={shloka.audio ?? "/audio/chant-placeholder.wav"}
            label={t(LABELS.listen, lang)}
          />
        ) : null}
      </div>
    </Card>
  );
}

function ShlokaBody({ shloka, lang }: { shloka: Shloka; lang: Lang }) {
  return (
    <div>
      <h2 className="font-serif text-xl leading-snug tracking-tight text-ink">
        {t(shloka.title, lang)}
      </h2>

      {/* Devanagari is preserved verbatim and always set in the Devanagari face. */}
      <p className="mt-4 font-deva text-[22px] leading-[1.85] text-ink">
        {shloka.devanagari}
      </p>

      <p className="mt-3 text-[15px] italic leading-relaxed text-muted">
        {shloka.transliteration}
      </p>

      <p className="mt-4 text-[15px] leading-relaxed text-ink/90">
        {t(shloka.meaning, lang)}
      </p>

      <p className="mt-3 text-xs uppercase tracking-wide text-muted">
        {shloka.source}
      </p>
    </div>
  );
}
