"use client";

// components/today/AskSaarthi.tsx — the home-screen chatbot entry point.
//
// A compact "Ask Saarthi" composer that lives on Today and links into the full
// Companion (/companion). It frames Saarthi's two on-demand modes — an
// information provider AND a verse dictator — and hands the user's question off
// to the Companion via the ?seed= deep-link, which auto-sends it. Keeping a
// single real chat surface (the Companion + /api/companion) means this is a
// launcher, not a second chat implementation.

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui";
import { Logo } from "@/components/Logo";
import { t } from "@/lib/i18n";
import type { Lang, Localized } from "@/lib/types";

const copy = {
  label: { en: "Ask Saarthi", hi: "सारथी से पूछें" } as Localized,
  intro: {
    en: "Ask for guidance, or ask for a verse — Saarthi gives whatever you need.",
    hi: "मार्गदर्शन माँगें, या कोई श्लोक माँगें — सारथी वही देता है जो आपको चाहिए।",
  } as Localized,
  placeholder: {
    en: "Ask anything, or ask for a verse…",
    hi: "कुछ भी पूछें, या कोई श्लोक माँगें…",
  } as Localized,
  open: { en: "Ask", hi: "पूछें" } as Localized,
};

// Quick prompts that demonstrate both modes: recitation (verse dictator) and
// explanation (information provider). Each routes into the Companion pre-seeded.
const chips: { label: Localized; seed: Localized }[] = [
  {
    label: { en: "Recite a verse", hi: "एक श्लोक सुनाइए" },
    seed: {
      en: "Recite a short verse I can hold in my heart today — give the Devanagari, transliteration, and a plain meaning.",
      hi: "आज मन में धारण करने योग्य एक छोटा श्लोक सुनाइए — देवनागरी, लिप्यंतरण और सरल अर्थ सहित।",
    },
  },
  {
    label: { en: "Explain a teaching", hi: "एक शिक्षा समझाइए" },
    seed: {
      en: "Share a short teaching for today and how it meets daily life.",
      hi: "आज के लिए एक छोटी शिक्षा और वह दैनिक जीवन से कैसे जुड़ती है, बताइए।",
    },
  },
  {
    label: { en: "A mantra for calm", hi: "शांति का मंत्र" },
    seed: {
      en: "Give me a mantra for calm — Devanagari, transliteration, and meaning.",
      hi: "शांति के लिए एक मंत्र दीजिए — देवनागरी, लिप्यंतरण और अर्थ सहित।",
    },
  },
];

export function AskSaarthi({ lang }: { lang: Lang }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const tr = (v: Localized) => t(v, lang);

  // Hand the query to the Companion, which auto-sends it via ?seed=.
  function go(seed: string) {
    const s = seed.trim();
    if (!s) return;
    router.push(`/companion?seed=${encodeURIComponent(s)}`);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    go(value);
  }

  return (
    <section className="mt-6">
      <Card className="bg-[color:var(--accent)]/[0.04] border-[color:var(--accent)]/20">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[color:var(--accent)]/12 text-[color:var(--accent)]">
            <Logo size={20} />
          </span>
          <div>
            <h2 className="font-serif text-lg leading-tight tracking-tight text-ink">
              {tr(copy.label)}
            </h2>
          </div>
        </div>

        <p className="mt-2.5 text-[14px] leading-relaxed text-muted">
          {tr(copy.intro)}
        </p>

        {/* Dual-mode quick prompts — recitation and explanation. */}
        <div className="mt-3 flex flex-wrap gap-2">
          {chips.map((c, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(tr(c.seed))}
              className="rounded-full border border-[color:var(--accent)]/25 bg-card px-3 py-1.5 text-[13px] font-medium text-ink transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            >
              {tr(c.label)}
            </button>
          ))}
        </div>

        {/* Composer — routes the typed question into the Companion. */}
        <form onSubmit={onSubmit} className="mt-3.5 flex items-center gap-2">
          <label htmlFor="ask-saarthi-input" className="sr-only">
            {tr(copy.placeholder)}
          </label>
          <input
            id="ask-saarthi-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={tr(copy.placeholder)}
            className="h-11 flex-1 rounded-full border border-line bg-card px-4 text-[15px] text-ink placeholder:text-muted/70 focus-visible:border-[color:var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          />
          <button
            type="submit"
            disabled={!value.trim()}
            aria-label={tr(copy.open)}
            title={tr(copy.open)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[color:var(--accent)] text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-40"
          >
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
            >
              <path d="M5 12h13" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </Card>
    </section>
  );
}
