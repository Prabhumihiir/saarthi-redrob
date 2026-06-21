"use client";

// components/learn/LessonCard.tsx — a single bite-sized lesson.
// Renders as an expandable card: tap the header to reveal the body. Each lesson
// offers an "Ask Saarthi about this" action that deep-links into the Companion
// pre-seeded with a question about this lesson's title.

import { useId, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui";
import { t } from "@/lib/i18n";
import type { Lang, Lesson, Localized } from "@/lib/types";

interface LessonCardProps {
  lesson: Lesson;
  lang: Lang;
}

// Localized chrome copy for this component (kept inline; not part of the corpus).
const copy: Record<string, Localized> = {
  ask: { en: "Ask Saarthi about this", hi: "इस बारे में सारथी से पूछें" },
  // Reading-time hint shown on the collapsed card.
  shortRead: { en: "Short read", hi: "संक्षिप्त पाठ" },
};

/** The natural-language question used to seed the Companion conversation. */
function seedQuestion(title: string, lang: Lang): string {
  return lang === "hi"
    ? `इसके बारे में और बताइए: ${title}`
    : `Tell me more about: ${title}`;
}

export function LessonCard({ lesson, lang }: LessonCardProps) {
  const [open, setOpen] = useState(false);
  const bodyId = useId();

  const title = t(lesson.title, lang);
  const body = t(lesson.body, lang);
  const seed = encodeURIComponent(seedQuestion(title, lang));

  return (
    <Card as="article" className="overflow-hidden p-0">
      {/* Header toggles the expandable body. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={bodyId}
        className={[
          "flex w-full items-center gap-3 px-5 py-4 text-left transition-colors",
          "hover:bg-line/25",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-inset",
        ].join(" ")}
      >
        <span className="min-w-0 flex-1">
          <span className="block font-serif text-lg leading-snug tracking-tight text-ink">
            {title}
          </span>
          {!open ? (
            <span className="mt-0.5 block text-xs font-medium uppercase tracking-wide text-muted">
              {t(copy.shortRead, lang)}
            </span>
          ) : null}
        </span>
        {/* Chevron rotates when open. */}
        <svg
          aria-hidden="true"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={[
            "shrink-0 text-muted transition-transform duration-200",
            open ? "rotate-180" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <div id={bodyId} className="px-5 pb-5">
          <p className="text-[15px] leading-relaxed text-ink/90">{body}</p>

          {/* Deep-link into the Companion, pre-seeded with a question. */}
          <Link
            href={`/companion?seed=${seed}`}
            className={[
              "mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-sm font-medium text-saffron transition-colors",
              "hover:border-saffron hover:bg-saffron/5",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
            ].join(" ")}
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 5h16v11H9l-4 3v-3H4z" />
              <path d="M8.5 10h7M8.5 13h4" />
            </svg>
            {t(copy.ask, lang)}
          </Link>
        </div>
      ) : null}
    </Card>
  );
}
