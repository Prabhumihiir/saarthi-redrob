"use client";

// components/sadhanas/SadhanaDetail.tsx — the body of a single sadhana page.
// Shows the plan's description, a gold progress header (X of N days), and the
// full day-by-day list. Enrollment is the gate:
//   - not enrolled  → a calm "Begin this sadhana" CTA (enrollSadhana(id))
//   - enrolled      → days 1..currentDay are unlocked & tappable (a day with a
//                     PracticeRef links to /session); future days show LOCKED
//                     with a quiet "Unlocks on day N".
// Tone is journey-like and encouraging — never pressuring.

import { useSaarthi } from "@/lib/state";
import { getDeity } from "@/lib/content";
import { t } from "@/lib/i18n";
import { Card, Button } from "@/components/ui";
import type { Lang, Localized, Sadhana, SadhanaDay } from "@/lib/types";

interface SadhanaDetailProps {
  sadhana: Sadhana;
  lang: Lang;
}

const copy = {
  daysLabel: { en: "days", hi: "दिन" },
  begin: { en: "Begin this sadhana", hi: "यह साधना आरंभ करें" },
  beginNote: {
    en: "A gentle commitment. Move at your own pace — your place is always kept.",
    hi: "एक कोमल संकल्प। अपनी गति से चलें — आपका स्थान सदा सुरक्षित रहता है।",
  },
  progress: { en: "{x} of {n} days", hi: "{n} में से {x} दिन" },
  notStarted: { en: "Not started yet", hi: "अभी आरंभ नहीं हुआ" },
  todayBadge: { en: "Today", hi: "आज" },
  doneBadge: { en: "Done", hi: "पूर्ण" },
  open: { en: "Open", hi: "खोलें" },
  locked: { en: "Unlocks on day {n}", hi: "दिन {n} को खुलेगा" },
  dayWord: { en: "Day", hi: "दिन" },
} satisfies Record<string, Localized>;

/** Build the session-player URL for a day's practice, if it has one. */
function practiceHref(day: SadhanaDay): string | null {
  if (!day.practice) return null;
  const { kind, deityId, itemId } = day.practice;
  const base = `/session?kind=${kind}&deity=${deityId}`;
  return itemId ? `${base}&item=${itemId}` : base;
}

