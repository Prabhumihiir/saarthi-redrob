"use client";

// components/learn/StoryCard.tsx — a single katha (story) as on-demand audio.
// Shows title + summary and an AudioButton playing the katha placeholder track.

import { Card, AudioButton } from "@/components/ui";
import { t } from "@/lib/i18n";
import type { Lang, Localized, Story } from "@/lib/types";

interface StoryCardProps {
  story: Story;
  lang: Lang;
}

const copy: Record<string, Localized> = {
  listen: { en: "Listen", hi: "सुनें" },
};

export function StoryCard({ story, lang }: StoryCardProps) {
  const title = t(story.title, lang);
  const summary = t(story.summary, lang);

  return (
    <Card as="article">
      <h3 className="font-serif text-lg leading-snug tracking-tight text-ink">
        {title}
      </h3>
      <p className="mt-2 text-[15px] leading-relaxed text-muted">{summary}</p>
      <div className="mt-4">
        {/* TODO: replace with produced audio. */}
        <AudioButton src={story.audio} label={`${t(copy.listen, lang)} — ${title}`} />
      </div>
    </Card>
  );
}
