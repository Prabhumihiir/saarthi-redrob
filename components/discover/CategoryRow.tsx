"use client";

// components/discover/CategoryRow.tsx — a horizontally scrollable row of intention
// chips drawn from `categories`. Tapping a chip surfaces a relevant set: most map
// to a themed collection (shown inline on /discover), while "sleep" leads to the
// night practice. The active category is highlighted.

import Link from "next/link";
import { categories } from "@/lib/content";
import { t } from "@/lib/i18n";
import type { Lang, Localized } from "@/lib/types";
import { categoryHref } from "./destinations";

interface CategoryRowProps {
  lang: Lang;
  /** The currently surfaced category id (from the URL), if any. */
  activeCategory: string | null;
}

const HEADING: Localized = { en: "Start with an intention", hi: "एक भाव से आरंभ करें" };

/**
 * Where each category leads. Most surface a themed collection inline; "sleep"
 * is best served by the dedicated night practice.
 */
const CATEGORY_DEST: Record<string, string> = {
  calm: categoryHref("calm"),
  focus: categoryHref("focus"),
  sleep: "/night",
  "before-an-exam": categoryHref("before-an-exam"),
  courage: categoryHref("courage"),
  gratitude: categoryHref("gratitude"),
};

export function CategoryRow({ lang, activeCategory }: CategoryRowProps) {
  return (
    <section className="mb-9">
      <h2 className="mb-3 px-1 text-xs font-medium uppercase tracking-wide text-muted">
        {t(HEADING, lang)}
      </h2>
      {/* Horizontal scroll on mobile; the row never forces the page to scroll
          sideways because it clips to its own track. */}
      <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul className="flex w-max gap-2.5 pb-1">
          {categories.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <li key={cat.id}>
                <Link
                  href={CATEGORY_DEST[cat.id] ?? categoryHref(cat.id)}
                  aria-current={active ? "true" : undefined}
                  className={[
                    "inline-flex items-center rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
                    active
                      ? "border-saffron bg-saffron/12 text-saffron"
                      : "border-hairline bg-surface text-ink hover:border-saffron hover:text-saffron",
                  ].join(" ")}
                >
                  {t(cat.label, lang)}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
