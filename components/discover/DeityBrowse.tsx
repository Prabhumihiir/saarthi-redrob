"use client";

// components/discover/DeityBrowse.tsx — browse the whole library by deity. Each
// available deity is a card themed to its own accent, linking to /practice. The
// deity the user currently walks with is marked. Coming-soon deities appear as
// quiet, locked cards (not links).

import Link from "next/link";
import { getAvailableDeities, getComingSoonDeities } from "@/lib/content";
import { t, ui } from "@/lib/i18n";
import type { Deity, Lang, Localized } from "@/lib/types";
import { ChevronIcon, LockIcon } from "./icons";

interface DeityBrowseProps {
  lang: Lang;
  /** The deity the user chose at onboarding (highlighted), if any. */
  currentDeityId: string | null;
}

const HEADING: Localized = { en: "Browse by deity", hi: "देवता अनुसार देखें" };
const SUBHEAD: Localized = {
  en: "Sit with the one you walk with, or explore another.",
  hi: "जिनके साथ आप चलते हैं उनके साथ बैठें, या किसी अन्य को जानें।",
};
const YOURS: Localized = { en: "Your guide", hi: "आपके मार्गदर्शक" };

export function DeityBrowse({ lang, currentDeityId }: DeityBrowseProps) {
  const available = getAvailableDeities();
  const soon = getComingSoonDeities();

  return (
    <section className="mb-9">
      <h2 className="mb-1 px-1 font-serif text-xl tracking-tight text-ink">
        {t(HEADING, lang)}
      </h2>
      <p className="mb-4 px-1 text-[13px] leading-relaxed text-muted">
        {t(SUBHEAD, lang)}
      </p>

      <ul className="grid grid-cols-2 gap-3">
        {available.map((deity) => (
          <li
            key={deity.id}
            style={{ ["--accent" as string]: deity.accent }}
          >
            <Link
              href="/practice"
              className="group flex h-full flex-col rounded-3xl border border-hairline bg-surface p-4 transition-colors hover:border-[color:var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            >
              <div className="mb-3 flex items-center justify-between">
                <span
                  aria-hidden="true"
                  className="grid h-11 w-11 place-items-center rounded-full bg-[color:var(--accent)]/12 font-deva text-xl text-[color:var(--accent)]"
                >
                  {deity.devanagariName.slice(0, 1)}
                </span>
                {currentDeityId === deity.id ? (
                  <span className="rounded-full bg-[color:var(--accent)]/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--accent)]">
                    {t(YOURS, lang)}
                  </span>
                ) : null}
              </div>
              <span className="font-serif text-lg leading-tight tracking-tight text-ink">
                {t(deity.name, lang)}
              </span>
              <span className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-muted">
                {t(deity.tagline, lang)}
              </span>
              <span
                aria-hidden="true"
                className="mt-3 inline-flex items-center gap-1 text-[color:var(--accent)] opacity-0 transition-opacity group-hover:opacity-100"
              >
                <ChevronIcon size={16} />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {soon.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {soon.map((deity) => (
            <ComingSoonChip key={deity.id} deity={deity} lang={lang} />
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function ComingSoonChip({ deity, lang }: { deity: Deity; lang: Lang }) {
  return (
    <li>
      <span
        aria-disabled="true"
        title={t(ui.comingSoon, lang)}
        className="inline-flex cursor-default items-center gap-1.5 rounded-full border border-hairline bg-surface2/60 px-3 py-1.5 text-[13px] font-medium text-faint"
      >
        <LockIcon size={13} />
        {t(deity.name, lang)}
      </span>
    </li>
  );
}
