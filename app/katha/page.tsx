"use client";

// app/katha/page.tsx — Katha: the old stories, told well.
// For the chosen deity, three quiet sections:
//   1. Stories (deity.stories)  — katha as on-demand audio.
//   2. Talks (deity.talks)      — guided talks; section skipped if undefined.
//   3. Lessons (deity.lessons)  — expandable short reads, each linking into the
//      Companion ("Ask Saarthi about this").
// A sub-section linked from Discover/Today (not in the tab bar).
//
// Guards on hydration (calm dark skeleton) and on a chosen deity (gentle nudge
// to /onboarding), matching the app-wide pattern.

import Link from "next/link";
import { useSaarthi } from "@/lib/state";
import { getDeity } from "@/lib/content";
import { t } from "@/lib/i18n";
import type { Localized } from "@/lib/types";
import { Card, ScreenHeader, Button } from "@/components/ui";
import { Logo } from "@/components/Logo";
import { StoryCard } from "@/components/katha/StoryCard";
import { TalkCard } from "@/components/katha/TalkCard";
import { LessonCard } from "@/components/katha/LessonCard";

// Screen-specific copy (both languages switch via lang from useSaarthi()).
const copy: Record<string, Localized> = {
  title: { en: "Katha", hi: "कथा" },
  subtitle: {
    en: "The old stories, told well — for the commute, or the quiet of night.",
    hi: "पुरानी कथाएँ, सुंदर ढंग से सुनाई गईं — सफ़र के लिए, या रात्रि की शांति के लिए।",
  },

  // Section headings + hints.
  storiesHeading: { en: "Stories", hi: "कथाएँ" },
  storiesHint: {
    en: "Timeless tales, told aloud.",
    hi: "कालजयी कथाएँ, स्वर में सुनाई गईं।",
  },
  talksHeading: { en: "Talks", hi: "प्रवचन" },
  talksHint: {
    en: "Short reflections to listen to.",
    hi: "सुनने योग्य संक्षिप्त चिंतन।",
  },
  lessonsHeading: { en: "Lessons", hi: "पाठ" },
  lessonsHint: {
    en: "Bite-sized readings — tap any to open.",
    hi: "संक्षिप्त पाठ — खोलने के लिए किसी पर भी स्पर्श करें।",
  },

  // Empty states (never fear/guilt — gentle and warm).
  noStories: {
    en: "Stories for this companion are on their way.",
    hi: "इस सहचर के लिए कथाएँ शीघ्र आ रही हैं।",
  },
  noLessons: {
    en: "Lessons for this companion are on their way.",
    hi: "इस सहचर के लिए पाठ शीघ्र आ रहे हैं।",
  },

  // Onboarding fallback.
  chooseTitle: { en: "Choose your companion", hi: "अपना सहचर चुनें" },
  chooseBody: {
    en: "Finish a short setup to pick the deity you wish to walk with, and the stories will follow.",
    hi: "जिस देव के साथ चलना चाहते हैं उन्हें चुनने के लिए एक छोटी-सी सेटअप पूरी करें, और कथाएँ साथ आएँगी।",
  },
  chooseCta: { en: "Begin setup", hi: "सेटअप शुरू करें" },
};

export default function KathaPage() {
  const { hydrated, deityId, lang } = useSaarthi();

  // 1) Hydration guard — calm dark skeleton while persisted state loads.
  if (!hydrated) {
    return <KathaSkeleton />;
  }

  const deity = getDeity(deityId);

  // 2) No deity chosen yet — gently route to onboarding.
  if (!deity) {
    return (
      <div className="pt-2">
        <ScreenHeader title={t(copy.title, lang)} subtitle={t(copy.subtitle, lang)} />
        <Card className="text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-saffron/10 text-saffron">
            <Logo size={30} />
          </div>
          <h2 className="font-serif text-xl text-ink">
            {t(copy.chooseTitle, lang)}
          </h2>
          <p className="mx-auto mt-2 max-w-xs text-[15px] leading-relaxed text-muted">
            {t(copy.chooseBody, lang)}
          </p>
          <Link href="/onboarding" className="mt-5 inline-block">
            <Button size="md">{t(copy.chooseCta, lang)}</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const talks = deity.talks ?? [];

  return (
    // Per-deity accent at runtime, exposed as --accent for arbitrary-value classes.
    <div
      style={{ ["--accent" as string]: deity.accent } as React.CSSProperties}
      className="pt-2"
    >
      <ScreenHeader title={t(copy.title, lang)} subtitle={t(copy.subtitle, lang)} />

      {/* ---------------------------------------------------------------- */}
      {/* Stories — katha as on-demand audio. */}
      {/* ---------------------------------------------------------------- */}
      <section aria-labelledby="katha-stories" className="mb-10">
        <SectionHeading
          id="katha-stories"
          heading={t(copy.storiesHeading, lang)}
          hint={t(copy.storiesHint, lang)}
        />
        {deity.stories.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {deity.stories.map((story) => (
              <li key={story.id}>
                <StoryCard story={story} lang={lang} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyNote text={t(copy.noStories, lang)} />
        )}
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Talks — guided reflections (skipped entirely if none). */}
      {/* ---------------------------------------------------------------- */}
      {talks.length > 0 ? (
        <section aria-labelledby="katha-talks" className="mb-10">
          <SectionHeading
            id="katha-talks"
            heading={t(copy.talksHeading, lang)}
            hint={t(copy.talksHint, lang)}
          />
          <ul className="flex flex-col gap-3">
            {talks.map((talk) => (
              <li key={talk.id}>
                <TalkCard talk={talk} lang={lang} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {/* Lessons — expandable short reads with "Ask Saarthi about this". */}
      {/* ---------------------------------------------------------------- */}
      <section aria-labelledby="katha-lessons">
        <SectionHeading
          id="katha-lessons"
          heading={t(copy.lessonsHeading, lang)}
          hint={t(copy.lessonsHint, lang)}
        />
        {deity.lessons.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {deity.lessons.map((lesson) => (
              <li key={lesson.id}>
                <LessonCard lesson={lesson} lang={lang} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyNote text={t(copy.noLessons, lang)} />
        )}
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small in-file presentational helpers.
// ---------------------------------------------------------------------------

function SectionHeading({
  id,
  heading,
  hint,
}: {
  id: string;
  heading: string;
  hint: string;
}) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <h2
        id={id}
        className="font-serif text-xl tracking-tight text-[color:var(--accent)]"
      >
        {heading}
      </h2>
      <span className="text-xs text-muted">{hint}</span>
    </div>
  );
}

function EmptyNote({ text }: { text: string }) {
  return (
    <Card>
      <p className="text-[15px] leading-relaxed text-muted">{text}</p>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Skeleton — calm dark placeholder shown while !hydrated.
// ---------------------------------------------------------------------------

function KathaSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse pt-2">
      <div className="mb-6">
        <div className="h-8 w-32 rounded-lg bg-line/70" />
        <div className="mt-3 h-4 w-72 max-w-full rounded bg-line/50" />
      </div>
      <div className="mb-3 h-6 w-24 rounded bg-line/60" />
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-3xl border border-line bg-card p-5">
            <div className="h-5 w-2/3 rounded bg-line/70" />
            <div className="mt-4 space-y-2">
              <div className="h-4 w-full rounded bg-line/50" />
              <div className="h-4 w-5/6 rounded bg-line/50" />
            </div>
            <div className="mt-5 h-10 w-28 rounded-full bg-line/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
