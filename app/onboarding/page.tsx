"use client";

// app/onboarding/page.tsx — the Saarthi onboarding flow.
//
// A single client-side page that walks the user through five calm steps:
//   0. Welcome    — the charioteer mark + the promise
//   1. Deity      — pick the form closest to your heart (sets state.deityId)
//   2. Language   — English / हिन्दी (sets state.lang)
//   3. Tradition  — optional sampradaya (sets state.tradition) — skippable
//   4. Sankalp    — set a daily practice time (sets state.sankalpTime),
//                   then completeOnboarding() + go to /today
//
// All copy lives inline as Localized {en, hi} objects resolved through t() with
// the live `lang` from state, so the language choice in step 2 immediately
// changes the surrounding chrome. The Nav hides itself on /onboarding routes.

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useSaarthi } from "@/lib/state";
import { t } from "@/lib/i18n";
import type { Lang, Localized, Tradition } from "@/lib/types";
import { getAvailableDeities, getComingSoonDeities } from "@/lib/content";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui";
import { StepDots } from "@/components/onboarding/StepDots";
import { DeityCard } from "@/components/onboarding/DeityCard";
import { TraditionStep } from "@/components/onboarding/TraditionStep";

// ---------------------------------------------------------------------------
// Inline localized copy for this screen only. English strings are verbatim from
// the brief; Hindi is a faithful, natural rendering of each.
// ---------------------------------------------------------------------------
const COPY = {
  // Step 0 — Welcome
  welcomeTitle: { en: "Begin your day with the divine.", hi: "अपने दिन का आरंभ दिव्यता से करें।" },
  welcomeSub: {
    en: "Saarthi is your guide — the right shloka, chant, and stillness for today, in your language. From darkness, to light.",
    hi: "सारथी आपका मार्गदर्शक है — आज के लिए सही श्लोक, जप और स्थिरता, आपकी भाषा में। तमसो मा ज्योतिर्गमय।",
  },
  begin: { en: "Begin", hi: "आरंभ करें" },

  // Step 1 — Deity
  deityTitle: { en: "Who will you walk with?", hi: "आप किसके साथ चलेंगे?" },
  deitySub: {
    en: "Choose the form closest to your heart. You can change this anytime.",
    hi: "अपने हृदय के सबसे निकट रूप को चुनें। इसे आप कभी भी बदल सकते हैं।",
  },
  comingSoon: { en: "Arriving soon.", hi: "शीघ्र आ रहे हैं।" },

  // Per-deity one-liners (override the card taglines on this screen only).
  oneLinerShiva: { en: "The stillness beneath everything.", hi: "हर वस्तु के मूल में स्थिरता।" },
  oneLinerRama: {
    en: "The path of dharma, walked with grace.",
    hi: "धर्म का मार्ग, अनुग्रह के साथ चला गया।",
  },
  oneLinerGanesha: {
    en: "Remover of obstacles, beginning of all things.",
    hi: "विघ्नों के हर्ता, सभी आरंभों के स्रोत।",
  },

  // Step 2 — Language
  langTitle: { en: "In which tongue does your heart pray?", hi: "आपका हृदय किस भाषा में प्रार्थना करता है?" },
  langEnglish: { en: "English", hi: "English" },
  langHindi: { en: "हिन्दी", hi: "हिन्दी" },

  // Step 4 — Sankalp
  sankalpTitle: { en: "When will you sit each day?", hi: "आप प्रतिदिन कब बैठेंगे?" },
  sankalpSub: {
    en: "A small daily vow. We'll keep the time for you.",
    hi: "एक छोटा दैनिक संकल्प। हम यह समय आपके लिए संजोकर रखेंगे।",
  },
  sankalpFieldLabel: { en: "Daily practice time", hi: "दैनिक अभ्यास का समय" },
  makeSankalp: { en: "Make my sankalp", hi: "मेरा संकल्प तय करें" },

  // Navigation chrome
  back: { en: "Back", hi: "पीछे" },
  next: { en: "Continue", hi: "आगे बढ़ें" },
  skip: { en: "Skip", hi: "छोड़ें" },
} satisfies Record<string, Localized>;

