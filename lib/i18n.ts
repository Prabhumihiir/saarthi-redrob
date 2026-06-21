// lib/i18n.ts — tiny localization helper + shared UI chrome strings.
// Content data carries its own Localized fields; this file only holds the
// app shell labels (nav, greetings, app name) that aren't part of the corpus.

import type { Lang, Localized } from "@/lib/types";

/**
 * Resolve a Localized value for the active language.
 * Falls back to English, then to an empty string, so it is always safe to render.
 */
export function t(value: Localized | undefined, lang: Lang): string {
  if (!value) return "";
  return value[lang] ?? value.en ?? "";
}

/** Shared chrome strings used across the app shell. */
export const ui: Record<string, Localized> = {
  appName: { en: "Saarthi", hi: "सारथी" },
  tagline: {
    en: "Your guide, every day.",
    hi: "हर दिन, आपका मार्गदर्शक।",
  },
  taglineLong: {
    en: "From darkness, to light — every morning.",
    hi: "तमसो मा ज्योतिर्गमय — हर सुबह।",
  },

  // Bottom / side navigation labels.
  navToday: { en: "Today", hi: "आज" },
  navDiscover: { en: "Discover", hi: "खोजें" },
  navPractice: { en: "Practice", hi: "अभ्यास" },
  navCompanion: { en: "Companion", hi: "सहचर" },
  navYou: { en: "You", hi: "आप" },
  // Retained for components that still reference them.
  navMeditate: { en: "Meditate", hi: "ध्यान" },
  navLearn: { en: "Learn", hi: "सीखें" },
  navProfile: { en: "Profile", hi: "प्रोफ़ाइल" },

  // Time-of-day greetings.
  greetingMorning: { en: "Good morning", hi: "सुप्रभात" },
  greetingAfternoon: { en: "Good afternoon", hi: "नमस्ते" },
  greetingEvening: { en: "Good evening", hi: "शुभ संध्या" },

  // Misc shared chrome.
  loading: { en: "Loading", hi: "लोड हो रहा है" },
  comingSoon: { en: "Coming soon", hi: "जल्द आ रहा है" },
};
