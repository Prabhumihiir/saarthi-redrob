"use client";

// components/today/QuickLinks.tsx — three calm shortcuts to continue the day:
// Meditate, Chant / Japa, and Night. Inline stroke icons, accent-tinted,
// mobile-first row of cards linking to the sub-section routes.

import Link from "next/link";
import { t } from "@/lib/i18n";
import type { Lang, Localized } from "@/lib/types";
import type { ReactNode } from "react";

interface QuickLinksProps {
  lang: Lang;
}

const HEADING: Localized = { en: "Continue your day", hi: "अपना दिन आगे बढ़ाएँ" };

interface QuickLink {
  href: string;
  label: Localized;
  sub: Localized;
  icon: ReactNode;
}

const LINKS: QuickLink[] = [
  {
    href: "/meditate",
    label: { en: "Meditate", hi: "ध्यान" },
    sub: { en: "Settle into stillness", hi: "स्थिरता में बसें" },
    icon: <LotusIcon />,
  },
  {
    href: "/chant",
    label: { en: "Chant / Japa", hi: "जप" },
    sub: { en: "Let the name carry you", hi: "नाम साथ ले चले" },
    icon: <BeadsIcon />,
  },
  {
    href: "/night",
    label: { en: "Night", hi: "रात्रि" },
    sub: { en: "End the day in peace", hi: "शांति से दिन समाप्त करें" },
    icon: <MoonIcon />,
  },
];

export function QuickLinks({ lang }: QuickLinksProps) {
  return (
    <section className="mb-2">
      <h2 className="mb-3 px-1 text-xs font-medium uppercase tracking-wide text-muted">
        {t(HEADING, lang)}
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex flex-col items-center gap-2.5 rounded-2xl border border-line bg-card px-2 py-4 text-center transition-colors hover:border-[color:var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            <span
              aria-hidden="true"
              className="grid h-11 w-11 place-items-center rounded-full bg-[color:var(--accent)]/10 text-[color:var(--accent)] transition-colors group-hover:bg-[color:var(--accent)]/15"
            >
              {link.icon}
            </span>
            <span className="text-[13px] font-semibold leading-tight text-ink">
              {t(link.label, lang)}
            </span>
            <span className="text-[11px] leading-tight text-muted">
              {t(link.sub, lang)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

// --- Inline stroke icons (currentColor) -----------------------------------

function LotusIcon() {
  return (
    <svg
      width="22"
      height="22"
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
      width="22"
      height="22"
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
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="17.3" cy="17.3" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="6.7" cy="17.3" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="6.7" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="22"
      height="22"
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
