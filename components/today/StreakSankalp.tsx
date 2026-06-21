"use client";

// components/today/StreakSankalp.tsx — the streak + sankalp (daily vow) section.
// Holds the most satisfying interaction in the app: completing today's practice,
// which persists through useSaarthi() (localStorage), advances the streak, fills
// today's cell in the 7-day chain, and — on a milestone — surfaces the same
// celebratory line the session player uses, briefly.

import { useState } from "react";
import { Card, Button, Badge } from "@/components/ui";
import { useSaarthi, last7Days } from "@/lib/state";
import { t } from "@/lib/i18n";
import type { Lang, Localized } from "@/lib/types";

interface StreakSankalpProps {
  lang: Lang;
}

// Milestone lines, keyed by streak number — kept identical to the session
// player's celebratory copy (English verbatim, faithful Hindi) so the same
// words greet the user wherever a milestone is sealed.
const MILESTONE_LINES: Record<number, Localized> = {
  7: {
    en: "Seven days. You've begun what most never do.",
    hi: "सात दिन। आपने वह आरंभ किया जो अधिकांश कभी नहीं करते।",
  },
  21: {
    en: "Twenty-one days. This is a habit now.",
    hi: "इक्कीस दिन। अब यह एक आदत बन चुकी है।",
  },
  40: {
    en: "Forty days — a full sadhana. Something has quietly shifted.",
    hi: "चालीस दिन — एक पूर्ण साधना। भीतर कुछ चुपचाप बदल गया है।",
  },
  108: {
    en: "One hundred and eight. A sacred number, earned.",
    hi: "एक सौ आठ। एक पवित्र संख्या, अर्जित की हुई।",
  },
};

const LABELS = {
  heading: { en: "Your sankalp", hi: "आपका संकल्प" },
  subheading: {
    en: "A daily vow, kept gently.",
    hi: "एक दैनिक संकल्प, कोमलता से निभाया गया।",
  },
  dayStreak: { en: "day streak", hi: "दिन की निरंतरता" },
  beginStreak: {
    en: "Begin your streak today.",
    hi: "आज से अपनी निरंतरता आरंभ करें।",
  },
  complete: {
    en: "Complete today's practice",
    hi: "आज का अभ्यास पूर्ण करें",
  },
  sealed: {
    en: "Practice sealed for today.",
    hi: "आज का अभ्यास संपन्न।",
  },
  completedNote: {
    en: "Well kept. Return tomorrow to continue the chain.",
    hi: "बखूबी निभाया। श्रृंखला जारी रखने हेतु कल लौटें।",
  },
  sankalpTime: { en: "Daily time", hi: "दैनिक समय" },
  noTime: { en: "Not set", hi: "निर्धारित नहीं" },
  last7: { en: "Last 7 days", hi: "पिछले 7 दिन" },
} satisfies Record<string, Localized>;

// "{n} days. The thread is forming." — interpolated, with faithful Hindi.
function threadLine(n: number, lang: Lang): string {
  return lang === "hi"
    ? `${n} दिन। धागा बुन रहा है।`
    : `${n} days. The thread is forming.`;
}

// Day-of-week initials for the 7-day chain (Sun → Sat).
const DOW = {
  en: ["S", "M", "T", "W", "T", "F", "S"],
  hi: ["र", "सो", "मं", "बु", "गु", "शु", "श"],
} satisfies Record<Lang, string[]>;

