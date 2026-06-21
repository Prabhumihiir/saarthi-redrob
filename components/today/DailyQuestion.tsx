"use client";

// components/today/DailyQuestion.tsx — a light, one-tap reflection prompt.
// The prompt is chosen deterministically by day-of-year. Tapping "Reflect"
// opens a single-line input; submitting saves the entry via addReflection(...)
// tagged with the "Daily question" practice. Kept gentle and low-friction.

import { useState } from "react";
import { Card } from "@/components/ui";
import { useSaarthi } from "@/lib/state";
import { t } from "@/lib/i18n";
import { getDailyQuestion } from "@/lib/content";
import type { Lang, Localized } from "@/lib/types";

interface DailyQuestionProps {
  lang: Lang;
  /** Local day-of-year (1–366), resolved client-side by the page. */
  dayOfYear: number | null;
}

const COPY = {
  label: { en: "Daily question", hi: "आज का प्रश्न" },
  reflect: { en: "Reflect", hi: "चिंतन करें" },
  placeholder: {
    en: "A few words, if you wish…",
    hi: "कुछ शब्द, यदि आप चाहें…",
  },
  save: { en: "Save", hi: "सहेजें" },
  saved: { en: "Kept. Thank you for pausing.", hi: "सहेज लिया। रुकने के लिए धन्यवाद।" },
} satisfies Record<string, Localized>;

// The practice tag stored with the reflection (matches the reflection list filter).
const PRACTICE_TAG = "Daily question";

export function DailyQuestion({ lang, dayOfYear }: DailyQuestionProps) {
  const { addReflection } = useSaarthi();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState(false);

  const question =
    dayOfYear === null ? null : getDailyQuestion(dayOfYear);

  function handleSave() {
    const text = value.trim();
    if (!text) return;
    addReflection(text, PRACTICE_TAG);
    setValue("");
    setOpen(false);
    setSaved(true);
  }

  return (
    <Card as="section" className="mb-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        {t(COPY.label, lang)}
      </p>

      <p className="mt-2 font-serif text-lg leading-snug text-ink">
        {question ? (
          t(question.prompt, lang)
        ) : (
          <span className="inline-block h-5 w-3/4 animate-pulse rounded bg-line/60 align-middle" />
        )}
      </p>

      {saved ? (
        <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--accent)]">
          {t(COPY.saved, lang)}
        </p>
      ) : open ? (
        <div className="mt-3.5 flex items-center gap-2">
          <label htmlFor="daily-question-input" className="sr-only">
            {t(COPY.placeholder, lang)}
          </label>
          <input
            id="daily-question-input"
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
            placeholder={t(COPY.placeholder, lang)}
            className="h-11 flex-1 rounded-full border border-line bg-card px-4 text-[15px] text-ink placeholder:text-muted/70 focus-visible:border-[color:var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={!value.trim()}
            className="h-11 shrink-0 rounded-full bg-[color:var(--accent)] px-5 text-[14px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t(COPY.save, lang)}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={question === null}
          className="mt-3.5 inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/8 px-4 py-2 text-[14px] font-medium text-[color:var(--accent)] transition-colors hover:bg-[color:var(--accent)]/14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-40"
        >
          <PenGlyph />
          {t(COPY.reflect, lang)}
        </button>
      )}
    </Card>
  );
}

/** A small pen glyph — drawn, not an emoji. */
function PenGlyph() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}
