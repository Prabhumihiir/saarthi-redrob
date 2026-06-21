"use client";

// components/discover/DiscoverScreen.tsx — the Discover experience. Holds the
// search state and reads ?collection / ?category from the URL to decide between
// two modes:
//   • Focused mode  — a single themed set of practices (collection/category).
//   • Index mode    — search + categories + collections + deity browse + Learn.
// Uses useSearchParams(), so the route page wraps it in <Suspense>.

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSaarthi } from "@/lib/state";
import { t } from "@/lib/i18n";
import { ScreenHeader } from "@/components/ui";
import type { Lang, Localized } from "@/lib/types";
import { SearchBar } from "./SearchBar";
import { SearchResults } from "./SearchResults";
import { CategoryRow } from "./CategoryRow";
import { Collections } from "./Collections";
import { DeityBrowse } from "./DeityBrowse";
import { LearnGroup } from "./LearnGroup";
import { FocusedView } from "./FocusedView";

const HEADER: { title: Localized; subtitle: Localized } = {
  title: { en: "Discover", hi: "खोजें" },
  subtitle: {
    en: "Every practice, story, and guide. Find what today asks for.",
    hi: "हर अभ्यास, कथा और मार्गदर्शक। जो आज की आवश्यकता है, उसे पाएँ।",
  },
};

export function DiscoverScreen({ lang }: { lang: Lang }) {
  const { deityId } = useSaarthi();
  const params = useSearchParams();
  const [query, setQuery] = useState("");

  const collectionId = params.get("collection");
  const categoryId = params.get("category");
  const focused = Boolean(collectionId || categoryId);

  const searching = query.trim().length > 0;

  return (
    <>
      <ScreenHeader title={t(HEADER.title, lang)} subtitle={t(HEADER.subtitle, lang)} />

      {focused ? (
        <FocusedView
          collectionId={collectionId}
          categoryId={categoryId}
          lang={lang}
        />
      ) : (
        <>
          <SearchBar value={query} onChange={setQuery} lang={lang} />

          {searching ? (
            // While searching, results take over the body; the corpus browse
            // is set aside so the matches are the clear focus.
            <SearchResults query={query} lang={lang} />
          ) : (
            <>
              <CategoryRow lang={lang} activeCategory={categoryId} />
              <Collections lang={lang} />
              <DeityBrowse lang={lang} currentDeityId={deityId} />
              <LearnGroup lang={lang} />
            </>
          )}
        </>
      )}
    </>
  );
}
