"use client";

// components/profile/DeityPicker.tsx — a compact, changeable picker over the
// available deities. Selecting one persists immediately via setDeity().

import type { Lang } from "@/lib/types";
import { getAvailableDeities } from "@/lib/content";
import { t } from "@/lib/i18n";
import { Card } from "@/components/ui";

interface DeityPickerProps {
  deityId: string | null;
  lang: Lang;
  onSelect: (id: string) => void;
}

const copy = {
  heading: { en: "Your chosen form", hi: "आपका इष्ट" },
  subtitle: {
    en: "The face of the divine you walk with. Change it anytime.",
    hi: "जिस दिव्य रूप के साथ आप चलते हैं। इसे कभी भी बदलें।",
  },
} as const;

export function DeityPicker({ deityId, lang, onSelect }: DeityPickerProps) {
  const deities = getAvailableDeities();

  return (
    <Card as="section" aria-labelledby="deity-heading">
      <h2
        id="deity-heading"
        className="font-serif text-lg tracking-tight text-ink"
      >
        {t(copy.heading, lang)}
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        {t(copy.subtitle, lang)}
      </p>

      <div
        role="radiogroup"
        aria-label={t(copy.heading, lang)}
        className="mt-4 grid grid-cols-3 gap-2.5"
      >
        {deities.map((deity) => {
          const selected = deity.id === deityId;
          return (
            <button
              key={deity.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(deity.id)}
              // Per-deity accent at runtime via a CSS variable on the wrapper.
              style={{ ["--accent" as string]: deity.accent } as React.CSSProperties}
              className={[
                "flex flex-col items-center gap-2 rounded-2xl border px-2 py-3.5 text-center transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                selected
                  ? "border-[color:var(--accent)] bg-[color:var(--accent)]/[0.08]"
                  : "border-line bg-paper/40 hover:border-[color:var(--accent)]/50",
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className={[
                  "grid h-11 w-11 place-items-center rounded-full font-deva text-xl leading-none transition-colors",
                  selected
                    ? "bg-[color:var(--accent)] text-white"
                    : "bg-card text-[color:var(--accent)] border border-line",
                ].join(" ")}
              >
                {deity.devanagariName.slice(0, 1)}
              </span>
              <span
                className={[
                  "text-[13px] font-medium leading-tight",
                  selected ? "text-[color:var(--accent)]" : "text-ink",
                ].join(" ")}
              >
                {t(deity.name, lang)}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
