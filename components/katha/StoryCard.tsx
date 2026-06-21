"use client";

// components/katha/StoryCard.tsx — a single katha (story) as on-demand audio.
// Title + summary set at a comfortable reading width, with an AudioButton that
// plays the story's recorded telling. Accent-tinted to the chosen deity.

import { Card, AudioButton } from "@/components/ui";
import { t } from "@/lib/i18n";
import type { Lang, Localized, Story } from "@/lib/types";

const LABELS: Record<string, Localized> = {
  listen: { en: "Listen", hi: "सुनें" },
};

export function StoryCard({ story, lang }: { story: Story; lang: Lang }) {
  return (
    <Card as="article">
      <h3 className="font-serif text-lg leading-snug tracking-tight text-ink">
        {t(story.title, lang)}
      </h3>
      <p className="mt-2.5 text-[15px] leading-[1.75] text-muted">
        {t(story.summary, lang)}
      </p>
      <div className="mt-4">
        <AudioButton src={story.audio} label={t(LABELS.listen, lang)} />
      </div>
    </Card>
  );
}
