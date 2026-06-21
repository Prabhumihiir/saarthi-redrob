// components/discover/searchIndex.ts — flattens the whole content corpus into a
// single, searchable list of entries. Each entry carries a Localized title, the
// group it belongs to, and the href it links to. Search matches by title across
// both languages so a query works regardless of the active interface language.

import { collections, getAvailableDeities, sadhanas } from "@/lib/content";
import type { Localized } from "@/lib/types";
import { KATHA_HREF, collectionHref, sadhanaHref, sessionHref } from "./destinations";

/** Coarse grouping used to label and order results. */
export type SearchGroup =
  | "meditation"
  | "shloka"
  | "aarti"
  | "story"
  | "talk"
  | "lesson"
  | "collection"
  | "sadhana";

export interface SearchEntry {
  id: string;
  group: SearchGroup;
  title: Localized;
  /** Optional second line (deity name / source) shown beneath the title. */
  meta?: Localized;
  href: string;
}

/** Group display labels, ordered for sensible result grouping. */
export const GROUP_LABELS: Record<SearchGroup, Localized> = {
  meditation: { en: "Meditation", hi: "ध्यान" },
  shloka: { en: "Shloka", hi: "श्लोक" },
  aarti: { en: "Aarti", hi: "आरती" },
  story: { en: "Story", hi: "कथा" },
  talk: { en: "Talk", hi: "प्रवचन" },
  lesson: { en: "Lesson", hi: "पाठ" },
  collection: { en: "Collection", hi: "संग्रह" },
  sadhana: { en: "Sadhana", hi: "साधना" },
};

/** Stable order in which result groups appear. */
export const GROUP_ORDER: SearchGroup[] = [
  "meditation",
  "shloka",
  "aarti",
  "story",
  "talk",
  "lesson",
  "collection",
  "sadhana",
];

/**
 * Build the full index once at module load. Only available (fully seeded)
 * deities contribute practices, stories, talks, and lessons — coming-soon
 * placeholders have empty arrays and are surfaced separately as locked chips.
 */
function buildIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const deity of getAvailableDeities()) {
    const deityMeta = deity.name;

    for (const m of deity.meditations) {
      entries.push({
        id: `med-${m.id}`,
        group: "meditation",
        title: m.title,
        meta: deityMeta,
        href: sessionHref("meditation", deity.id, m.id),
      });
    }

    for (const s of deity.shlokas) {
      entries.push({
        id: `shloka-${s.id}`,
        group: "shloka",
        title: s.title,
        meta: deityMeta,
        href: sessionHref("shloka", deity.id, s.id),
      });
    }

    if (deity.aarti) {
      entries.push({
        id: `aarti-${deity.aarti.id}`,
        group: "aarti",
        title: deity.aarti.title,
        meta: deityMeta,
        href: sessionHref("aarti", deity.id, deity.aarti.id),
      });
    }

    for (const story of deity.stories) {
      entries.push({
        id: `story-${story.id}`,
        group: "story",
        title: story.title,
        meta: deityMeta,
        href: KATHA_HREF,
      });
    }

    for (const talk of deity.talks ?? []) {
      entries.push({
        id: `talk-${talk.id}`,
        group: "talk",
        title: talk.title,
        meta: deityMeta,
        href: KATHA_HREF,
      });
    }

    for (const lesson of deity.lessons) {
      entries.push({
        id: `lesson-${lesson.id}`,
        group: "lesson",
        title: lesson.title,
        meta: deityMeta,
        href: KATHA_HREF,
      });
    }
  }

  for (const c of collections) {
    entries.push({
      id: `collection-${c.id}`,
      group: "collection",
      title: c.title,
      meta: c.subtitle,
      href: collectionHref(c.id),
    });
  }

  for (const s of sadhanas) {
    entries.push({
      id: `sadhana-${s.id}`,
      group: "sadhana",
      title: s.title,
      meta: s.subtitle,
      href: sadhanaHref(s.id),
    });
  }

  return entries;
}

/** The immutable, pre-built corpus index. */
export const searchIndex: SearchEntry[] = buildIndex();

/**
 * Filter the index by a free-text query, matching the title in BOTH languages
 * so results appear regardless of the interface language. Returns the full
 * index for an empty/blank query is intentionally NOT done — callers decide
 * whether to render results at all.
 */
export function searchCorpus(query: string): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return searchIndex.filter((e) => {
    const en = e.title.en.toLowerCase();
    const hi = e.title.hi.toLowerCase();
    const metaEn = e.meta?.en.toLowerCase() ?? "";
    const metaHi = e.meta?.hi.toLowerCase() ?? "";
    return (
      en.includes(q) ||
      hi.includes(q) ||
      metaEn.includes(q) ||
      metaHi.includes(q)
    );
  });
}

/** Group matched entries into ordered buckets for sectioned rendering. */
export function groupResults(
  entries: SearchEntry[],
): { group: SearchGroup; items: SearchEntry[] }[] {
  const byGroup = new Map<SearchGroup, SearchEntry[]>();
  for (const e of entries) {
    const list = byGroup.get(e.group);
    if (list) list.push(e);
    else byGroup.set(e.group, [e]);
  }
  return GROUP_ORDER.filter((g) => byGroup.has(g)).map((g) => ({
    group: g,
    items: byGroup.get(g) as SearchEntry[],
  }));
}

/** Count of every searchable item, for the empty-state hint. */
export const corpusSize = (): number => searchIndex.length;
