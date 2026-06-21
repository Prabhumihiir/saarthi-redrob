// components/session/shared.ts — shared copy, types, and small helpers for the
// session player. Copy strings keep the hand-written English verbatim and pair
// it with faithful, natural Hindi resolved through t(...) at render time.

import type { Localized, PracticeKind } from "@/lib/types";

// ---------------------------------------------------------------------------
// The configuration chosen on the Setup screen and carried into Playing /
// Completion.
// ---------------------------------------------------------------------------
export interface SessionConfig {
  /** Total session length in minutes (drives the self-managed timer). */
  minutes: number;
  /** Chosen guide voice id (placeholder for a future produced deity voice). */
  voiceId: string;
  /** Chosen ambient background id ("silence" => no bed). */
  backgroundId: string;
  /** The user's one-line intention for the sit, if any. */
  intention: string;
}

// The selectable session lengths (in minutes).
export const LENGTH_OPTIONS = [5, 10, 15] as const;
export type LengthOption = (typeof LENGTH_OPTIONS)[number];

// Playback speeds cycled by the speed control.
export const SPEED_OPTIONS = [0.75, 1, 1.25] as const;

// Sleep-timer options (minutes); null => off.
export const SLEEP_OPTIONS: (number | null)[] = [null, 5, 10];

// ---------------------------------------------------------------------------
// All session copy. English is verbatim per the brief; Hindi is faithful.
// ---------------------------------------------------------------------------
export const SESSION_COPY = {
  // --- Fallback (couldn't resolve a practice) ---
  fallback: {
    title: {
      en: "This practice isn't ready",
      hi: "यह अभ्यास अभी तैयार नहीं है",
    } satisfies Localized,
    body: {
      en: "We couldn't open this session. Let's return to Today and begin again.",
      hi: "हम यह सत्र नहीं खोल सके। आइए आज पर लौटें और पुनः आरंभ करें।",
    } satisfies Localized,
    cta: { en: "Return to Today", hi: "आज पर लौटें" } satisfies Localized,
  },

  // --- Setup screen ---
  setup: {
    // Rotating one-line framing by kind (English verbatim).
    framingMeditationNight: {
      en: "For the next few minutes, nothing is asked of you but to be here.",
      hi: "अगले कुछ क्षणों में, आपसे केवल यहाँ होने के सिवा कुछ नहीं माँगा जाता।",
    } satisfies Localized,
    framingShlokaAarti: {
      en: "Let the words do the work. Simply follow along.",
      hi: "शब्दों को काम करने दें। बस साथ-साथ चलते रहें।",
    } satisfies Localized,
    framingJapa: {
      en: "One name, repeated, until the noise quiets.",
      hi: "एक नाम, बार-बार, जब तक शोर शांत न हो जाए।",
    } satisfies Localized,

    lengthHeading: { en: "How long?", hi: "कितनी देर?" } satisfies Localized,
    // Length labels (English verbatim).
    length5: { en: "5 min · a pause", hi: "5 मिनट · एक ठहराव" } satisfies Localized,
    length10: {
      en: "10 min · the daily sit",
      hi: "10 मिनट · दैनिक बैठक",
    } satisfies Localized,
    length15: {
      en: "15 min · go deeper",
      hi: "15 मिनट · और गहरे",
    } satisfies Localized,

    guideHeading: { en: "Choose your guide", hi: "अपना मार्गदर्शक चुनें" } satisfies Localized,
    backgroundHeading: { en: "Background", hi: "पृष्ठभूमि" } satisfies Localized,

    intentionHeading: { en: "Add your intention", hi: "अपना संकल्प जोड़ें" } satisfies Localized,
    intentionPlaceholder: {
      en: "Today I sit for…",
      hi: "आज मैं बैठता हूँ…",
    } satisfies Localized,

    begin: { en: "Begin", hi: "आरंभ करें" } satisfies Localized,
  },

  // --- Playing screen ---
  playing: {
    intentionLabel: { en: "Your intention", hi: "आपका संकल्प" } satisfies Localized,
    showText: { en: "Show text", hi: "पाठ दिखाएँ" } satisfies Localized,
    hideText: { en: "Hide text", hi: "पाठ छिपाएँ" } satisfies Localized,
    play: { en: "Play", hi: "चलाएँ" } satisfies Localized,
    pause: { en: "Pause", hi: "रोकें" } satisfies Localized,
    speed: { en: "Speed", hi: "गति" } satisfies Localized,
    sleepTimer: { en: "Sleep timer", hi: "निद्रा समय" } satisfies Localized,
    sleepOff: { en: "Off", hi: "बंद" } satisfies Localized,
    background: { en: "Background", hi: "पृष्ठभूमि" } satisfies Localized,
    backgroundOn: { en: "Sound on", hi: "ध्वनि चालू" } satisfies Localized,
    backgroundOff: { en: "Sound off", hi: "ध्वनि बंद" } satisfies Localized,
    complete: { en: "Complete", hi: "पूर्ण करें" } satisfies Localized,
    leave: { en: "Leave", hi: "बाहर जाएँ" } satisfies Localized,
    minutesUnit: { en: "min", hi: "मिनट" } satisfies Localized,
  },

  // --- Completion screen ---
  completion: {
    // Rotating closing lines (English verbatim).
    closing: [
      {
        en: "You showed up. That is the whole practice.",
        hi: "आप उपस्थित हुए। यही पूरा अभ्यास है।",
      },
      {
        en: "The practice is done. Carry a little of this quiet with you.",
        hi: "अभ्यास पूर्ण हुआ। इस शांति का थोड़ा अंश अपने साथ ले जाएँ।",
      },
      {
        en: "Well sat. Tomorrow, the same time.",
        hi: "अच्छी बैठक रही। कल, उसी समय।",
      },
    ] satisfies Localized[],

    dayStreak: { en: "day streak", hi: "दिन की निरंतरता" } satisfies Localized,
    alreadyToday: {
      en: "Already kept today — rest easy.",
      hi: "आज पहले ही निभाया जा चुका — निश्चिंत रहें।",
    } satisfies Localized,

    reflectHeading: { en: "Add a reflection", hi: "एक चिंतन जोड़ें" } satisfies Localized,
    reflectPrompt: {
      en: "How did that sit with you? One honest line.",
      hi: "वह आपके भीतर कैसा बैठा? एक सच्ची पंक्ति।",
    } satisfies Localized,
    reflectSave: { en: "Save reflection", hi: "चिंतन सहेजें" } satisfies Localized,
    reflectSaved: { en: "Saved", hi: "सहेजा गया" } satisfies Localized,

    returnToday: { en: "Return to Today", hi: "आज पर लौटें" } satisfies Localized,
  },
} as const;

