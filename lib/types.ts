// lib/types.ts — the single source of truth for the data contract.
// Both the framework (state, components) and the content corpus target these types.

export type Lang = "en" | "hi";
export type Tradition = "shaiva" | "vaishnava" | "shakta" | "unsure";

/** A string available in every supported language. */
export type Localized = Record<Lang, string>;

export interface Shloka {
  id: string;
  title: Localized;
  devanagari: string; // verse in Devanagari, preserved verbatim
  transliteration: string; // IAST
  meaning: Localized; // accurate EN + HI meaning
  audio?: string; // "/audio/..." placeholder path
  source: string; // e.g. "Traditional", "Vishnu Sahasranama"
}

export interface Meditation {
  id: string;
  title: Localized;
  minutes: number;
  audio: string;
  description: Localized;
}

export interface Lesson {
  id: string;
  title: Localized;
  body: Localized;
}

export interface Story {
  id: string;
  title: Localized;
  audio: string;
  summary: Localized;
}

export interface Voice {
  id: string;
  name: Localized;
  note: Localized;
} // guide voice (placeholder for produced deity voice)

export interface Background {
  id: string;
  name: Localized;
  audio: string | null;
} // null => "Silence"

export interface Talk {
  id: string;
  title: Localized;
  speaker: Localized;
  minutes: number;
  audio: string;
  summary: Localized;
}

export type PracticeKind = "meditation" | "shloka" | "aarti" | "night" | "japa";

export interface PracticeRef {
  kind: PracticeKind;
  deityId: string;
  itemId?: string;
}

export interface Collection {
  id: string;
  title: Localized;
  subtitle: Localized;
  theme: string;
  items: PracticeRef[];
}

export interface Category {
  id: string;
  label: Localized;
  blurb: Localized;
}

export interface SadhanaDay {
  day: number;
  title: Localized;
  focus: Localized;
  practice?: PracticeRef;
}

export interface Sadhana {
  id: string;
  title: Localized;
  subtitle: Localized;
  length: number;
  description: Localized;
  deityId?: string;
  days: SadhanaDay[];
}

export interface DailyQuestion {
  id: string;
  prompt: Localized;
}

export interface ResolvedPractice {
  kind: PracticeKind;
  deityId: string;
  deityName: Localized;
  deityAccent: string;
  title: Localized;
  minutes?: number;
  audio?: string;
  transcript?: {
    devanagari: string;
    transliteration: string;
    meaning: Localized;
  };
}

export interface Deity {
  id: string; // "shiva" | "rama" | "ganesha" | ...
  name: Localized;
  devanagariName: string;
  tagline: Localized;
  accent: string; // hex color
  available: boolean; // false = "coming soon"
  shlokas: Shloka[];
  aarti?: Shloka;
  meditations: Meditation[];
  lessons: Lesson[];
  stories: Story[];
  nightPrayer?: Shloka;
  nightKatha?: Story;
  talks?: Talk[];
}
