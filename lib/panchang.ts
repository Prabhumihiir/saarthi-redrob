// lib/panchang.ts — a deterministic MOCK panchang (Hindu almanac snippet).
// Rotates through a small table by day-of-year so the value is stable for a
// given calendar day but varies day to day.
//
// TODO: real panchang API (tithi/paksha/nakshatra by date + location).

import type { Localized } from "@/lib/types";

interface PanchangEntry {
  tithi: Localized;
  paksha: Localized;
  /** A single, self-contained line to render on the Today panchang card. */
  note: Localized;
}

const SHUKLA: Localized = { en: "Shukla Paksha", hi: "शुक्ल पक्ष" };
const KRISHNA: Localized = { en: "Krishna Paksha", hi: "कृष्ण पक्ष" };

// A plausible rotating set of tithis with self-contained notes. The note is the
// full verbatim line shown on the card; tithi/paksha are retained for any
// callers that still read the structured shape. Not astronomically accurate.
const ENTRIES: PanchangEntry[] = [
  {
    tithi: { en: "Ekadashi", hi: "एकादशी" },
    paksha: SHUKLA,
    note: {
      en: "Today is Ekadashi. A day for lightness — many fast and turn inward.",
      hi: "आज एकादशी है। हल्केपन का दिन — अनेक उपवास रखते हैं और भीतर की ओर मुड़ते हैं।",
    },
  },
  {
    tithi: { en: "Trayodashi", hi: "त्रयोदशी" },
    paksha: SHUKLA,
    note: {
      en: "Today is Pradosh. The hour before dusk belongs to Shiva. A good evening to sit.",
      hi: "आज प्रदोष है। संध्या से ठीक पहले का समय शिव का है। बैठने के लिए एक शुभ संध्या।",
    },
  },
  {
    tithi: { en: "Purnima", hi: "पूर्णिमा" },
    paksha: SHUKLA,
    note: {
      en: "Today is Purnima, the full moon. A day of fullness, and of giving thanks.",
      hi: "आज पूर्णिमा है, पूर्ण चंद्र का दिन। पूर्णता का दिन, और कृतज्ञता अर्पित करने का।",
    },
  },
  {
    tithi: { en: "Amavasya", hi: "अमावस्या" },
    paksha: KRISHNA,
    note: {
      en: "Today is Amavasya, the new moon. A quiet day to begin again.",
      hi: "आज अमावस्या है, नवचंद्र का दिन। नए सिरे से आरंभ करने का एक शांत दिन।",
    },
  },
  {
    tithi: { en: "Tritiya", hi: "तृतीया" },
    paksha: KRISHNA,
    note: {
      en: "Today is Tritiya · Krishna Paksha. A quiet, inward day. Return to the breath when the mind wanders.",
      hi: "आज तृतीया · कृष्ण पक्ष है। एक शांत, अंतर्मुखी दिन। मन भटके तो श्वास पर लौटें।",
    },
  },
];

/** Day-of-year (1–366) for a given local date. */
function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / 86_400_000);
}

/**
 * Deterministic mock panchang for today (or a supplied date).
 * Same calendar day always yields the same entry.
 */
export function getTodayPanchang(date: Date = new Date()): PanchangEntry {
  const idx = dayOfYear(date) % ENTRIES.length;
  return ENTRIES[idx];
}
