"use client";

// components/katha/LessonCard.tsx — an expandable short read.
// Collapsed: title only, with a chevron. Expanded: the lesson body at a
// comfortable line-height, plus an "Ask Saarthi about this" link that opens the
// Companion pre-seeded with a question about this lesson (English title, per the
// route contract). Accent-tinted to the chosen deity.

import { useId, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui";
import { t } from "@/lib/i18n";
import type { Lang, Lesson, Localized } from "@/lib/types";

const LABELS: Record<string, Localized> = {
  ask: { en: "Ask Saarthi about this", hi: "इस विषय में सारथी से पूछें" },
  expand: { en: "Open", hi: "खोलें" },
  collapse: { en: "Close", hi: "बंद करें" },
};

export function LessonCard({ lesson, lang }: { lesson: Lesson; lang: Lang }) {
  const [open, setOpen] = useState(false);
  const bodyId = useId();

  // Seed always uses the lesson's English title, per the route contract.
  const seed = `Tell me more about: ${lesson.title.en}`;
  const askHref = `/companion?seed=${encodeURIComponent(seed)}`;

  return (
    <Card as="article" className="p-0 overflow-hidden">
      {/* Header — the whole row is the toggle. */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={bodyId}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-surface2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        <h3 className="font-serif text-lg leading-snug tracking-tight text-ink">
          {t(lesson.title, lang)}
        </h3>
        <span
          aria-hidden="true"
          className={[
            "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[color:var(--accent)]/10 text-[color:var(--accent)] transition-transform",
            open ? "rotate-180" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>

      {/* Body — only rendered (and reachable) when open. */}
      {open ? (
        <div id={bodyId} className="px-5 pb-5">
          <p className="text-[15px] leading-[1.8] text-ink/90">
            {t(lesson.body, lang)}
          </p>

          <Link
            href={askHref}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/[0.06] px-4 py-2 text-sm font-medium text-[color:var(--accent)] transition-colors hover:border-[color:var(--accent)] hover:bg-[color:var(--accent)]/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
            </svg>
            {t(LABELS.ask, lang)}
          </Link>
        </div>
      ) : null}
    </Card>
  );
}
