"use client";

// components/discover/LearnGroup.tsx — the "Learn" group. Surfaces every available
// deity's lessons grouped by deity. Each lesson expands inline to reveal its body
// (lessons are short, readable teachings), and a quiet link leads to /katha where
// lessons, stories, and talks are read together.

import { useState } from "react";
import Link from "next/link";
import { getAvailableDeities } from "@/lib/content";
import { t } from "@/lib/i18n";
import type { Deity, Lang, Lesson, Localized } from "@/lib/types";
import { ChevronIcon, LessonIcon } from "./icons";
import { KATHA_HREF } from "./destinations";

interface LearnGroupProps {
  lang: Lang;
}

const HEADING: Localized = { en: "Learn", hi: "सीखें" };
const SUBHEAD: Localized = {
  en: "Short teachings on each deity, their names, and their meaning.",
  hi: "प्रत्येक देवता, उनके नाम और उनके अर्थ पर संक्षिप्त शिक्षाएँ।",
};
const READ_ALL: Localized = { en: "Read in Katha", hi: "कथा में पढ़ें" };

export function LearnGroup({ lang }: LearnGroupProps) {
  const deities = getAvailableDeities();

  return (
    <section className="mb-9">
      <div className="mb-4 flex items-end justify-between px-1">
        <div>
          <h2 className="mb-1 font-serif text-xl tracking-tight text-ink">
            {t(HEADING, lang)}
          </h2>
          <p className="max-w-[20rem] text-[13px] leading-relaxed text-muted">
            {t(SUBHEAD, lang)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {deities.map((deity) => (
          <DeityLessons key={deity.id} deity={deity} lang={lang} readAll={READ_ALL} />
        ))}
      </div>
    </section>
  );
}

function DeityLessons({
  deity,
  lang,
  readAll,
}: {
  deity: Deity;
  lang: Lang;
  readAll: Localized;
}) {
  if (deity.lessons.length === 0) return null;

  return (
    <div
      style={{ ["--accent" as string]: deity.accent }}
      className="rounded-3xl border border-hairline bg-surface p-4"
    >
      <div className="mb-2 flex items-center gap-2.5 px-1">
        <span
          aria-hidden="true"
          className="grid h-8 w-8 place-items-center rounded-full bg-[color:var(--accent)]/12 text-[color:var(--accent)]"
        >
          <LessonIcon size={17} />
        </span>
        <h3 className="font-serif text-base tracking-tight text-ink">
          {t(deity.name, lang)}
        </h3>
        <Link
          href={KATHA_HREF}
          className="ml-auto rounded-full text-[12px] font-medium text-[color:var(--accent)] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          {t(readAll, lang)}
        </Link>
      </div>
      <ul className="divide-y divide-hairline">
        {deity.lessons.map((lesson) => (
          <li key={lesson.id}>
            <LessonRow lesson={lesson} lang={lang} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function LessonRow({ lesson, lang }: { lesson: Lesson; lang: Lang }) {
  const [open, setOpen] = useState(false);
  const panelId = `lesson-panel-${lesson.id}`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-3 rounded-xl px-1 py-3 text-left transition-colors hover:text-[color:var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-inset"
      >
        <span className="flex-1 text-[15px] font-medium text-ink">
          {t(lesson.title, lang)}
        </span>
        <span
          aria-hidden="true"
          className={[
            "shrink-0 text-faint transition-transform",
            open ? "rotate-90" : "",
          ].join(" ")}
        >
          <ChevronIcon size={18} />
        </span>
      </button>
      {open ? (
        <p
          id={panelId}
          className="px-1 pb-4 text-[15px] leading-relaxed text-ink/90"
        >
          {t(lesson.body, lang)}
        </p>
      ) : null}
    </>
  );
}
