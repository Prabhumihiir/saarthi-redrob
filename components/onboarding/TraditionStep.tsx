"use client";

// components/onboarding/TraditionStep.tsx — the optional Tradition step of the
// onboarding flow. The user may name the sampradaya they follow so Saarthi can
// honour their way of practice — or skip it entirely. Selection is a single
// choice (radiogroup) that calls setTradition with one of the four values.

import type { Lang, Localized, Tradition } from "@/lib/types";

interface TraditionStepProps {
  lang: Lang;
  /** Currently chosen tradition, or null if none picked yet. */
  tradition: Tradition | null;
  onSelect: (t: Tradition) => void;
  /** Localizer bound to the live language. */
  tr: (v: Localized) => string;
}

const COPY = {
  title: { en: "Which tradition do you follow?", hi: "आप किस परंपरा का अनुसरण करते हैं?" },
  subtitle: {
    en: "So Saarthi honours your way of practice.",
    hi: "ताकि सारथी आपके अभ्यास की रीति का सम्मान कर सके।",
  },
  // Each option carries a faithful Hindi rendering of the sampradaya name.
  shaiva: { en: "Shaiva", hi: "शैव" },
  vaishnava: { en: "Vaishnava", hi: "वैष्णव" },
  shakta: { en: "Shakta", hi: "शाक्त" },
  unsure: { en: "Not sure yet", hi: "अभी निश्चित नहीं" },
} satisfies Record<string, Localized>;

const OPTIONS: { value: Tradition; label: Localized; deva?: boolean }[] = [
  { value: "shaiva", label: COPY.shaiva, deva: true },
  { value: "vaishnava", label: COPY.vaishnava, deva: true },
  { value: "shakta", label: COPY.shakta, deva: true },
  { value: "unsure", label: COPY.unsure },
];

export function TraditionStep({
  lang,
  tradition,
  onSelect,
  tr,
}: TraditionStepProps) {
  return (
    <section>
      <h2 className="font-serif text-3xl leading-tight tracking-tight text-ink">
        {tr(COPY.title)}
      </h2>
      <p className="mt-2 text-[15px] leading-relaxed text-muted">
        {tr(COPY.subtitle)}
      </p>

      <div
        role="radiogroup"
        aria-label={tr(COPY.title)}
        className="mt-6 flex flex-col gap-3"
      >
        {OPTIONS.map((opt) => {
          const selected = tradition === opt.value;
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
                  opt.deva && lang === "hi" ? "font-deva" : "font-sans",
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