// Milestone lines, keyed by the streak number (English verbatim).
export const MILESTONE_LINES: Record<number, Localized> = {
  7: {
    en: "Seven days. You've begun what most never do.",
    hi: "सात दिन। आपने वह आरंभ किया जो अधिकांश कभी नहीं करते।",
  },
  21: {
    en: "Twenty-one days. This is a habit now.",
    hi: "इक्कीस दिन। अब यह एक आदत बन चुकी है।",
  },
  40: {
    en: "Forty days — a full sadhana. Something has quietly shifted.",
    hi: "चालीस दिन — एक पूर्ण साधना। भीतर कुछ चुपचाप बदल गया है।",
  },
  108: {
    en: "One hundred and eight. A sacred number, earned.",
    hi: "एक सौ आठ। एक पवित्र संख्या, अर्जित की हुई।",
  },
};

/** The framing line for a given practice kind. */
export function framingForKind(kind: PracticeKind): Localized {
  switch (kind) {
    case "meditation":
    case "night":
      return SESSION_COPY.setup.framingMeditationNight;
    case "shloka":
    case "aarti":
      return SESSION_COPY.setup.framingShlokaAarti;
    case "japa":
      return SESSION_COPY.setup.framingJapa;
    default:
      return SESSION_COPY.setup.framingMeditationNight;
  }
}

/** The label for a given length option. */
export function lengthLabel(n: LengthOption): Localized {
  if (n === 5) return SESSION_COPY.setup.length5;
  if (n === 15) return SESSION_COPY.setup.length15;
  return SESSION_COPY.setup.length10;
}

/**
 * The default length for a kind. Meditation defaults to its resolved minutes
 * when that is one of 5/10/15; otherwise (and for every other kind) 10.
 */
export function defaultLength(
  kind: PracticeKind,
  resolvedMinutes: number | undefined,
): LengthOption {
  if (kind === "meditation" && resolvedMinutes != null) {
    if (resolvedMinutes === 5 || resolvedMinutes === 10 || resolvedMinutes === 15) {
      return resolvedMinutes;
    }
  }
  return 10;
}

/** Format a number of seconds as M:SS. */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}
