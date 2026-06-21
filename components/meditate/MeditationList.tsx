"use client";

// components/meditate/MeditationList.tsx — the list of a deity's guided
// meditations as calm, dark cards. Each card states its title, minutes, and
// description, and a "Begin" action that links into the shared session player
// at /session?kind=meditation&deity=<id>&item=<meditation id>.

import Link from "next/link";
import { Card, Badge } from "@/components/ui";
import { t } from "@/lib/i18n";
import type { Lang, Localized, Meditation } from "@/lib/types";

interface MeditationListProps {
  deityId: string;
  meditations: Meditation[];
  lang: Lang;
}

const copy = {
  minutesLabel: { en: "min", hi: "मिनट" },
  begin: { en: "Begin", hi: "आरंभ करें" },
  empty: {
    en: "Guided meditations for your companion are on their way.",
    hi: "आपके सहचर के लिए निर्देशित ध्यान शीघ्र आ रहे हैं।",
  },
} satisfies Record<string, Localized>;

/** Build the session-player URL for a given meditation. */
function sessionHref(deityId: string, meditationId: string): string {
  return `/session?kind=meditation&deity=${deityId}&item=${meditationId}`;
}

export function MeditationList({
  deityId,
  meditations,
  lang,
}: MeditationListProps) {
  if (meditations.length === 0) {
    return (
      <Card className="text-center text-[15px] leading-relaxed text-muted">
        {t(copy.empty, lang)}
      </Card>
    );
  }

  return (
    <ul className="space-y-3.5">
      {meditations.map((m) => (
        <li key={m.id}>
          <MeditationCard deityId={deityId} meditation={m} lang={lang} />
        </li>
      ))}
    </ul>
  );
}

function MeditationCard({
  deityId,
  meditation,
  lang,
}: {
  deityId: string;
  meditation: Meditation;
  lang: Lang;
}) {
  return (
    <Card className="p-0">
      <Link
        href={sessionHref(deityId, meditation.id)}
        aria-label={`${t(meditation.title, lang)} — ${meditation.minutes} ${t(
          copy.minutesLabel,
          lang,
        )}`}
        className="group flex w-full items-start gap-4 rounded-3xl p-5 text-left transition-colors hover:bg-line/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        {/* Accent play affordance. */}
        <span
          aria-hidden="true"
          className="mt-0.5 grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[color:var(--accent)]/10 text-[color:var(--accent)] transition-colors group-hover:bg-[color:var(--accent)]/15"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.29-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
          </svg>
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-3">
            <span className="truncate font-serif text-lg leading-snug text-ink">
              {t(meditation.title, lang)}
            </span>
            <Badge tone="muted" className="shrink-0">
              {meditation.minutes} {t(copy.minutesLabel, lang)}
            </Badge>
          </span>

          <span className="mt-1.5 block text-sm leading-relaxed text-muted">
            {t(meditation.description, lang)}
          </span>

          {/* Quiet "Begin" affordance — the whole card is the link, this just
              names the action and confirms it on hover/focus. */}
          <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-[color:var(--accent)]">
            {t(copy.begin, lang)}
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-0.5"
            >
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </span>
        </span>
      </Link>
    </Card>
  );
}
