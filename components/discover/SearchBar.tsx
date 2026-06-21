"use client";

// components/discover/SearchBar.tsx — the search input at the top of Discover.
// Controlled by the parent. Calm dark field with a leading search glyph and a
// clear affordance once text is present.

import { t } from "@/lib/i18n";
import type { Lang, Localized } from "@/lib/types";
import { ClearIcon, SearchIcon } from "./icons";

interface SearchBarProps {
  value: string;
  onChange(next: string): void;
  lang: Lang;
}

const PLACEHOLDER: Localized = {
  en: "Search practices, stories, guides…",
  hi: "अभ्यास, कथाएँ, मार्गदर्शक खोजें…",
};

const CLEAR_LABEL: Localized = { en: "Clear search", hi: "खोज साफ़ करें" };
const FIELD_LABEL: Localized = { en: "Search Discover", hi: "खोजें" };

export function SearchBar({ value, onChange, lang }: SearchBarProps) {
  return (
    <div className="relative mb-6">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint"
      >
        <SearchIcon />
      </span>
      <input
        type="search"
        inputMode="search"
        autoComplete="off"
        aria-label={t(FIELD_LABEL, lang)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t(PLACEHOLDER, lang)}
        className="h-13 w-full rounded-2xl border border-hairline bg-surface pl-11 pr-11 text-[15px] text-ink placeholder:text-faint transition-colors focus:border-saffron focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={t(CLEAR_LABEL, lang)}
          className="absolute right-2.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors hover:bg-surface2 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          <ClearIcon />
        </button>
      ) : null}
    </div>
  );
}