export function SadhanaDetail({ sadhana, lang }: SadhanaDetailProps) {
  const { hydrated, isEnrolled, sadhanaDay, enrollSadhana } = useSaarthi();

  const deity = getDeity(sadhana.deityId);
  const accent = deity?.accent ?? "var(--saffron)";

  // Before hydration, treat as not-enrolled with day 0 so the first paint is a
  // calm, deterministic placeholder (never reflects persisted data).
  const enrolled = hydrated && isEnrolled(sadhana.id);
  const currentDay = enrolled ? sadhanaDay(sadhana.id, sadhana.length) : 0;
  const pct = Math.min(100, Math.round((currentDay / sadhana.length) * 100));

  const progressText = t(copy.progress, lang)
    .replace("{x}", String(currentDay))
    .replace("{n}", String(sadhana.length));

  return (
    <div style={{ ["--accent" as string]: accent } as React.CSSProperties}>
      {/* Description. */}
      <Card as="section" className="mb-5">
        <p className="text-[15px] leading-relaxed text-ink/90">
          {t(sadhana.description, lang)}
        </p>

        {/* Progress header. */}
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ink">
              {hydrated && enrolled ? progressText : t(copy.notStarted, lang)}
            </span>
            <span className="text-xs uppercase tracking-wide text-muted">
              {sadhana.length} {t(copy.daysLabel, lang)}
            </span>
          </div>
          <div
            className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-line/70"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={sadhana.length}
            aria-valuenow={hydrated && enrolled ? currentDay : 0}
            aria-label={progressText}
          >
            <div
              className="h-full rounded-full bg-gold transition-[width] duration-500"
              style={{ width: `${hydrated && enrolled ? pct : 0}%` }}
            />
          </div>
        </div>

        {/* Enroll CTA — only when hydrated and not yet enrolled. */}
        {hydrated && !enrolled ? (
          <div className="mt-6">
            <Button
              size="lg"
              onClick={() => enrollSadhana(sadhana.id)}
              className="w-full bg-[color:var(--accent)] text-white hover:opacity-90 active:opacity-90"
            >
              {t(copy.begin, lang)}
            </Button>
            <p className="mt-3 text-center text-[13px] leading-relaxed text-muted">
              {t(copy.beginNote, lang)}
            </p>
          </div>
        ) : null}
      </Card>

      {/* Day-by-day list. */}
      <ol className="space-y-3">
        {sadhana.days.map((day) => {
          const unlocked = enrolled && day.day <= currentDay;
          const isToday = enrolled && day.day === currentDay;
          const isPast = enrolled && day.day < currentDay;
          return (
            <li key={day.day}>
              <DayRow
                day={day}
                lang={lang}
                unlocked={unlocked}
                isToday={isToday}
                isPast={isPast}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A single day. Unlocked days with a practice are an anchor into /session;
// unlocked days without a practice are a quiet static card; locked days are
// muted and non-interactive with an "Unlocks on day N" hint.
// ---------------------------------------------------------------------------
function DayRow({
  day,
  lang,
  unlocked,
  isToday,
  isPast,
}: {
  day: SadhanaDay;
  lang: Lang;
  unlocked: boolean;
  isToday: boolean;
  isPast: boolean;
}) {
  const href = unlocked ? practiceHref(day) : null;

  const numberNode = (
    <span
      aria-hidden="true"
      className={[
        "grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-semibold transition-colors",
        unlocked
          ? "bg-[color:var(--accent)]/12 text-[color:var(--accent)]"
          : "bg-surface2 text-faint",
      ].join(" ")}
    >
      {day.day}
    </span>
  );

  const titleNode = (
    <span className="min-w-0 flex-1">
      <span className="flex items-center gap-2">
        <span
          className={[
            "truncate font-serif text-base leading-snug",
            unlocked ? "text-ink" : "text-faint",
          ].join(" ")}
        >
          {t(day.title, lang)}
        </span>
        {isToday ? (
          <span className="shrink-0 rounded-full bg-[color:var(--accent)]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--accent)]">
            {t(copy.todayBadge, lang)}
          </span>
        ) : isPast ? (
          <span className="shrink-0 rounded-full bg-goldsoft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold">
            {t(copy.doneBadge, lang)}
          </span>
        ) : null}
      </span>
      <span
        className={[
          "mt-1 block text-sm leading-relaxed",
          unlocked ? "text-muted" : "text-faint",
        ].join(" ")}
      >
        {t(day.focus, lang)}
      </span>

      {/* Affordance line. */}
      {unlocked ? (
        href ? (
          <span className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-[color:var(--accent)]">
            {t(copy.open, lang)}
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
        ) : null
      ) : (
        <span className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-medium text-faint">
          <svg
            aria-hidden="true"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
          {t(copy.locked, lang).replace("{n}", String(day.day))}
        </span>
      )}
    </span>
  );

  // Unlocked day with a practice → tappable link into the session player.
  if (href) {
    return (
      <Card className="p-0">
        <a
          href={href}
          aria-label={`${t(copy.dayWord, lang)} ${day.day} — ${t(
            day.title,
            lang,
          )}`}
          className="group flex w-full items-start gap-4 rounded-3xl p-4 text-left transition-colors hover:bg-line/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          {numberNode}
          {titleNode}
        </a>
      </Card>
    );
  }

  // Unlocked day without a practice, or a locked day → static card.
  return (
    <Card
      className={[
        "flex items-start gap-4 p-4",
        unlocked ? "" : "opacity-70",
      ].join(" ")}
      aria-disabled={unlocked ? undefined : true}
    >
      {numberNode}
      {titleNode}
    </Card>
  );
}
