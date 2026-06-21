"use client";

// components/discover/Collections.tsx — the themed Collections section. Each card
// shows a title and subtitle; tapping it expands inline to reveal its resolved
// practices (each linking into the session player). Expansion is local state, so
// the whole experience stays on /discover with no extra route.

import { useState } from "react";
import { collections } from "@/lib/content";
import { t } from "@/lib/i18n";
import type { Collection, Lang, Localized } from "@/lib/types";
import { ChevronIcon, CollectionIcon } from "./icons";
import { CollectionItems } from "./CollectionItems";

interface CollectionsProps {
  lang: Lang;
}

const HEADING: Localized = { en: "Collections", hi: "संग्रह" };
const SUBHEAD: Localized = {
  en: "Themed sets to move through, one practice at a time.",
  hi: "विषय-आधारित अभ्यास-समूह, एक-एक करके।",
};
const COUNT_LABEL: Localized = { en: "practices", hi: "अभ्यास" };

export function Collections({ lang }: CollectionsProps) {
  return (
    <section className="mb-9">
      <h2 className="mb-1 px-1 font-serif text-xl tracking-tight text-ink">
        {t(HEADING, lang)}
      </h2>
      <p className="mb-4 px-1 text-[13px] leading-relaxed text-muted">
        {t(SUBHEAD, lang)}
      </p>
      <ul className="space-y-3">
        {collections.map((c) => (
          <li key={c.id}>
            <CollectionCard collection={c} lang={lang} countLabel={COUNT_LABEL} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function CollectionCard({
  collection,
  lang,
  countLabel,
}: {
  collection: Collection;
  lang: Lang;
  countLabel: Localized;
}) {
  const [open, setOpen] = useState(false);
  const panelId = `collection-panel-${collection.id}`;

  return (
    <div className="overflow-hidden rounded-3xl border border-hairline bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.30),0_18px_40px_-22px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(244,236,221,0.04)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-3.5 px-5 py-4 text-left transition-colors hover:bg-surface2/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-inset"
      >
        <span
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-saffron/10 text-saffron"
        >
          <CollectionIcon size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-serif text-lg leading-snug tracking-tight text-ink">
            {t(collection.title, lang)}
          </span>
          <span className="mt-0.5 block text-[13px] leading-relaxed text-muted">
            {t(collection.subtitle, lang)}
          </span>
        </span>
        <span
          aria-hidden="true"
          className={[
            "shrink-0 text-faint transition-transform",
            open ? "rotate-90" : "",
          ].join(" ")}
        >
          <ChevronIcon size={20} />
        </span>
      </button>

      {open ? (
        <div id={panelId} className="border-t border-hairline px-4 pb-4 pt-3">
          <p className="mb-3 px-1 text-[11px] font-medium uppercase tracking-wide text-faint">
            {collection.items.length} {t(countLabel, lang)}
          </p>
          <CollectionItems collection={collection} lang={lang} />
        </div>
      ) : null}
    </div>
  );
}
