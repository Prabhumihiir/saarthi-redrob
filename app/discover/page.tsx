"use client";

// app/discover/page.tsx — the Discover screen route.
// Everything searchable in one place: a corpus search, intention categories,
// themed collections, per-deity browse, and a Learn group of lessons.
//
// Structure:
//   • Guard on !hydrated with a calm dark skeleton (no flash of persisted state).
//   • If no deity is chosen, gently nudge toward onboarding.
//   • Otherwise render <DiscoverScreen>, wrapped in <Suspense> because it calls
//     useSearchParams() to drive the inline collection / category views.

import { Suspense } from "react";
import Link from "next/link";
import { useSaarthi } from "@/lib/state";
import { getDeity } from "@/lib/content";
import { t, ui } from "@/lib/i18n";
import { Button, Card } from "@/components/ui";
import { Logo } from "@/components/Logo";
import { DiscoverScreen } from "@/components/discover/DiscoverScreen";
import type { Lang } from "@/lib/types";

export default function DiscoverPage() {
  const { hydrated, deityId, lang } = useSaarthi();

  // 1) Calm splash while persisted state loads — avoids any hydration mismatch.
  if (!hydrated) {
    return <DiscoverSkeleton />;
  }

  // 2) No deity chosen yet — gently invite the user to finish onboarding.
  const deity = getDeity(deityId);
  if (!deity) {
    return <FinishOnboarding lang={lang} />;
  }

  // 3) The full Discover screen. Suspense satisfies the useSearchParams() rule.
  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pb-28 pt-8 sm:pb-12">
      <Suspense fallback={<DiscoverInnerSkeleton />}>
        <DiscoverScreen lang={lang} />
      </Suspense>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Hydration splash — quiet, never flashes persisted state.
// ---------------------------------------------------------------------------
function DiscoverSkeleton() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-5 text-muted">
      <Logo size={44} className="text-saffron/70" />
      <p className="mt-4 text-sm">{t(ui.loading, "en")}…</p>
    </main>
  );
}

// A lightweight in-page fallback used while the Suspense boundary resolves.
function DiscoverInnerSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-4">
      <div className="h-9 w-40 animate-pulse rounded-lg bg-line/70" />
      <div className="h-5 w-64 animate-pulse rounded bg-line/50" />
      <div className="mt-4 h-13 w-full animate-pulse rounded-2xl bg-line/40" />
      <div className="mt-6 h-20 w-full animate-pulse rounded-3xl bg-line/30" />
      <div className="h-20 w-full animate-pulse rounded-3xl bg-line/30" />
    </div>
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
