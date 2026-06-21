"use client";

// app/meditate/page.tsx — the Meditate (Dhyana) screen.
// Lists the chosen deity's guided meditations as calm dark cards. Tapping
// "Begin" links into the shared session player:
//   /session?kind=meditation&deity=<id>&item=<meditation id>
// The old inline full-screen player has been replaced by /session.
// Guards on hydration and on a chosen deity, matching the app-wide pattern.

import Link from "next/link";
import { useSaarthi } from "@/lib/state";
import { getDeity } from "@/lib/content";
import { t } from "@/lib/i18n";
import type { Lang, Localized } from "@/lib/types";
import { Card, ScreenHeader, Button } from "@/components/ui";
import { Logo } from "@/components/Logo";
import { MeditationList } from "@/components/meditate/MeditationList";

// Screen-specific copy (both languages switch via lang from useSaarthi()).
const copy: Record<string, Localized> = {
  title: { en: "Meditate", hi: "ध्यान" },
  subtitle: {
    en: "Guided stillness, five to fifteen minutes. Close your eyes; we'll hold the time.",
    hi: "निर्देशित ठहराव, पाँच से पंद्रह मिनट। आँखें मूँद लें; समय हम संभाल लेंगे।",
  },
  // Onboarding fallback.
  chooseTitle: { en: "Choose your companion", hi: "अपना सहचर चुनें" },
  chooseBody: {
    en: "Finish a short setup to pick the deity you wish to walk with.",
    hi: "जिस देव के साथ चलना चाहते हैं उन्हें चुनने के लिए एक छोटी-सी सेटअप पूरी करें।",
  },
  chooseCta: { en: "Begin setup", hi: "सेटअप शुरू करें" },
};

export default function MeditatePage() {
  const { hydrated, deityId, lang } = useSaarthi();

  // 1) Hydration guard — calm skeleton while persisted state loads.
  if (!hydrated) {
    return <MeditateSkeleton />;
  }

  const deity = getDeity(deityId);

  // 2) No deity chosen yet — gently route to onboarding.
  if (!deity) {
    return <ChooseCompanion lang={lang} />;
  }

  // 3) The Meditate screen, themed to the chosen deity's accent.
  return (
    <main
      // Per-deity accent at runtime, exposed as --accent for arbitrary-value classes.
      style={{ ["--accent" as string]: deity.accent } as React.CSSProperties}
      className="mx-auto min-h-screen w-full max-w-md px-5 pb-28 pt-8 sm:pb-12"
    >
      <ScreenHeader
        title={t(copy.title, lang)}
        subtitle={t(copy.subtitle, lang)}
      />

      <MeditationList
        deityId={deity.id}
        meditations={deity.meditations}
        lang={lang}
      />
    </main>
  );
}

// ---------------------------------------------------------------------------
// Onboarding nudge — shown when no deity has been chosen.
// ---------------------------------------------------------------------------
function ChooseCompanion({ lang }: { lang: Lang }) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pb-28 pt-8 sm:pb-12">
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
    </main>
  );
}

// ---------------------------------------------------------------------------
// Skeleton — calm placeholder shown while !hydrated.
// ---------------------------------------------------------------------------
function MeditateSkeleton() {
  return (
    <main
      aria-hidden="true"
      className="mx-auto min-h-screen w-full max-w-md animate-pulse px-5 pb-28 pt-8 sm:pb-12"
    >
      <div className="mb-6">
        <div className="h-8 w-40 rounded-lg bg-line/70" />
        <div className="mt-3 h-4 w-64 rounded bg-line/50" />
      </div>
      <div className="space-y-3.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex items-start gap-4 rounded-3xl border border-hairline bg-surface p-5"
          >
            <div className="h-12 w-12 shrink-0 rounded-full bg-line/70" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded bg-line/70" />
              <div className="h-3 w-full rounded bg-line/50" />
              <div className="h-3 w-3/4 rounded bg-line/50" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
