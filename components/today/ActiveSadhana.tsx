"use client";

// components/today/ActiveSadhana.tsx — a quiet strip surfacing any sadhana the
// user is currently walking. If enrolled, it shows the plan's title and
// "Day X of N" (capped at the plan length) and links to that plan's detail.
// If none is active, it offers a gentle invitation to begin one.

import Link from "next/link";
import { Card } from "@/components/ui";
import { useSaarthi } from "@/lib/state";
import { t } from "@/lib/i18n";
import { sadhanas } from "@/lib/content";
import type { Lang, Localized } from "@/lib/types";

interface ActiveSadhanaProps {
  lang: Lang;
}

const COPY = {
  active: { en: "Your sadhana", hi: "आपकी साधना" },
  invite: { en: "Begin a sadhana", hi: "एक साधना आरंभ करें" },
  inviteSub: {
    en: "A guided journey over many days.",
    hi: "अनेक दिनों की एक निर्देशित यात्रा।",
  },
} satisfies Record<string, Localized>;

function dayLabel(day: number, total: number, lang: Lang): string {
  return lang === "hi" ? `दिन ${day} / ${total}` : `Day ${day} of ${total}`;
}

export function ActiveSadhana({ lang }: ActiveSadhanaProps) {
  const { isEnrolled, sadhanaDay } = useSaarthi();

  // First enrolled plan, if any. (Sadhanas are walked one at a time.)
  const active = sadhanas.find((s) => isEnrolled(s.id));

  if (active) {
    const day = sadhanaDay(active.id, active.length);
    return (
      <section className="mb-5">
        <Link
          href={`/sadhanas/${active.id}`}
          className="group block focus-visible:outline-none"
        >
          <Card className="flex items-center gap-4 transition-colors group-hover:border-[color:var(--accent)] group-focus-visible:ring-2 group-focus-visible:ring-[color:var(--accent)] group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-paper">
            <DayRing day={day} total={active.length} />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--accent)]">
                {t(COPY.active, lang)}
              </p>
              <p className="mt-0.5 truncate font-serif text-lg leading-snug tracking-tight text-ink">
                {t(active.title, lang)}
              </p>
              <p className="mt-0.5 text-[13px] text-muted">
                {dayLabel(day, active.length, lang)}
              </p>
            </div>
            <ChevronGlyph />
          </Card>
        </Link>
      </section>
    );
  }

  // No active plan — a calm invitation.
  return (
    <section className="mb-5">
      <Link
        href="/sadhanas"
        className="group block focus-visible:outline-none"
      >
        <Card className="flex items-center gap-4 transition-colors group-hover:border-[color:var(--accent)] group-focus-visible:ring-2 group-focus-visible:ring-[color:var(--accent)] group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-paper">
          <span
            aria-hidden="true"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[color:var(--accent)]/25 bg-[color:var(--accent)]/[0.08] text-[color:var(--accent)]"
          >
            <PathGlyph />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-serif text-lg leading-snug tracking-tight text-ink">
              {t(COPY.invite, lang)}
            </p>
            <p className="mt-0.5 text-[13px] text-muted">
              {t(COPY.inviteSub, lang)}
            </p>
          </div>
          <ChevronGlyph />
        </Card>
      </Link>
    </section>
  );
}

/** A simple ring showing progress through the plan, with the day at center. */
function DayRing({ day, total }: { day: number; total: number }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const frac = total > 0 ? Math.min(day / total, 1) : 0;

  return (
    <span
      aria-hidden="true"
      className="relative grid h-12 w-12 shrink-0 place-items-center"
    >
      <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-line"
        />
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - frac)}
          className="text-[color:var(--accent)]"
        />
      </svg>
      <span className="absolute font-serif text-sm font-medium tabular-nums text-ink">
        {day}
      </span>
    </span>
  );
}

function ChevronGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 text-muted transition-colors group-hover:text-[color:var(--accent)]"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function PathGlyph() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 19c0-3 3-3 3-6s-3-3-3-6" />
      <circle cx="6" cy="5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="9" cy="13" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="6" cy="19" r="1.4" fill="currentColor" stroke="none" />
      <path d="M13 19h5" />
      <path d="M13 5h5" />
      <path d="M15 12h5" />
    </svg>
  );
}
