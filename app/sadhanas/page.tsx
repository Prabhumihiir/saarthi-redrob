"use client";

// app/sadhanas/page.tsx — the Sadhanas index: commit to a multi-day journey.
// Lists every guided plan (9 / 21 / 40 days) as a calm dark card, each themed
// to its own deity accent and showing the user's standing. Sadhanas are
// self-contained journeys (each carries its own deity), so the list is
// browseable regardless of the user's chosen companion — we only guard on
// hydration so the first paint never reflects persisted enrollment data.

import { useSaarthi } from "@/lib/state";
import { t } from "@/lib/i18n";
import type { Localized } from "@/lib/types";
import { ScreenHeader } from "@/components/ui";
import { SadhanaList } from "@/components/sadhanas/SadhanaList";

const copy: Record<string, Localized> = {
  title: { en: "Sadhanas", hi: "साधनाएँ" },
  subtitle: {
    en: "Commit to a journey — nine, twenty-one, or forty days of guided practice.",
    hi: "एक यात्रा का संकल्प लें — नौ, इक्कीस या चालीस दिनों का निर्देशित अभ्यास।",
  },
};

export default function SadhanasPage() {
  const { hydrated, lang } = useSaarthi();

  if (!hydrated) {
    return <SadhanasSkeleton />;
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pb-28 pt-8 sm:pb-12">
      <ScreenHeader title={t(copy.title, lang)} subtitle={t(copy.subtitle, lang)} />
      <SadhanaList lang={lang} />
    </main>
  );
}

// ---------------------------------------------------------------------------
// Skeleton — calm placeholder shown while !hydrated.
// ---------------------------------------------------------------------------
function SadhanasSkeleton() {
  return (
    <main
      aria-hidden="true"
      className="mx-auto min-h-screen w-full max-w-md animate-pulse px-5 pb-28 pt-8 sm:pb-12"
    >
      <div className="mb-6">
        <div className="h-8 w-44 rounded-lg bg-line/70" />
        <div className="mt-3 h-4 w-72 rounded bg-line/50" />
      </div>
      <div className="space-y-3.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-3xl border border-hairline bg-surface p-5"
          >
            <div className="h-5 w-40 rounded bg-line/70" />
            <div className="mt-2.5 h-3 w-56 rounded bg-line/50" />
            <div className="mt-4 flex items-center justify-between">
              <div className="h-6 w-16 rounded-full bg-line/60" />
              <div className="h-3 w-14 rounded bg-line/50" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
