"use client";

// components/katha/TalkCard.tsx — a single guided talk: title, speaker, length,
// a short summary, and an AudioButton to listen. Like the stories, accent-tinted
// to the chosen deity and set at a comfortable reading measure.

import { Card, AudioButton } from "@/components/ui";
import { t } from "@/lib/i18n";
import type { Lang, Localized, Talk } from "@/lib/types";

const LABELS: Record<string, Localized> = {
  listen: { en: "Listen", hi: "सुनें" },
  // {n} replaced with the talk's minute count.
  minutes: { en: "{n} min", hi: "{n} मिनट" },
  with: { en: "with", hi: "—" },
};

export function TalkCard({ talk, lang }: { talk: Talk; lang: Lang }) {
  const minutes = t(LABELS.minutes, lang).replace("{n}", String(talk.minutes));

  return (
    <Card as="article">
      <h3 className="font-serif text-lg leading-snug tracking-tight text-ink">
        {t(talk.title, lang)}
      </h3>

      {/* Speaker · length — quiet metadata line. */}
      <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-faint">
        <span className="text-[color:var(--accent)]">{t(talk.speaker, lang)}</span>
        <span aria-hidden="true">·</span>
        <span>{minutes}</span>
      </p>

      <p className="mt-3 text-[15px] leading-[1.75] text-muted">
        {t(talk.summary, lang)}
      </p>

      <div className="mt-4">
        <AudioButton src={talk.audio} label={t(LABELS.listen, lang)} />
      </div>
    </Card>
  );
}
