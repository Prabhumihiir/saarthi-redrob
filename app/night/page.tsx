"use client";

// app/night/page.tsx — Night (Ratri). A hushed end-of-day screen for the chosen
// deity: a short night prayer, a sleep katha with an on-by-default sleep timer,
// and rest. A sub-section linked from Discover/Today (not in the tab bar).
//
// Guards on hydration (calm dark skeleton) and on a chosen deity (gentle nudge
// to /onboarding), matching the app-wide pattern.

import Link from "next/link";
import { useSaarthi } from "@/lib/state";
import { getDeity } from "@/lib/content";
import { t } from "@/lib/i18n";
import type { Lang, Localized } from "@/lib/types";
import { Card, ScreenHeader, Button } from "@/components/ui";
import { Logo } from "@/components/Logo";
import { NightPrayerCard } from "@/components/night/NightPrayerCard";
import { SleepKathaCard } from "@/components/night/SleepKathaCard";

// Screen-specific copy (both languages switch via lang from useSaarthi()).
const copy: Record<string, Localized> = {
  title: { en: "Night", hi: "रात्रि" },
  subtitle: {
    en: "Set the day down. A short prayer, a story, and rest.",
    hi: "दिन को विश्राम दें। एक संक्षिप्त प्रार्थना, एक कथा, और विश्राम।",
  },
  // Onboarding fallback.
  chooseTitle: { en: "Choose your companion", hi: "अपना सहचर चुनें" },
  chooseBody: {
    en: "Finish a short setup to pick the deity you wish to walk with.",
    hi: "जिस देव के साथ चलना चाहते हैं उन्हें चुनने के लिए एक छोटी-सी सेटअप पूरी करें।",
  },
  chooseCta: { en: "Begin setup", hi: "सेटअप शुरू करें" },
  // Quiet close.
  rest: {
    en: "Rest well. The day is laid down; tomorrow will keep.",
    hi: "अच्छे से विश्राम करें। दिन विश्राम में है; कल अपनी जगह रहेगा।",
  },
  // Shown if the chosen companion has no night content yet.
  empty: {
    en: "A night practice for this companion is on its way.",
    hi: "इस सहचर के लिए रात्रि अभ्यास शीघ्र आ रहा है।",
  },
};

export default function NightPage() {
  const { hydrated, deityId, lang } = useSaarthi();

  // 1) Hydration guard — calm dark skeleton while persisted state loads.
  if (!hydrated) {
    return <NightSkeleton />;
  }

  const deity = getDeity(deityId);

  // 2) No deity chosen yet — gently route to onboarding.
  if (!deity) {
    return (
      <div className="pt-2">
        <ScreenHeader
          title={t(copy.title, lang)}
          subtitle={t(copy.subtitle, lang)}
        />
        <Card className="text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-saffron/10 text-saffron">
            <Logo size={30} />
          </div>
          <h2 className="font-serif text-xl text-ink">
            {t(copy.chooseTitle, lang)}
          </h2>
          <p className="mx-auto mt-2 max-w-xs text-[15px] leading-relaxed text-muted">
            {t(copy.chooseBody, lang)}
          </p>
          <Link href="/onboarding" className="mt-5 inline-block">
            <Button size="md">{t(copy.chooseCta, lang)}</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const prayer = deity.nightPrayer;
  const katha = deity.nightKatha;
  const hasNight = Boolean(prayer || katha);

  return (
    // Per-deity accent at runtime, exposed as --accent for arbitrary-value classes.
    <div style={{ ["--accent" as string]: deity.accent } as React.CSSProperties} className="pt-2">
      <ScreenHeader title={t(copy.title, lang)} subtitle={t(copy.subtitle, lang)} />

      {hasNight ? (
        <>
          {prayer ? (
            <NightPrayerCard deity={deity} prayer={prayer} lang={lang} />
          ) : null}
          {katha ? <SleepKathaCard katha={katha} lang={lang} /> : null}

          {/* Quiet close — reverent, never fear-based. */}
          <p className="mt-7 text-center text-sm leading-relaxed text-faint">
            {t(copy.rest, lang)}
          </p>
        </>
      ) : (
        <Card className="text-center text-[15px] leading-relaxed text-muted">
          {t(copy.empty, lang)}
        </Card>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skeleton — calm dark placeholder shown while !hydrated.
// ---------------------------------------------------------------------------

function NightSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse pt-2">
      <div className="mb-6">
        <div className="h-8 w-32 rounded-lg bg-line/70" />
        <div className="mt-3 h-4 w-64 rounded bg-line/50" />
      </div>
      <div className="space-y-5">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="rounded-3xl border border-line bg-card p-5"
          >
            <div className="h-5 w-24 rounded-full bg-line/60" />
            <div className="mt-4 h-6 w-2/3 rounded bg-line/70" />
            <div className="mt-4 space-y-2">
              <div className="h-4 w-full rounded bg-line/50" />
              <div className="h-4 w-5/6 rounded bg-line/50" />
            </div>
            <div className="mt-6 h-11 w-32 rounded-full bg-line/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
