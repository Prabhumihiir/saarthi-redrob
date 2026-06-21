"use client";

// components/onboarding/DeityCard.tsx — a selectable Ishta-devta card for the
// onboarding deity grid. Shows the deity's Devanagari name, romanized name, and
// a one-line tagline, tinted with that deity's own accent color. When
// `comingSoon` is set the card is dimmed and non-interactive.

import type { Deity, Lang, Localized } from "@/lib/types";
import { t, ui } from "@/lib/i18n";

interface DeityCardProps {
  deity: Deity;
  lang: Lang;
  /** Whether this card is the currently selected deity. */
  selected?: boolean;
  /** Render as a dimmed, non-selectable "coming soon" card. */
  comingSoon?: boolean;
  /**
   * Optional one-line descriptor that overrides the deity's own tagline. Used by
   * onboarding to show its hand-written one-liners in place of the card tagline.
   */
  descriptor?: Localized;
  /** Optional override for the coming-soon pill label. */
  comingSoonLabel?: Localized;
  onSelect?: (id: string) => void;
}

export function DeityCard({
  deity,
  lang,
  selected = false,
  comingSoon = false,
  descriptor,
  comingSoonLabel,
  onSelect,
}: DeityCardProps) {
  // Per-deity accent exposed as a CSS var so Tailwind arbitrary values can use it.
  const accentStyle = { ["--accent" as string]: deity.accent } as React.CSSProperties;

  if (comingSoon) {
    return (
      <div
        style={accentStyle}
        aria-disabled="true"
        className="relative flex flex-col items-center gap-2 rounded-3xl border border-line bg-card/60 px-3 py-5 text-center opacity-55"
      >
        <span className="font-deva text-3xl leading-none text-[color:var(--accent)]">
          {deity.devanagariName}
        </span>
        <span className="text-sm font-medium text-ink">
          {t(deity.name, lang)}
        </span>
        <span className="mt-0.5 rounded-full bg-line/70 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
          {t(comingSoonLabel ?? ui.comingSoon, lang)}
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      style={accentStyle}
      onClick={() => onSelect?.(deity.id)}
      aria-pressed={selected}
      aria-label={t(deity.name, lang)}
      className={[
        "group relative flex flex-col items-center gap-2 rounded-3xl border bg-card px-3 py-5 text-center transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
        selected
          ? "border-[color:var(--accent)] shadow-[0_8px_24px_-12px_var(--accent)]"
          : "border-line hover:border-[color:var(--accent)]/50",
      ].join(" ")}
    >
      {/* Soft accent halo behind the Devanagari mark. */}
      <span
        aria-hidden="true"
        className={[
          "flex h-16 w-16 items-center justify-center rounded-full transition-colors",
          selected
            ? "bg-[color:var(--accent)]/12"
            : "bg-[color:var(--accent)]/[0.06] group-hover:bg-[color:var(--accent)]/10",
        ].join(" ")}
      >
        <span className="font-deva text-3xl leading-none text-[color:var(--accent)]">
          {deity.devanagariName}
        </span>
      </span>

      <span className="text-[15px] font-semibold text-ink">
        {t(deity.name, lang)}
      </span>
      <span className="px-1 text-xs leading-snug text-muted">
        {t(descriptor ?? deity.tagline, lang)}
      </span>

      {/* Selected check, tinted with the deity accent. */}
      {selected ? (
        <span
          aria-hidden="true"
          className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--accent)] text-white"
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6.2 L4.8 8.5 L9.5 3.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : null}
    </button>
  );
}
