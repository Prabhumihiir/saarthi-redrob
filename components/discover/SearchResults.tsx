"use client";

// components/discover/SearchResults.tsx — renders grouped, tappable result cards
// for the current query. Each card links to its destination (the session player
// for practices, /katha for stories/talks/lessons, /sadhanas/<id>, or an inline
// collection view on /discover).

import Link from "next/link";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import {
  GROUP_LABELS,
  groupResults,
  searchCorpus,
  type SearchEntry,
  type SearchGroup,
} from "./searchIndex";
import {
  ChevronIcon,
  CollectionIcon,
  FlameIcon,
  LessonIcon,
  LotusIcon,
  SadhanaIcon,
  StoryIcon,
  TalkIcon,
  VerseIcon,
} from "./icons";
import type { ReactNode } from "react";

interface SearchResultsProps {
  query: string;
  lang: Lang;
}

const GROUP_ICON: Record<SearchGroup, ReactNode> = {
  meditation: <LotusIcon size={18} />,
  shloka: <VerseIcon size={18} />,
  aarti: <FlameIcon size={18} />,
  story: <StoryIcon size={18} />,
  talk: <TalkIcon size={18} />,
  lesson: <LessonIcon size={18} />,
  collection: <CollectionIcon size={18} />,
  sadhana: <SadhanaIcon size={18} />,
};

const COPY = {
  resultsFor: { en: "Results for", hi: "के परिणाम" },
  none: {
    en: "Nothing matches that yet. Try another word, or browse below.",
    hi: "अभी इससे कुछ मेल नहीं खाता। कोई और शब्द आज़माएँ, या नीचे देखें।",
  },
  count: {
    one: { en: "result", hi: "परिणाम" },
    many: { en: "results", hi: "परिणाम" },
  },
} as const;

export function SearchResults({ query, lang }: SearchResultsProps) {
  const matches = searchCorpus(query);
  const grouped = groupResults(matches);

  return (
    <section aria-live="polite" className="mb-9">
      <h2 className="mb-1 px-1 text-xs font-medium uppercase tracking-wide text-muted">
        {t(COPY.resultsFor, lang)} “{query.trim()}”
      </h2>
      <p className="mb-4 px-1 text-xs text-faint">
        {matches.length}{" "}
        {matches.length === 1
          ? t(COPY.count.one, lang)
          : t(COPY.count.many, lang)}
      </p>

      {matches.length === 0 ? (
        <div className="rounded-2xl border border-hairline bg-surface px-5 py-6 text-center text-[15px] leading-relaxed text-muted">
          {t(COPY.none, lang)}
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(({ group, items }) => (
            <div key={group}>
              <h3 className="mb-2 flex items-center gap-2 px-1 text-[13px] font-semibold text-ink">
                <span className="text-saffron">{GROUP_ICON[group]}</span>
                {t(GROUP_LABELS[group], lang)}
                <span className="text-faint">· {items.length}</span>
              </h3>
              <ul className="space-y-2">
                {items.map((entry) => (
                  <li key={entry.id}>
                    <ResultCard entry={entry} lang={lang} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function ResultCard({ entry, lang }: { entry: SearchEntry; lang: Lang }) {
  return (
    <Link
      href={entry.href}
      className="group flex items-center gap-3 rounded-2xl border border-hairline bg-surface px-4 py-3.5 transition-colors hover:border-saffron focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
    >
      <span
        aria-hidden="true"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-saffron/10 text-saffron"
      >
        {GROUP_ICON[entry.group]}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-medium text-ink">
          {t(entry.title, lang)}
        </span>
        {entry.meta ? (
          <span className="mt-0.5 block truncate text-[13px] text-muted">
            {t(entry.meta, lang)}
          </span>
        ) : null}
      </span>
      <span
        aria-hidden="true"
        className="shrink-0 text-faint transition-colors group-hover:text-saffron"
      >
        <ChevronIcon size={18} />
      </span>
    </Link>
  );
}
