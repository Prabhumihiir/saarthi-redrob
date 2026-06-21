"use client";

// app/chant/page.tsx — the Chant / Japa screen.
// A focused, meditative space for repeating one name 108 times: a 108-bead
// japa counter with a large tap target and a gold completion at the full mala,
// plus an optional ambient chant loop. Themed to the chosen deity's accent.

import Link from "next/link";
import { useSaarthi } from "@/lib/state";
import { getDeity } from "@/lib/content";
import { t, ui } from "@/lib/i18n";
import { Button, Card, ScreenHeader } from "@/components/ui";
import { Logo } from "@/components/Logo";
import { JapaCounter } from "@/components/chant/JapaCounter";
import { ChantLoops } from "@/components/chant/ChantLoops";
import type { Lang, Localized } from "@/lib/types";

const HEADER = {
  title: { en: "Japa", hi: "जप" },
  subtitle: {
    en: "One name, one breath, one hundred and eight times. Let the count fall away.",
    hi: "एक नाम, एक श्वास, एक सौ आठ बार। गिनती को छूट जाने दें।",
  },
} satisfies Record<string, Localized>;

export default function ChantPage() {
  const { hydrated, deityId, lang } = useSaarthi();

  // 1) Calm splash while persisted state loads — avoids any hydration mismatch.
  if (!hydrated) {
    return <ChantSkeleton />;
  }

  // 2) No deity chosen yet — gently invite the user to finish onboarding.
  const deity = getDeity(deityId);
  if (!deity) {
    return <FinishOnboarding lang={lang} />;
  }

  // The name being repeated: the deity's first shloka (its core name/mantra),
  // falling back to the deity's own name when no shloka is seeded.
  const chantName: Localized = deity.shlokas[0]?.title ?? deity.name;

  // 3) The full Chant screen, themed to the chosen deity's accent.
  return (
    <main
      style={{ ["--accent" as string]: deity.accent }}
      className="mx-auto min-h-screen w-full max-w-md px-5 pb-28 pt-8 sm:pb-12"
    >
      <ScreenHeader title={t(HEADER.title, lang)} subtitle={t(HEADER.subtitle, lang)} />

      <section className="mb-10 mt-2">
        <JapaCounter lang={lang} name={chantName} />
      </section>

      <ChantLoops lang={lang} />
    </main>
  );
}

// ---------------------------------------------------------------------------
// Hydration splash — quiet, never flashes persisted state.
// ---------------------------------------------------------------------------
function ChantSkeleton() {
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
    title: { en: "Choose who to chant with", hi: "किसके साथ जप करें, चुनें" },
    body: {
      en: "Pick a deity to walk with, and the japa will carry their name. It takes less than a minute.",
      hi: "साथ चलने के लिए एक देवता चुनें, और जप उन्हीं का नाम लेकर चलेगा। इसमें एक मिनट से भी कम लगेगा।",
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
