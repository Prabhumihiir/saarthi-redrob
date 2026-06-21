"use client";

// app/today/page.tsx — the Today home screen: the core daily loop.
// Top to bottom: greeting hero, a panchang line, today's practice (shloka of
// the day) with a session-player CTA, Ask Saarthi, a suggested-practice
// carousel, a one-tap daily question, today's wisdom, the active-sadhana strip,
// the streak + sankalp section (complete / sealed), and quick links onward.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSaarthi } from "@/lib/state";
import { getDeity } from "@/lib/content";
import { t, ui } from "@/lib/i18n";
import { Button, Card } from "@/components/ui";
import { Logo } from "@/components/Logo";
import { Greeting } from "@/components/today/Greeting";
import { Panchang } from "@/components/today/Panchang";
import { PracticeOfTheDay } from "@/components/today/PracticeOfTheDay";
import { SuggestedCarousel } from "@/components/today/SuggestedCarousel";
import { AskSaarthi } from "@/components/today/AskSaarthi";
import { DailyQuestion } from "@/components/today/DailyQuestion";
import { Reflection } from "@/components/today/Reflection";
import { ActiveSadhana } from "@/components/today/ActiveSadhana";
import { StreakSankalp } from "@/components/today/StreakSankalp";
import { QuickLinks } from "@/components/today/QuickLinks";
import type { Lang } from "@/lib/types";

/** Local day-of-year (1–366). Mirrors lib/panchang's private helper. */
function dayOfYearLocal(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / 86_400_000);
}

export default function TodayPage() {
  const { hydrated, deityId, lang } = useSaarthi();

  // Day-of-year is resolved client-side (never in module/server scope) and used
  // to deterministically pick today's shloka and reflection.
  const [dayOfYear, setDayOfYear] = useState<number | null>(null);
  useEffect(() => {
    setDayOfYear(dayOfYearLocal(new Date()));
  }, []);

  // 1) Calm splash while persisted state loads — avoids any hydration mismatch.
  if (!hydrated) {
    return <TodaySkeleton />;
  }

  // 2) No deity chosen yet — gently invite the user to finish onboarding.
  const deity = getDeity(deityId);
  if (!deity) {
    return <FinishOnboarding lang={lang} />;
  }

  // 3) The full Today screen, themed to the chosen deity's accent.
  return (
    <main
      // Per-deity accent: components read --accent via Tailwind arbitrary values.
      style={{ ["--accent" as string]: deity.accent }}
      className="mx-auto min-h-screen w-full max-w-md px-5 pb-28 pt-8 sm:pb-12"
    >
      <Greeting deity={deity} lang={lang} />
      <Panchang lang={lang} />
      <PracticeOfTheDay deity={deity} lang={lang} dayOfYear={dayOfYear} />
      <AskSaarthi lang={lang} />
      <SuggestedCarousel deity={deity} lang={lang} />
      <DailyQuestion lang={lang} dayOfYear={dayOfYear} />
      <Reflection deity={deity} lang={lang} dayOfYear={dayOfYear} />
      <ActiveSadhana lang={lang} />
      <StreakSankalp lang={lang} />
      <QuickLinks lang={lang} />
    </main>
  );
}

// ---------------------------------------------------------------------------
// Hydration splash — quiet, never flashes persisted state.
// ---------------------------------------------------------------------------
function TodaySkeleton() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-5 text-muted">
      <Logo size={44} className="text-saffron/70" />
      <p className="mt-4 text-sm">{t(ui.loading, "en")}…</p>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Onboarding nudge — shown when no deity has been chosen.
// ---------------------------------------------------------------------------
function FinishOnboarding({ lang }: { lang: Lang }) {
  const copy = {
    title: { en: "Let's set up your practice", hi: "आइए आपका अभ्यास तैयार करें" },
    body: {
      en: "Choose a deity to walk with and set a daily time. It takes less than a minute.",
      hi: "साथ चलने के लिए एक देवता चुनें और एक दैनिक समय निर्धारित करें। इसमें एक मिनट से भी कम लगेगा।",
    },
    cta: { en: "Begin", hi: "आरंभ करें" },
  } satisfies Record<string, Record<Lang, string>>;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 pb-28 pt-8 sm:pb-12">
      <Card className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-saffron/10 text-saffron">
          <Logo size={30} />
        </div>
        <h1 className="mt-5 font-serif text-2xl tracking-tight text-ink">
          {t(copy.title, lang)}
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-[15px] leading-relaxed text-muted">
          {t(copy.body, lang)}
        </p>
        <div className="mt-6">
          <Link href="/onboarding" className="inline-flex">
            <Button size="lg">{t(copy.cta, lang)}</Button>
          </Link>
        </div>
      </Card>
    </main>
  );
}