/** Format "HH:MM" (24h) into a friendly local label, e.g. "6:30 AM" / "6:30 पूर्वाह्न". */
function formatTime(time: string, lang: Lang): string {
  const [hStr, mStr] = time.split(":");
  const h = Number(hStr);
  const m = mStr ?? "00";
  if (Number.isNaN(h)) return time;
  if (lang === "hi") {
    const period = h < 12 ? "पूर्वाह्न" : "अपराह्न";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${m} ${period}`;
  }
  const period = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${period}`;
}

export function StreakSankalp({ lang }: StreakSankalpProps) {
  const {
    streak,
    completedDates,
    sankalpTime,
    markPracticeDone,
    isCompletedToday,
  } = useSaarthi();

  // Local mirror so the cell + counter update immediately on click. Seeded from
  // the hydrated hook value; markPracticeDone() is the source of truth.
  const [done, setDone] = useState<boolean>(() => isCompletedToday());
  // The freshly-earned milestone line, if any — surfaced briefly after sealing.
  const [milestone, setMilestone] = useState<Localized | null>(null);

  const chain = last7Days(completedDates);

  const handleMark = () => {
    const result = markPracticeDone();
    setDone(true);
    if (result.newMilestone && MILESTONE_LINES[result.newMilestone]) {
      setMilestone(MILESTONE_LINES[result.newMilestone]);
    }
  };

  const completed = done || isCompletedToday();

  // Headline: streak 0 → invitation; 1–6 → "the thread is forming"; 7+ → count.
  const headline =
    streak === 0 ? (
      <span className="text-muted">{t(LABELS.beginStreak, lang)}</span>
    ) : streak < 7 ? (
      <span className="text-ink">{threadLine(streak, lang)}</span>
    ) : (
      <>
        <span className="font-serif text-3xl font-medium text-gold tabular-nums">
          {streak}
        </span>{" "}
        <span className="text-muted">{t(LABELS.dayStreak, lang)}</span>
      </>
    );

  return (
    <Card as="section" className="mb-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl tracking-tight text-ink">
            {t(LABELS.heading, lang)}
          </h2>
          <p className="mt-1 text-sm text-muted">{t(LABELS.subheading, lang)}</p>
        </div>

        {/* Streak counter — tasteful gold, no emoji. */}
        <Badge tone="gold" className="shrink-0 px-3 py-1.5 text-sm">
          <FlameMark />
          <span className="tabular-nums font-semibold">{streak}</span>
        </Badge>
      </div>

      {/* Streak headline / sankalp time row. */}
      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <p className="text-[15px]">{headline}</p>

        <p className="text-sm text-muted">
          {t(LABELS.sankalpTime, lang)}:{" "}
          <span className="font-medium text-ink">
            {sankalpTime ? formatTime(sankalpTime, lang) : t(LABELS.noTime, lang)}
          </span>
        </p>
      </div>

      {/* The unbroken-chain calendar of the last 7 days. */}
      <div className="mt-6">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
          {t(LABELS.last7, lang)}
        </p>
        <ul className="flex items-center justify-between gap-2">
          {chain.map((d, idx) => {
            const dow = new Date(`${d.date}T00:00:00`).getDay();
            const isToday = completed && idx === chain.length - 1;
            const filled = d.done || isToday;
            return (
              <li key={d.date} className="flex flex-1 flex-col items-center gap-2">
                <span
                  aria-hidden="true"
                  className={[
                    "grid h-9 w-9 place-items-center rounded-full border text-xs font-semibold transition-colors",
                    filled
                      ? "border-transparent bg-gold text-white"
                      : "border-line bg-goldsoft text-muted",
                  ].join(" ")}
                >
                  {filled ? <CheckMark /> : ""}
                </span>
                <span className="text-[11px] font-medium text-muted">
                  {DOW[lang][dow]}
                </span>
                <span className="sr-only">{d.date}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* The action — or a gentle sealed state, with any milestone line. */}
      <div className="mt-6">
        {completed ? (
          <div className="rounded-2xl border border-gold/30 bg-goldsoft px-4 py-3.5">
            <p className="flex items-center gap-2 text-[15px] font-medium text-gold">
              <CheckMark />
              {t(LABELS.sealed, lang)}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">
              {milestone ? t(milestone, lang) : t(LABELS.completedNote, lang)}
            </p>
          </div>
        ) : (
          <Button size="lg" onClick={handleMark} className="w-full">
            {t(LABELS.complete, lang)}
          </Button>
        )}
      </div>
    </Card>
  );
}

/** A small flame glyph for the streak badge — drawn, not an emoji. */
function FlameMark() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.5c.4 2.6-.9 4-2.2 5.3C8.3 9.2 7 10.7 7 13a5 5 0 0 0 10 .2c0-1.7-.7-3-1.6-4.2-.3 1-1 1.6-1.8 1.6 1-2.4-.2-5.6-1.6-8.1Z" />
    </svg>
  );
}

/** A small check glyph for completed cells / state. */
function CheckMark() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}
