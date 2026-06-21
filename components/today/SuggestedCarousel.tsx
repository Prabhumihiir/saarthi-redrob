"use client";

// components/today/SuggestedCarousel.tsx — a horizontal, swipeable row of a few
// suggested practices for the day: a meditation, a chant/japa, the night
// prayer, and a themed collection. Each card links to the right destination
// (the session player, /chant, /night, or /discover). Tasteful dark cards,
// accent-tinted, sized for the thumb.

import Link from "next/link";
import { t } from "@/lib/i18n";
import type { Deity, Lang, Localized } from "@/lib/types";
import type { ReactNode } from "react";

interface SuggestedCarouselProps {
  deity: Deity;
  lang: Lang;
}

const HEADING: Localized = {
  en: "Suggested for you",
  hi: "आपके लिए सुझाव",
};

interface Suggestion {
  href: string;
  kicker: Localized;
  title: Localized;
  meta: Localized;
  icon: ReactNode;
}

export function SuggestedCarousel({ deity, lang }: SuggestedCarouselProps) {
  const suggestions = buildSuggestions(deity);

  return (
    <section className="mb-6">
      <h2 className="mb-3 px-1 text-xs font-medium uppercase tracking-wide text-muted">
        {t(HEADING, lang)}
      </h2>

      {/* Horizontal scroller. Edge padding via px + negative margin so the row
          bleeds to the screen edge but cards align with the column. */}
      <div className="-mx-5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul className="flex gap-3">
          {suggestions.map((s, i) => (
            <li key={i} className="shrink-0">
              <Link
                href={s.href}
                className="group flex h-full w-[150px] flex-col rounded-3xl border border-hairline bg-surface p-4 transition-colors hover:border-[color:var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                <span
                  aria-hidden="true"
                  className="grid h-10 w-10 place-items-center rounded-full bg-[color:var(--accent)]/10 text-[color:var(--accent)] transition-colors group-hover:bg-[color:var(--accent)]/15"
                >
                  {s.icon}
                </span>
                <span className="mt-3.5 text-[11px] font-medium uppercase tracking-wide text-[color:var(--accent)]">
                  {t(s.kicker, lang)}
                </span>
                <span className="mt-1 font-serif text-[15px] leading-snug tracking-tight text-ink">
                  {t(s.title, lang)}
                </span>
                <span className="mt-auto pt-2 text-[12px] text-muted">
                  {t(s.meta, lang)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Build 3–4 suggestions tailored to the chosen deity's available content. */
function buildSuggestions(deity: Deity): Suggestion[] {
  const out: Suggestion[] = [];

  // 1) Today's meditation — first meditation if present.
  const med = deity.meditations[0];
  if (med) {
    out.push({
      href: `/session?kind=meditation&deity=${deity.id}&item=${med.id}`,
      kicker: { en: "Meditation", hi: "ध्यान" },
      title: med.title,
      meta: {
        en: `${med.minutes} min`,
        hi: `${med.minutes} मिनट`,
      },
      icon: <LotusIcon />,
    });
  }

  // 2) Chant / Japa — let the name carry you.
  out.push({
    href: "/chant",
    kicker: { en: "Japa", hi: "जप" },
    title: { en: "Repeat the name", hi: "नाम का जप" },
    meta: { en: "Let it carry you", hi: "इसे साथ ले चलने दें" },
    icon: <BeadsIcon />,
  });

  // 3) Night prayer — if the deity has one.
  if (deity.nightPrayer) {
    out.push({
      href: "/night",
      kicker: { en: "Night", hi: "रात्रि" },
      title: { en: "End the day in peace", hi: "शांति से दिन समाप्त करें" },
      meta: { en: "A prayer before sleep", hi: "सोने से पूर्व प्रार्थना" },
      icon: <MoonIcon />,
    });
  }

  // 4) A collection to explore.
  out.push({
    href: "/discover",
    kicker: { en: "Collection", hi: "संग्रह" },
    title: { en: "A quiet mind", hi: "शांत मन" },
    meta: { en: "Practices to settle", hi: "शांत होने के अभ्यास" },
    icon: <StackIcon />,
  });

  return out;
}

// --- Inline stroke icons (currentColor) -----------------------------------

function LotusIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 4c1.8 2.2 1.8 5.5 0 8-1.8-2.5-1.8-5.8 0-8Z" />
      <path d="M12 12c-1.6-1.4-3.9-1.7-6-.8 0 3 2.6 5.3 6 5.3" />
      <path d="M12 12c1.6-1.4 3.9-1.7 6-.8 0 3-2.6 5.3-6 5.3" />
      <path d="M5 17c2 1.6 4.4 2.4 7 2.4s5-.8 7-2.4" />
    </svg>
  );
}

function BeadsIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="4.5" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="19.5" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="19.5" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5Z" />
    </svg>
  );
}

function StackIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 3 8l9 5 9-5-9-5Z" />
      <path d="M3 13l9 5 9-5" />
    </svg>
  );
}
