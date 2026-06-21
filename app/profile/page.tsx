"use client";

// app/profile/page.tsx — the "You" tab (route stays /profile).
// Your practice, your way. Everything here persists immediately via the
// useSaarthi() hook + localStorage:
//   - chosen deity (changeable)   - sankalp (commitment) time
//   - tradition / sampradaya      - streak & practice stats
//   - language (EN / हिन्दी)       - reflections (list + delete)
//   - downloads (stub)            - Saarthi Plus + Gift (stub upsells)
//   - privacy reassurance         - start over (resetAll, confirmed)

import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Lang, Tradition, Localized } from "@/lib/types";
import { useSaarthi } from "@/lib/state";
import { getDeity } from "@/lib/content";
import { t } from "@/lib/i18n";
import { Card, Button, ScreenHeader } from "@/components/ui";
import { DeityPicker } from "@/components/profile/DeityPicker";
import { StreakStats } from "@/components/profile/StreakStats";
import { Reflections } from "@/components/profile/Reflections";
import { Downloads } from "@/components/profile/Downloads";
import { PlusCard, GiftCard } from "@/components/profile/PlusCard";

// ---------------------------------------------------------------------------
// Screen copy (inline Localized; switches with the active language).
// English strings are verbatim from the brief; Hindi is faithful and natural.
// ---------------------------------------------------------------------------
const copy = {
  title: { en: "You", hi: "आप" },
  subtitle: {
    en: "Your practice, your way.",
    hi: "आपका अभ्यास, आपके अनुसार।",
  },

  // Tradition / sampradaya
  traditionHeading: { en: "Your path", hi: "आपकी परंपरा" },
  traditionSubtitle: {
    en: "Your sampradaya gently shapes what Saarthi suggests.",
    hi: "आपकी सम्प्रदाय कोमलता से तय करती है कि सारथी क्या सुझाए।",
  },

  // Language
  languageHeading: { en: "Language", hi: "भाषा" },

  // Sankalp time
  sankalpHeading: { en: "Sankalp time", hi: "संकल्प का समय" },
  sankalpSubtitle: {
    en: "The hour you set aside each day to begin.",
    hi: "हर दिन आरंभ के लिए आपके द्वारा नियत समय।",
  },
  sankalpUnset: { en: "Not set yet", hi: "अभी तय नहीं" },

  // Privacy
  privacy: {
    en: "Your faith is yours. Saarthi never sells your data.",
    hi: "आपकी आस्था आपकी है। सारथी आपका डेटा कभी नहीं बेचता।",
  },

  // Start over
  startOver: { en: "Start over", hi: "नए सिरे से शुरू करें" },
  startOverHelp: {
    en: "Clear your choices, streak, and history, and begin from the welcome.",
    hi: "अपने चयन, निरंतरता और इतिहास को मिटाकर स्वागत से पुनः आरंभ करें।",
  },
  startOverConfirm: {
    en: "This will erase your streak, history, and all choices. Are you sure?",
    hi: "यह आपकी निरंतरता, इतिहास और सभी चयन मिटा देगा। क्या आप निश्चित हैं?",
  },

  // No-deity / onboarding prompt
  finishHeading: { en: "Finish setting up", hi: "सेटअप पूरा करें" },
  finishBody: {
    en: "Choose the form of the divine you'd like to walk with, and Saarthi will be ready each morning.",
    hi: "जिस दिव्य रूप के साथ आप चलना चाहें उसे चुनें, और सारथी हर सुबह तैयार रहेगा।",
  },
  finishCta: { en: "Begin onboarding", hi: "आरंभ करें" },
} satisfies Record<string, Localized>;

const TRADITIONS: { id: Tradition; label: Localized }[] = [
  { id: "shaiva", label: { en: "Shaiva", hi: "शैव" } },
  { id: "vaishnava", label: { en: "Vaishnava", hi: "वैष्णव" } },
  { id: "shakta", label: { en: "Shakta", hi: "शाक्त" } },
  { id: "unsure", label: { en: "Not sure yet", hi: "अभी निश्चित नहीं" } },
];

const LANGUAGES: { id: Lang; label: string }[] = [
  { id: "en", label: "English" },
  { id: "hi", label: "हिन्दी" },
];

