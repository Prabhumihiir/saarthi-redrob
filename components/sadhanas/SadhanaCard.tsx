"use client";

// components/sadhanas/SadhanaCard.tsx — one sadhana on the list screen.
// A calm, dark journey card themed to the sadhana's deity accent. Shows title,
// subtitle, length, and the user's standing: either "Day X of N" (with a quiet
// gold progress bar) when enrolled, or a gentle "Begin" affordance otherwise.
// The whole card links to /sadhanas/[id].

import Link from "next/link";
import { Card, Badge } from "@/components/ui";
import { getDeity } from "@/lib/content";
import { t } from "@/lib/i18n";
import type { Lang, Localized, Sadhana } from "@/lib/types";

interface SadhanaCardProps {
  sadhana: Sadhana;
  lang: Lang;
  /** True once persisted state has hydrated — gates enrollment display. */
  hydrated: boolean;
  /** Whether the user is enrolled in this sadhana. */
  enrolled: boolean;
  /** Current 1-based day (capped at length); only meaningful when enrolled. */
  currentDay: number;
}

const copy = {
  daysLabel: { en: "days", hi: "दिन" },
  begin: { en: "Begin", hi: "आरंभ करें" },
  dayOf: { en: "Day {x} of {n}", hi: "{n} में से दिन {x}" },
} satisfies Record<string, Localized>;

/** "9 days" / "21 days" / "40 days" in the active language. */
function lengthLabel(length: number, lang: Lang): string {
  return `${length} ${t(copy.daysLabel, lang)}`;
}

export function SadhanaCard({
  sadhana,
  lang,
  hydrated,
  enrolled,
  currentDay,
}: SadhanaCardProps) {
  const deity = getDeity(sadhana.deityId);
  const accent = deity?.accent ?? "var(--saffron)";
  const pct = enrolled
    ? Math.min(100, Math.round((currentDay / sadhana.length) * 100))
    : 0;

  const dayText = t(copy.dayOf, lang)
    .replace("{x}", String(currentDay))
    .replace("{n}", String(sadhana.length));

  return (
    <Card
      as="article"
      className="p-0"
      // Per-sadhana accent for the arbitrary-value classes within.
      // (Wrapper sets --accent; Card itself stays neutral surface.)
    >
      <Link
        href={`/sadhanas/${sadhana.id}`}
        style={{ ["--accent" as string]: accent } as React.CSSProperties}
        aria-label={`${t(sadhana.title, lang)} — ${lengthLabel(
          sadhana.length,
          lang,
        )}`}
        className="group block rounded-3xl p-5 transition-colors hover:bg-line/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-serif text-xl leading-snug tracking-tight text-ink">
              {t(sadhana.title, lang)}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              {t(sadhana.subtitle, lang)}
            </p>
          </div>
          {deity ? (
            <span
              aria-hidden="true"
              className="shrink-0 font-deva text-lg text-[color:var(--accent)]"
            >
              {deity.devanagariName}
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <Badge tone="muted">{lengthLabel(sadhana.length, lang)}</Badge>

          {/* Standing. Render the enrollment state only after hydration so the
              first paint never reflects persisted data (avoids mismatch). */}
          {hydrated && enrolled ? (
            <span className="text-[13px] font-medium text-[color:var(--accent)]">
              {dayText}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[color:var(--accent)]">
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
          )}
        </div>

        {/* Quiet gold progress bar — only when enrolled and hydrated. */}
        {hydrated && enrolled ? (
          <div className="mt-4">
            <div
              className="h-1.5 w-full overflow-hidden rounded-full bg-line/70"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={sadhana.length}
              aria-valuenow={currentDay}
              aria-label={dayText}
            >
              <div
                className="h-full rounded-full bg-gold transition-[width] duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ) : null}
      </Link>
    </Card>
  );
}
