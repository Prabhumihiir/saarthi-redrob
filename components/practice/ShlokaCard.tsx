"use client";

// components/practice/ShlokaCard.tsx
// Renders a single Shloka / mantra (or the daily aarti) as a dark, accent-themed
// card: the Devanagari verse (gold-warm, larger, in the Devanagari face), the
// IAST transliteration (italic, muted), the meaning in the current language, an
// AudioButton, and a "Begin" that opens the session player for this verse.

import Link from "next/link";
import type { Lang, Localized, Shloka } from "@/lib/types";
import { t } from "@/lib/i18n";
import { Card, AudioButton, Button } from "@/components/ui";

const LABELS = {
  begin: { en: "Begin", hi: "आरंभ करें" },
} satisfies Record<string, Localized>;

interface ShlokaCardProps {
  shloka: Shloka;
  lang: Lang;
  /** Optional small label above the title (e.g. "Daily aarti"). */
  eyebrow?: string;
  /**
   * Session-player URL opened by the "Begin" action. When omitted the card is
   * read-only (verse + audio) with no Begin button.
   */
  beginHref?: string;
}

export function ShlokaCard({ shloka, lang, eyebrow, beginHref }: ShlokaCardProps) {
  return (
    <Card as="article" className="space-y-4">
      <div className="space-y-1">
        {eyebrow ? (
          <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--accent)]">
            {eyebrow}
          </p>
        ) : null}
        <h3 className="font-serif text-lg leading-snug text-ink">
          {t(shloka.title, lang)}
        </h3>
      </div>

      {/* The sacred verse, preserved verbatim, in the Devanagari face — set
          larger and in a warm gold so it reads as the heart of the card. */}
      <p className="font-deva text-[22px] leading-[1.85] text-gold">
        {shloka.devanagari}
      </p>

      {/* IAST transliteration — italic, quiet. */}
      <p className="text-[15px] italic leading-relaxed text-muted">
        {shloka.transliteration}
      </p>

      {/* Meaning in the active language. */}
      <p className="text-[15px] leading-relaxed text-ink/90">
        {t(shloka.meaning, lang)}
      </p>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        {beginHref ? (
          <Link href={beginHref} className="inline-flex">
            <Button
              className="bg-[color:var(--accent)] text-white hover:opacity-90 active:opacity-90"
            >
              {t(LABELS.begin, lang)}
            </Button>
          </Link>
        ) : null}

        {/* AudioButton plays the placeholder track. */}
        {/* TODO: replace with produced audio. */}
        {shloka.audio ? (
          <AudioButton src={shloka.audio} label={t(shloka.title, lang)} />
        ) : null}

        <span className="ml-auto text-xs text-faint">{shloka.source}</span>
      </div>
    </Card>
  );
}