export default function ProfilePage() {
  const router = useRouter();
  const {
    hydrated,
    deityId,
    lang,
    tradition,
    sankalpTime,
    streak,
    completedDates,
    setDeity,
    setLang,
    setTradition,
    setSankalpTime,
    resetAll,
  } = useSaarthi();

  // ---- Calm skeleton until persisted state is available. ----
  if (!hydrated) {
    return <ProfileSkeleton />;
  }

  const deity = getDeity(deityId);

  // ---- No deity chosen yet → gently prompt to finish onboarding. ----
  if (!deity) {
    return (
      <div className="space-y-5">
        <ScreenHeader
          title={t(copy.title, lang)}
          subtitle={t(copy.subtitle, lang)}
        />
        <Card as="section" className="text-center">
          <h2 className="font-serif text-xl tracking-tight text-ink">
            {t(copy.finishHeading, lang)}
          </h2>
          <p className="mx-auto mt-2 max-w-xs text-[15px] leading-relaxed text-muted">
            {t(copy.finishBody, lang)}
          </p>
          <Link href="/onboarding" className="mt-5 inline-block">
            <Button>{t(copy.finishCta, lang)}</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleStartOver = () => {
    // Confirm first; resetAll() wipes localStorage, then route to onboarding.
    const ok = window.confirm(t(copy.startOverConfirm, lang));
    if (!ok) return;
    resetAll();
    router.replace("/onboarding");
  };

  return (
    // Per-deity accent so accented sub-components (the picker, etc.) read the
    // chosen deity's color via --accent. The app shell provides the column.
    <div
      style={{ ["--accent" as string]: deity.accent }}
      className="space-y-5"
    >
      <ScreenHeader
        title={t(copy.title, lang)}
        subtitle={t(copy.subtitle, lang)}
      />

      {/* Chosen deity — changeable. Persists on tap. */}
      <DeityPicker deityId={deityId} lang={lang} onSelect={setDeity} />

      {/* Tradition / sampradaya. */}
      <Card as="section" aria-labelledby="tradition-heading">
        <h2
          id="tradition-heading"
          className="font-serif text-lg tracking-tight text-ink"
        >
          {t(copy.traditionHeading, lang)}
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          {t(copy.traditionSubtitle, lang)}
        </p>
        <div
          role="radiogroup"
          aria-label={t(copy.traditionHeading, lang)}
          className="mt-4 grid grid-cols-2 gap-2.5"
        >
          {TRADITIONS.map((item) => {
            const selected = tradition === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setTradition(item.id)}
                className={[
                  "rounded-2xl border px-4 py-3 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                  selected
                    ? "border-saffron bg-saffron/[0.08] text-saffron"
                    : "border-hairline bg-surface2/50 text-ink hover:border-saffron/50",
                ].join(" ")}
              >
                {t(item.label, lang)}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Language toggle. */}
      <Card as="section" aria-labelledby="language-heading">
        <div className="flex items-center justify-between gap-4">
          <h2
            id="language-heading"
            className="font-serif text-lg tracking-tight text-ink"
          >
            {t(copy.languageHeading, lang)}
          </h2>
          <div
            role="radiogroup"
            aria-label={t(copy.languageHeading, lang)}
            className="inline-flex rounded-full border border-hairline bg-surface2/60 p-1"
          >
            {LANGUAGES.map((item) => {
              const selected = lang === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setLang(item.id)}
                  className={[
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                    item.id === "hi" ? "font-deva" : "",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                    selected
                      ? "bg-saffron text-white"
                      : "text-muted hover:text-ink",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Sankalp time — editable, persists on change. */}
      <Card as="section" aria-labelledby="sankalp-heading">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2
              id="sankalp-heading"
              className="font-serif text-lg tracking-tight text-ink"
            >
              {t(copy.sankalpHeading, lang)}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {t(copy.sankalpSubtitle, lang)}
            </p>
          </div>
          <input
            type="time"
            value={sankalpTime ?? ""}
            onChange={(e) => setSankalpTime(e.target.value)}
            aria-label={t(copy.sankalpHeading, lang)}
            className={[
              "shrink-0 rounded-2xl border border-hairline bg-surface2/60 px-3.5 py-2.5 text-base font-medium text-ink [color-scheme:dark]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-card",
            ].join(" ")}
          />
        </div>
        {!sankalpTime ? (
          <p className="mt-3 text-xs text-muted">{t(copy.sankalpUnset, lang)}</p>
        ) : null}
      </Card>

      {/* Streak / practice stats: current streak (gold), total days, last 7. */}
      <StreakStats streak={streak} completedDates={completedDates} lang={lang} />

      {/* Reflections — list (newest first), delete, calm empty state. */}
      <Reflections lang={lang} />

      {/* Downloads — offline carry (stub empty state). */}
      <Downloads lang={lang} />

      {/* Saarthi Plus — membership upsell (stub). */}
      <PlusCard lang={lang} />

      {/* Gift Saarthi (stub). */}
      <GiftCard lang={lang} />

      {/* Privacy reassurance. */}
      <p className="px-2 text-center text-xs leading-relaxed text-muted">
        {t(copy.privacy, lang)}
      </p>

      {/* Start over — subtle, confirmed. */}
      <div className="pt-1 text-center">
        <button
          type="button"
          onClick={handleStartOver}
          className={[
            "rounded-full px-4 py-2 text-sm font-medium text-muted underline-offset-4 transition-colors",
            "hover:text-maroon hover:underline",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
          ].join(" ")}
        >
          {t(copy.startOver, lang)}
        </button>
        <p className="mx-auto mt-1 max-w-xs text-[11px] leading-relaxed text-faint">
          {t(copy.startOverHelp, lang)}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Calm loading skeleton — shown while !hydrated to avoid a hydration mismatch.
// ---------------------------------------------------------------------------
function ProfileSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-5">
      <div className="mb-6">
        <div className="h-9 w-28 rounded-lg bg-surface2" />
        <div className="mt-2 h-4 w-48 rounded bg-surface2/70" />
      </div>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-3xl border border-hairline bg-card p-5"
        >
          <div className="h-5 w-40 rounded bg-surface2" />
          <div className="mt-4 h-20 w-full rounded-2xl bg-surface2/60" />
        </div>
      ))}
    </div>
  );
}
