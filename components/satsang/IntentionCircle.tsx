"use client";

// components/satsang/IntentionCircle.tsx — the "share an intention" composer
// plus the gentle feed of recent intentions.
//
// POC STUB: there is no real community backend. Shared intentions live only in
// local component state (ephemeral, lost on reload). We also mirror the user's
// latest into the persisted `lastIntention` via setIntention() so it survives
// within the rest of the app, but the *feed* is intentionally in-memory.
// The seeded examples are tasteful, hand-written, and attributed to
// "A fellow practitioner".

import { useState } from "react";
import { useSaarthi } from "@/lib/state";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui";
import type { Lang, Localized } from "@/lib/types";

interface IntentionCircleProps {
  lang: Lang;
}

const COPY = {
  shareLabel: { en: "Share an intention", hi: "एक संकल्प साझा करें" },
  placeholder: {
    en: "Today I sit for…",
    hi: "आज मैं इसके लिए बैठता हूँ…",
  },
  shareCta: { en: "Share", hi: "साझा करें" },
  feedHeading: { en: "Around the circle", hi: "वृत्त के चारों ओर" },
  you: { en: "You", hi: "आप" },
  fellow: { en: "A fellow practitioner", hi: "एक सहयात्री साधक" },
  justNow: { en: "Just now", hi: "अभी-अभी" },
  privacyNote: {
    en: "Shared gently, only within this circle.",
    hi: "केवल इस वृत्त में, सहजता से साझा किया गया।",
  },
} satisfies Record<string, Localized>;

// Seeded example intentions. Each carries a Localized text so the feed reads
// naturally in both languages. `when` is a small Localized relative-time label
// (no live clock — these are illustrative).
interface FeedItem {
  id: string;
  /** Localized for seeds; plain string for the user's own additions. */
  text: Localized | string;
  /** true when this came from the current user in this session. */
  mine: boolean;
  when: Localized;
}

const SEED_FEED: FeedItem[] = [
  {
    id: "seed-1",
    mine: false,
    text: {
      en: "Today I sit for patience with the people I love.",
      hi: "आज मैं अपने प्रियजनों के प्रति धैर्य के लिए बैठता हूँ।",
    },
    when: { en: "A few minutes ago", hi: "कुछ मिनट पहले" },
  },
  {
    id: "seed-2",
    mine: false,
    text: {
      en: "May my work today be steady, and offered without hurry.",
      hi: "आज मेरा कार्य स्थिर हो, और बिना जल्दबाज़ी के अर्पित हो।",
    },
    when: { en: "Earlier this morning", hi: "आज सुबह कुछ पहले" },
  },
  {
    id: "seed-3",
    mine: false,
    text: {
      en: "Sitting for a friend who is unwell. May they find ease.",
      hi: "एक अस्वस्थ मित्र के लिए बैठा हूँ। उन्हें सहजता मिले।",
    },
    when: { en: "An hour ago", hi: "एक घंटा पहले" },
  },
];

export function IntentionCircle({ lang }: IntentionCircleProps) {
  const { setIntention } = useSaarthi();
  const [draft, setDraft] = useState("");
  const [feed, setFeed] = useState<FeedItem[]>(SEED_FEED);

  function share() {
    const text = draft.trim();
    if (text === "") return;
    // Persist the user's latest intention app-wide (best-effort, allowed API).
    setIntention(text);
    // Prepend to the in-memory feed (newest first).
    setFeed((prev) => [
      {
        id: `mine-${Date.now()}`,
        text,
        mine: true,
        when: COPY.justNow,
      },
      ...prev,
    ]);
    setDraft("");
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      share();
    }
  }

  return (
    <div>
      {/* Composer */}
      <div className="rounded-3xl border border-hairline bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,0.30),0_18px_40px_-22px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(244,236,221,0.04)]">
        <label
          htmlFor="satsang-intention"
          className="text-xs font-medium uppercase tracking-wide text-muted"
        >
          {t(COPY.shareLabel, lang)}
        </label>
        <div className="mt-3 flex items-center gap-2.5">
          <input
            id="satsang-intention"
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            maxLength={140}
            placeholder={t(COPY.placeholder, lang)}
            className="h-11 min-w-0 flex-1 rounded-full border border-hairline bg-bg px-4 text-[15px] text-ink placeholder:text-faint focus-visible:border-[color:var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          />
          <Button onClick={share} disabled={draft.trim() === ""}>
            {t(COPY.shareCta, lang)}
          </Button>
        </div>
        <p className="mt-2.5 text-xs leading-relaxed text-faint">
          {t(COPY.privacyNote, lang)}
        </p>
      </div>

      {/* Feed */}
      <h2 className="mb-3 mt-7 px-1 text-xs font-medium uppercase tracking-wide text-muted">
        {t(COPY.feedHeading, lang)}
      </h2>
      <ul className="space-y-3">
        {feed.map((item) => {
          const body = typeof item.text === "string" ? item.text : t(item.text, lang);
          const who = item.mine ? t(COPY.you, lang) : t(COPY.fellow, lang);
          return (
            <li
              key={item.id}
              className="rounded-2xl border border-line bg-card p-4"
            >
              <div className="flex items-start gap-3.5">
                <span
                  aria-hidden="true"
                  className={[
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold",
                    item.mine
                      ? "bg-[color:var(--accent)]/15 text-[color:var(--accent)]"
                      : "bg-surface2 text-muted",
                  ].join(" ")}
                >
                  {item.mine ? <SelfMark /> : <CircleMark />}
                </span>
                <div className="min-w-0">
                  <p className="font-serif text-[15px] leading-snug text-ink">
                    {body}
                  </p>
                  <p className="mt-1.5 text-xs text-faint">
                    {who} · {t(item.when, lang)}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// --- Inline stroke marks (currentColor) -----------------------------------

function CircleMark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="9" r="3.2" />
      <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

function SelfMark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 4c1.6 2 1.6 5 0 7-1.6-2-1.6-5 0-7Z" />
      <path d="M12 11c-1.5-1.3-3.6-1.6-5.5-.7 0 2.7 2.4 4.8 5.5 4.8" />
      <path d="M12 11c1.5-1.3 3.6-1.6 5.5-.7 0 2.7-2.4 4.8-5.5 4.8" />
    </svg>
  );
}
