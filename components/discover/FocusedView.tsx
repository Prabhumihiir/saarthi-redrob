"use client";

// components/discover/FocusedView.tsx — the inline "detail" surfaced when the URL
// carries ?collection=<id> or ?category=<id>. It shows one themed set of practices
// with a clear back link to the full Discover index. Categories are mapped to the
// collection that best serves that intention, so a tap always lands on real,
// playable content. Everything stays on /discover (query-param driven).

import Link from "next/link";
import { getCollection } from "@/lib/content";
import { t } from "@/lib/i18n";
import type { Collection, Lang, Localized } from "@/lib/types";
import { ChevronIcon } from "./icons";
import { CollectionItems } from "./CollectionItems";

interface FocusedViewProps {
  /** Exactly one of these is set by the page. */
  collectionId: string | null;
  categoryId: string | null;
  lang: Lang;
}

/** Map an intention category to the collection that best serves it. */
const CATEGORY_TO_COLLECTION: Record<string, string> = {
  calm: "calm",
  focus: "focus",
  "before-an-exam": "focus", // a clear, steady mind before the moment
  courage: "courage",
  gratitude: "gratitude",
  // "sleep" links to /night directly and never reaches this view.
};

const BACK_LABEL: Localized = { en: "All of Discover", hi: "संपूर्ण खोज" };
const NOT_FOUND: Localized = {
  en: "That set isn't here. Browse everything instead.",
  hi: "वह समूह यहाँ नहीं है। इसके बजाय सब कुछ देखें।",
};

export function FocusedView({
  collectionId,
  categoryId,
  lang,
}: FocusedViewProps) {
  const resolvedCollectionId =
    collectionId ??
    (categoryId ? CATEGORY_TO_COLLECTION[categoryId] ?? null : null);

  const collection: Collection | undefined = resolvedCollectionId
    ? getCollection(resolvedCollectionId)
    : undefined;

  return (
    <div>
      <Link
        href="/discover"
        className="mb-5 inline-flex items-center gap-1.5 rounded-full text-sm font-medium text-muted transition-colors hover:text-saffron focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        <span aria-hidden="true" className="rotate-180">
          <ChevronIcon size={16} />
        </span>
        {t(BACK_LABEL, lang)}
      </Link>

      {collection ? (
        <>
          <header className="mb-6">
            <h1 className="font-serif text-3xl leading-tight tracking-tight text-ink">
              {t(collection.title, lang)}
            </h1>
            <p className="mt-1.5 text-[15px] leading-relaxed text-muted">
              {t(collection.subtitle, lang)}
            </p>
          </header>
          <CollectionItems collection={collection} lang={lang} />
        </>
      ) : (
        <div className="rounded-2xl border border-hairline bg-surface px-5 py-6 text-center text-[15px] leading-relaxed text-muted">
          {t(NOT_FOUND, lang)}
        </div>
      )}
    </div>
  );
}

/** Exposed so the page can label the active category chip. */
export { CATEGORY_TO_COLLECTION };