// Per-deity one-liners keyed by deity id, used on the deity step only.
const DEITY_ONE_LINERS: Record<string, Localized> = {
  shiva: COPY.oneLinerShiva,
  rama: COPY.oneLinerRama,
  ganesha: COPY.oneLinerGanesha,
};

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const {
    hydrated,
    lang,
    deityId,
    tradition,
    sankalpTime,
    setDeity,
    setLang,
    setTradition,
    setSankalpTime,
    completeOnboarding,
  } = useSaarthi();

  const [step, setStep] = useState(0);

  // Resolve a localized string with the live language.
  const tr = (v: Localized) => t(v, lang);

  const available = useMemo(() => getAvailableDeities(), []);
  const comingSoon = useMemo(() => getComingSoonDeities(), []);

  // Default the time field to 06:30 until the user sets their own sankalp.
  const timeValue = sankalpTime ?? "06:30";

  // -------------------------------------------------------------------------
  // Pre-hydration skeleton — calm dark splash, avoids hydration mismatch.
  // -------------------------------------------------------------------------
  if (!hydrated) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-bg px-6">
        <div className="flex flex-col items-center gap-4 text-saffron/70">
          <Logo size={56} className="animate-breathe" />
          <span className="sr-only">{tr(COPY.begin)}</span>
        </div>
      </main>
    );
  }

  // Each step gates the Continue button until its choice is made. The Tradition
  // step (3) is optional, so it never gates and offers a Skip affordance.
  const canAdvance =
    step === 1 ? Boolean(deityId) : step === 4 ? Boolean(timeValue) : true;

  const isLastStep = step === TOTAL_STEPS - 1;

  function finish() {
    // Persist the default time if the user passed the sankalp step untouched.
    if (!sankalpTime) {
      setSankalpTime(timeValue);
    }
    completeOnboarding();
    router.push("/today");
  }

  function handleNext() {
    if (isLastStep) {
      finish();
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  // Tradition step is optional — advancing without a choice simply moves on.
  function handleSkip() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  const onTraditionStep = step === 3;

  return (
    <main className="flex min-h-dvh flex-col bg-bg">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-8 pt-10">
        {/* Step indicator — hidden on the welcome step for a cleaner first screen. */}
        {step > 0 ? (
          <div className="mb-8">
            <StepDots
              total={TOTAL_STEPS - 1}
              current={step - 1}
              label={tr({
                en: `Step ${step} of ${TOTAL_STEPS - 1}`,
                hi: `चरण ${step} / ${TOTAL_STEPS - 1}`,
              })}
            />
          </div>
        ) : null}

        {/* ------------------------------------------------------------------ */}
        {/* Step body                                                          */}
        {/* ------------------------------------------------------------------ */}
        <div className="flex flex-1 flex-col">
          {step === 0 ? (
            <WelcomeStep tr={tr} />
          ) : step === 1 ? (
            <DeityStep
              lang={lang}
              deityId={deityId}
              onSelect={setDeity}
              available={available}
              comingSoon={comingSoon}
              tr={tr}
            />
          ) : step === 2 ? (
            <LanguageStep lang={lang} onSelect={setLang} tr={tr} />
          ) : step === 3 ? (
            <TraditionStep
              lang={lang}
              tradition={tradition}
              onSelect={setTradition}
              tr={tr}
            />
          ) : (
            <SankalpStep value={timeValue} onChange={setSankalpTime} tr={tr} />
          )}
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Navigation                                                         */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-8 flex items-center gap-3">
          {step > 0 ? (
            <Button
              variant="ghost"
              size="lg"
              onClick={handleBack}
              aria-label={tr(COPY.back)}
            >
              {tr(COPY.back)}
            </Button>
          ) : null}

          {/* Tradition is optional — offer a quiet skip alongside Continue. */}
          {onTraditionStep ? (
            <Button
              variant="outline"
              size="lg"
              onClick={handleSkip}
              aria-label={tr(COPY.skip)}
            >
              {tr(COPY.skip)}
            </Button>
          ) : null}

          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={handleNext}
            disabled={!canAdvance}
          >
            {step === 0
              ? tr(COPY.begin)
              : isLastStep
                ? tr(COPY.makeSankalp)
                : tr(COPY.next)}
          </Button>
        </div>
      </div>
    </main>
  );
}

// ===========================================================================
// Step views
// ===========================================================================

type Tr = (v: Localized) => string;

function WelcomeStep({ tr }: { tr: Tr }) {
  return (
    <section className="relative flex flex-1 flex-col items-center justify-center text-center">
      {/* Faint saffron glow behind the mark — the lamp catching the dark. */}
      <div
        aria-hidden="true"
        className="glow-saffron pointer-events-none absolute inset-0"
      />

      <div className="relative text-saffron">
        <Logo size={72} className="animate-breathe" />
      </div>

      <h1 className="relative mt-8 max-w-sm font-serif text-4xl leading-tight tracking-tight text-ink">
        {tr(COPY.welcomeTitle)}
      </h1>

      <p className="relative mt-5 max-w-sm text-[15px] leading-relaxed text-muted">
        {tr(COPY.welcomeSub)}
      </p>
    </section>
  );
}

function DeityStep({
  lang,
  deityId,
  onSelect,
  available,
  comingSoon,
  tr,
}: {
  lang: Lang;
  deityId: string | null;
  onSelect: (id: string) => void;
  available: ReturnType<typeof getAvailableDeities>;
  comingSoon: ReturnType<typeof getComingSoonDeities>;
  tr: Tr;
}) {
  return (
    <section>
      <h2 className="font-serif text-3xl leading-tight tracking-tight text-ink">
        {tr(COPY.deityTitle)}
      </h2>
      <p className="mt-2 text-[15px] leading-relaxed text-muted">
        {tr(COPY.deitySub)}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {available.map((deity) => (
          <DeityCard
            key={deity.id}
            deity={deity}
            lang={lang}
            selected={deity.id === deityId}
            descriptor={DEITY_ONE_LINERS[deity.id]}
            onSelect={onSelect}
          />
        ))}
      </div>

      {/* Coming-soon grid — dimmed, non-selectable; signals the corpus scales. */}
      {comingSoon.length > 0 ? (
        <div className="mt-9">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
            {tr(COPY.comingSoon)}
          </h3>
          <div className="mt-3 grid grid-cols-3 gap-2.5">
            {comingSoon.map((deity) => (
              <DeityCard
                key={deity.id}
                deity={deity}
                lang={lang}
                comingSoon
                comingSoonLabel={COPY.comingSoon}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function LanguageStep({
  lang,
  onSelect,
  tr,
}: {
  lang: Lang;
  onSelect: (l: Lang) => void;
  tr: Tr;
}) {
  const options: { value: Lang; label: Localized }[] = [
    { value: "en", label: COPY.langEnglish },
    { value: "hi", label: COPY.langHindi },
  ];

  return (
    <section>
      <h2 className="font-serif text-3xl leading-tight tracking-tight text-ink">
        {tr(COPY.langTitle)}
      </h2>

      <div
        role="radiogroup"
        aria-label={tr(COPY.langTitle)}
        className="mt-6 flex flex-col gap-3"
      >
        {options.map((opt) => {
          const selected = lang === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(opt.value)}
              className={[
                "flex items-center justify-between rounded-3xl border bg-card px-5 py-4 text-left transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                selected
                  ? "border-saffron shadow-[0_8px_24px_-14px_rgba(232,132,60,0.5)]"
                  : "border-hairline hover:border-saffron/50",
              ].join(" ")}
            >
              <span
                className={[
                  "text-lg font-semibold text-ink",
                  opt.value === "hi" ? "font-deva" : "font-sans",
                ].join(" ")}
              >
                {tr(opt.label)}
              </span>

              <span
                aria-hidden="true"
                className={[
                  "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors",
                  selected
                    ? "border-saffron bg-saffron text-white"
                    : "border-hairline bg-transparent text-transparent",
                ].join(" ")}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 6.2 L4.8 8.5 L9.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function SankalpStep({
  value,
  onChange,
  tr,
}: {
  value: string;
  onChange: (time: string) => void;
  tr: Tr;
}) {
  return (
    <section>
      <h2 className="font-serif text-3xl leading-tight tracking-tight text-ink">
        {tr(COPY.sankalpTitle)}
      </h2>
      <p className="mt-2 text-[15px] leading-relaxed text-muted">
        {tr(COPY.sankalpSub)}
      </p>

      <div className="mt-8 flex flex-col items-center">
        <label htmlFor="sankalp-time" className="text-sm font-medium text-muted">
          {tr(COPY.sankalpFieldLabel)}
        </label>
        <input
          id="sankalp-time"
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-3 rounded-3xl border border-hairline bg-card px-6 py-4 text-center font-serif text-4xl tracking-tight text-ink [color-scheme:dark] focus-visible:border-saffron focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        />
      </div>
    </section>
  );
}
