"use client";

// components/profile/PlusCard.tsx — the "Saarthi Plus" membership card and the
// "Gift Saarthi" card.
//
// TODO: stub — non-functional. No real payment, subscription, trial, or gifting
// is wired up. Each call to action surfaces only a gentle, transient
// "Coming soon" state. The daily morning practice is, and stays, free.

import { useState } from "react";
import type { Lang, Localized } from "@/lib/types";
import { t } from "@/lib/i18n";
import { Card, Badge } from "@/components/ui";
import { Logo } from "@/components/Logo";

interface PlusCardProps {
  lang: Lang;
}

// English strings are verbatim from the brief; Hindi is a faithful, natural
// rendering. No fear, no guilt — an open invitation.
const copy = {
  // Saarthi Plus
  plusName: { en: "Saarthi Plus", hi: "सारथी प्लस" },
  plusHeading: {
    en: "Go deeper with Saarthi.",
    hi: "सारथी के साथ और गहरे उतरें।",
  },
  plusSub: {
    en: "The daily practice is always free. Plus opens everything else.",
    hi: "दैनिक अभ्यास सदा निःशुल्क है। प्लस बाकी सब कुछ खोल देता है।",
  },
  socialProof: {
    en: "Join those beginning each day with Saarthi.",
    hi: "उनके साथ जुड़ें जो हर दिन की शुरुआत सारथी से करते हैं।",
  },
  trial: { en: "Begin with 7 days free.", hi: "7 दिन निःशुल्क से आरंभ करें।" },
  price: {
    en: "Then ₹999/year. Cancel anytime, keep your streak.",
    hi: "फिर ₹999/वर्ष। कभी भी रद्द करें, अपनी निरंतरता बनाए रखें।",
  },
  cta: { en: "Start my 7 days free", hi: "मेरे 7 निःशुल्क दिन आरंभ करें" },
  ctaFooter: {
    en: "No pressure, ever. The morning practice stays free.",
    hi: "कभी कोई दबाव नहीं। सुबह का अभ्यास निःशुल्क ही रहेगा।",
  },

  comingSoon: { en: "Coming soon", hi: "जल्द आ रहा है" },
} satisfies Record<string, Localized>;

// Plus benefits — verbatim English bullets, faithful Hindi. Kept separate from
// `copy` so it can stay a string[] without loosening the Localized typing above.
const BULLETS: Record<Lang, string[]> = {
  en: [
    "Every deity and tradition — not only the one you chose.",
    "A growing library of guided shlokas, meditations, and kathas.",
    "Unlimited time with your companion.",
    "Download for the journey — practice offline, anywhere.",
    "Your whole family, on one plan.",
  ],
  hi: [
    "हर देवता और हर परंपरा — केवल वही नहीं जिसे आपने चुना।",
    "मार्गदर्शित श्लोक, ध्यान और कथाओं का निरंतर बढ़ता संग्रह।",
    "अपने सहचर के साथ असीमित समय।",
    "यात्रा के लिए डाउनलोड करें — कहीं भी, ऑफ़लाइन अभ्यास करें।",
    "आपका पूरा परिवार, एक ही योजना पर।",
  ],
};

export function PlusCard({ lang }: PlusCardProps) {
  // Tracks whether the (stub) CTA was tapped, to show a gentle "Coming soon".
  const [pinged, setPinged] = useState(false);

  // TODO: stub — non-functional. Replace with real trial / checkout.
  const ping = () => {
    setPinged(true);
    window.setTimeout(() => setPinged(false), 2400);
  };

  return (
    <Card
      as="section"
      aria-labelledby="plus-heading"
      // Warm gold-tinted surface to set the premium tier apart, quietly.
      className="border-gold/30 bg-gradient-to-b from-gold/[0.08] to-card"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold/15 text-gold"
        >
          <Logo size={26} />
        </span>
        <Badge tone="gold">{t(copy.plusName, lang)}</Badge>
      </div>

      <h2
        id="plus-heading"
        className="mt-4 font-serif text-2xl leading-tight tracking-tight text-ink"
      >
        {t(copy.plusHeading, lang)}
      </h2>
      <p className="mt-1.5 text-[15px] leading-relaxed text-muted">
        {t(copy.plusSub, lang)}
      </p>

      {/* What Plus opens. */}
      <ul className="mt-5 space-y-3">
        {BULLETS[lang].map((bullet) => (
          <li key={bullet} className="flex items-start gap-2.5 text-[15px] text-ink">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 shrink-0 text-gold"
              aria-hidden="true"
            >
              <path d="M5 12.5l4 4 10-10" />
            </svg>
            <span className="leading-relaxed">{bullet}</span>
          </li>
        ))}
      </ul>

      {/* Social proof. */}
      <p className="mt-5 text-sm leading-relaxed text-muted">
        {t(copy.socialProof, lang)}
      </p>

      {/* Trial + price. */}
      <div className="mt-4 rounded-2xl border border-gold/25 bg-gold/[0.06] px-4 py-3.5">
        <p className="font-serif text-lg leading-snug tracking-tight text-gold">
          {t(copy.trial, lang)}
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">
          {t(copy.price, lang)}
        </p>
      </div>

      {/* CTA — non-functional stub; shows "Coming soon" on tap. */}
      <button
        type="button"
        onClick={ping}
        aria-label={t(copy.cta, lang)}
        aria-live="polite"
        className={[
          "mt-4 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full px-6 text-base font-medium transition-colors",
          "bg-gold text-white hover:brightness-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-card",
        ].join(" ")}
      >
        {pinged ? t(copy.comingSoon, lang) : t(copy.cta, lang)}
      </button>

      {/* Reassurance footer. */}
      <p className="mt-3 text-center text-xs leading-relaxed text-faint">
        {t(copy.ctaFooter, lang)}
      </p>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Gift Saarthi — a small, warm card to gift a year. Stub.
// ---------------------------------------------------------------------------

const giftCopy = {
  line: {
    en: "Give someone their mornings. Gift a year of Saarthi.",
    hi: "किसी को उसकी सुबहें भेंट करें। सारथी का एक वर्ष उपहार दें।",
  },
  cta: { en: "Gift Saarthi", hi: "सारथी उपहार दें" },
  comingSoon: { en: "Coming soon", hi: "जल्द आ रहा है" },
} satisfies Record<string, Localized>;

export function GiftCard({ lang }: PlusCardProps) {
  const [pinged, setPinged] = useState(false);

  // TODO: stub — non-functional. Replace with real gifting flow.
  const ping = () => {
    setPinged(true);
    window.setTimeout(() => setPinged(false), 2400);
  };

  return (
    <Card as="section" aria-labelledby="gift-heading">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-saffron/12 text-saffron"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 12v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8M2 8h20v4H2zM12 8v13M12 8S10.5 4 8.5 4a2 2 0 0 0 0 4M12 8s1.5-4 3.5-4a2 2 0 0 1 0 4" />
          </svg>
        </span>
        <p
          id="gift-heading"
          className="font-serif text-lg leading-snug tracking-tight text-ink"
        >
          {t(giftCopy.line, lang)}
        </p>
      </div>

      {/* Gift — non-functional stub. */}
      <button
        type="button"
        onClick={ping}
        aria-label={t(giftCopy.cta, lang)}
        aria-live="polite"
        className={[
          "mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-saffron/40 bg-saffron/[0.08] px-5 text-[15px] font-medium text-saffron transition-colors",
          "hover:bg-saffron/[0.14]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-card",
        ].join(" ")}
      >
        {pinged ? t(giftCopy.comingSoon, lang) : t(giftCopy.cta, lang)}
      </button>
    </Card>
  );
}
