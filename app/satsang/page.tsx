"use client";

// app/satsang/page.tsx — Satsang: practice felt together.
//
// POC STUB: this is a tasteful community placeholder. There is NO real backend,
// no networking, no other users. The presence count is computed deterministically
// on the client after mount, and shared intentions live only in local component
// state for the session (the user's latest is mirrored into the app's persisted
// `lastIntention` via setIntention, but the feed itself is ephemeral). When a
// real community layer arrives, IntentionCircle/PresenceLine are the swap points.

import Link from "next/link";
import { useSaarthi } from "@/lib/state";
import { getDeity } from "@/lib/content";
import { t, ui } from "@/lib/i18n";
import { Button, Card, ScreenHeader } from "@/components/ui";
import { Logo } from "@/components/Logo";
import { PresenceLine } from "@/components/satsang/PresenceLine";
import { IntentionCircle } from "@/components/satsang/IntentionCircle";
import type { Lang, Localized } from "@/lib/types";

const COPY = {
  title: { en: "Satsang", hi: "सत्संग" },
  subtitle: {
    en: "Practice is lighter together. Share an intention; sit in a circle.",
    hi: "साथ में अभ्यास हल्का हो जाता है। एक संकल्प साझा करें; एक वृत्त में बैठें।",
  },
} satisfies Record<string, Localized>;

export default function SatsangPage() {
  const { hydrated, deityId, lang } = useSaarthi();

  // 1) Calm splash while persisted state loads — avoids any hydration mismatch.
  if (!hydrated) {
    return <SatsangSkeleton />;
  }

  // 2) No deity chosen yet — gently invite the user to finish onboarding.
  const deity = getDeity(deityId);
  if (!deity) {
    return <FinishOnboarding lang={lang} />;
  }

  // 3) The full Satsang screen, themed to the chosen deity's accent.
  return (
    <main
      // Per-deity accent: components read --accent via Tailwind arbitrary values.
      style={{ ["--accent" as string]: deity.accent } as React.CSSProperties}
      className="mx-auto min-h-screen w-full max-w-md px-5 pb-28 pt-8 sm:pb-12"
    >
      <ScreenHeader title={t(COPY.title, lang)} subtitle={t(COPY.subtitle, lang)} />

      {/* Presence — a soft sense that others are sitting alongside you. */}
      <div className="mb-6 rounded-2xl border border-line bg-card px-4 py-3">
        <PresenceLine lang={lang} />
      </div>

      {/* The circle: compose an intention, and read recent ones. */}
      <IntentionCircle lang={lang} />
    </main>
  );
}

// ---------------------------------------------------------------------------
// Hydration splash — quiet, never flashes persisted state.
// ---------------------------------------------------------------------------
function SatsangSkeleton() {
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
  } satisfies Record<string, Localized>;

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
