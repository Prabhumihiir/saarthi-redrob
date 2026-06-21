"use client";

// components/profile/StreakStats.tsx — the user's practice rhythm at a glance:
// current streak (gold), total days practiced, and the last-7-day chain.

import type { Lang } from "@/lib/types";
import { last7Days } from "@/lib/state";
import { t } from "@/lib/i18n";
import { Card } from "@/components/ui";

interface StreakStatsProps {
  streak: number;
  completedDates: string[];
  lang: Lang;
}

const copy = {
  heading: { en: "Your rhythm", hi: "आपकी लय" },
  currentStreak: { en: "Day streak", hi: "दिन की लय" },
  totalDays: { en: "Days practiced", hi: "अभ्यास के दिन" },
  lastSeven: { en: "Last seven days", hi: "पिछले सात दिन" },
  // Single-letter weekday initials, Sun→Sat, indexed by Date.getDay().
  weekdays: {
    en: ["S", "M", "T", "W", "T", "F", "S"],
    hi: ["र", "सो", "मं", "बु", "गु", "शु", "श"],
  },
} as const;

/** A small flame mark for the streak, drawn in the current text color. */
function FlameMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2c.6 2.4-.4 4-1.7 5.4C8.7 9.3 7 11 7 13.6A5 5 0 0 0 17 14c0-1.6-.7-2.9-1.5-4 .2 1 0 2-.8 2.7.5-2.4-.8-4.4-2-5.8C11.4 5.4 11.8 3.6 12 2Z" />
    </svg>
  );
}

export function StreakStats({ streak, completedDates, lang }: StreakStatsProps) {
  const days = last7Days(completedDates);
  const total = completedDates.length;
  const weekdays = copy.weekdays[lang];

  return (
    <Card as="section" aria-labelledby="streak-heading">
      <h2
        id="streak-heading"
        className="font-serif text-lg tracking-tight text-ink"
      >
        {t(copy.heading, lang)}
      </h2>

      {/* Two headline numbers. */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-gold/25 bg-gold/[0.07] px-4 py-3.5">
          <div className="flex items-center gap-1.5 text-gold">
            <FlameMark />
            <span className="font-serif text-3xl leading-none tracking-tight">
              {streak}
            </span>
          </div>
          <p className="mt-1.5 text-xs font-medium leading-none text-muted">
            {t(copy.currentStreak, lang)}
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-paper/60 px-4 py-3.5">
          <span className="font-serif text-3xl leading-none tracking-tight text-ink">
            {total}
          </span>
          <p className="mt-1.5 text-xs font-medium leading-none text-muted">
            {t(copy.totalDays, lang)}
          </p>
        </div>
      </div>

      {/* Last-7 chain. */}
      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {t(copy.lastSeven, lang)}
        </p>
        <ol className="mt-2.5 flex items-stretch justify-between gap-1.5">
          {days.map(({ date, done }) => {
            const d = new Date(`${date}T00:00:00`);
            const weekday = weekdays[d.getDay()];
            const dayNum = d.getDate();
            return (
              <li key={date} className="flex flex-1 flex-col items-center gap-1.5">
                <span aria-hidden="true" className="text-[10px] text-muted">
                  {weekday}
                </span>
                <span
                  className={[
                    "grid aspect-square w-full max-w-9 place-items-center rounded-xl text-[11px] font-semibold transition-colors",
                    done
                      ? "border border-gold/30 bg-gold/15 text-gold"
                      : "border border-line bg-paper/50 text-muted/70",
                  ].join(" ")}
                  // Describe the cell for screen readers.
                  title={done ? `${date} — practiced` : `${date} — no practice`}
                >
                  {dayNum}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </Card>
  );
}
