"use client";

// components/discover/CollectionItems.tsx — renders the resolved practices of a
// collection as a list of tappable cards linking into the session player. Shared
// by the inline collection expander and the focused collection / category view.

import Link from "next/link";
import { resolvePractice } from "@/lib/content";
import { t } from "@/lib/i18n";
import type { Collection, Lang, PracticeKind, PracticeRef } from "@/lib/types";
import { ChevronIcon, FlameIcon, LotusIcon, VerseIcon } from "./icons";
import { sessionHref } from "./destinations";
import type { ReactNode } from "react";

interface CollectionItemsProps {
  collection: Collection;
  lang: Lang;
}

const KIND_LABEL: Record<PracticeKind, { en: string; hi: string }> = {
  meditation: { en: "Meditation", hi: "ध्यान" },
  shloka: { en: "Shloka", hi: "श्लोक" },
  aarti: { en: "Aarti", hi: "आरती" },
  night: { en: "Night prayer", hi: "रात्रि प्रार्थना" },
  japa: { en: "Japa", hi: "जप" },
};

function kindIcon(kind: PracticeKind): ReactNode {
  if (kind === "shloka" || kind === "aarti" || kind === "night")
    return <VerseIcon size={16} />;
  if (kind === "meditation") return <LotusIcon size={16} />;
  return <FlameIcon size={16} />;
}

export function CollectionItems({ collection, lang }: CollectionItemsProps) {
  return (
    <ul className="space-y-2">
      {collection.items.map((ref, i) => (
        <PracticeItem key={`${collection.id}-${i}`} refItem={ref} lang={lang} />
      ))}
    </ul>
  );
}

function PracticeItem({ refItem, lang }: { refItem: PracticeRef; lang: Lang }) {
  const resolved = resolvePractice(refItem);
  // Defensive: skip refs that can't resolve rather than rendering a broken row.
  if (!resolved) return null;

  return (
    <li style={{ ["--accent" as string]: resolved.deityAccent }}>
      <Link
        href={sessionHref(refItem.kind, refItem.deityId, refItem.itemId)}
        className="group flex items-center gap-3 rounded-2xl border border-hairline bg-surface2 px-4 py-3 transition-colors hover:border-[color:var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        <span
          aria-hidden="true"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[color:var(--accent)]/12 text-[color:var(--accent)]"
        >
          {kindIcon(refItem.kind)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-medium text-ink">
            {t(resolved.title, lang)}
          </span>
          <span className="mt-0.5 block truncate text-[13px] text-muted">
            {t(resolved.deityName, lang)} ·{" "}
            {t(KIND_LABEL[refItem.kind], lang)}
            {resolved.minutes ? ` · ${resolved.minutes} min` : ""}
          </span>
        </span>
        <span
          aria-hidden="true"
          className="shrink-0 text-faint transition-colors group-hover:text-[color:var(--accent)]"
        >
          <ChevronIcon size={18} />
        </span>
      </Link>
    </li>
  );
}
