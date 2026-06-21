"use client";

// app/practice/page.tsx — the devotional core for the chosen deity.
// Two living sections — Shlokas / Mantras and Aarti / Sandhya — each rendered
// from lib/content.ts for the user's chosen deity, with a "Begin" that opens the
// session player. A quiet third link points to Japa, which now lives at /chant.

import Link from "next/link";
import type { Lang, Localized } from "@/lib/types";
import { useSaarthi } from "@/lib/state";
import { getDeity } from "@/lib/content";
import { t } from "@/lib/i18n";
import { Button, ScreenHeader } from "@/components/ui";
import { ShlokaCard } from "@/components/practice/ShlokaCard";

const copy: Record<string, Localized> = {
  title: { en: "Your practice", hi: "आपका अभ्यास" },
  // {name} is replaced with the deity's localized name.
  subtitle: {
    en: "The daily devotions for {name} — chant, shloka, and aarti.",
    hi: "{name} के लिए दैनिक भक्ति — जप, श्लोक और आरती।",
  },

  shlokasHeading: { en: "Shlokas & Mantras", hi: "श्लोक और मंत्र" },
  shlokasNote: {
    en: "Recite slowly, letting each verse settle.",
    hi: "धीरे-धीरे जप करें, प्रत्येक श्लोक को मन में बैठने दें।",
  },
  noShlokas: {
    en: "No shlokas are available for this companion yet.",
    hi: "इस सहचर के लिए अभी कोई श्लोक उपलब्ध नहीं हैं।",
  },

  aartiHeading: { en: "Aarti & Sandhya", hi: "आरती और संध्या" },
  aartiNote: {
    en: "Offered as the daily aarti, morning or evening.",
    hi: "दैनिक आरती के रूप में, प्रातः या संध्या में अर्पित।",
  },
  dailyAarti: { en: "Daily aarti", hi: "दैनिक आरती" },
  noAarti: {
    en: "No aarti is available for this companion yet.",
    hi: "इस सहचर के लिए अभी कोई आरती उपलब्ध नहीं है।",
  },

  // Quiet link out to Japa (now its own screen at /chant).
  japaTitle: {
    en: "Japa — one name, one hundred and eight times",
    hi: "जप — एक नाम, एक सौ आठ बार",
  },
  japaNote: {
    en: "Let the count carry the mind into stillness.",
    hi: "गणना को मन की स्थिरता तक ले जाने दें।",
  },

  // Onboarding fallback when no deity is chosen.
  chooseTitle: { en: "Choose your companion", hi: "अपना सहचर चुनें" },
  chooseBody: {
    en: "Finish setting up Saarthi to begin your daily practice.",
    hi: "अपनी दैनिक साधना आरंभ करने के लिए सारथी की स्थापना पूरी करें।",
  },
  chooseCta: { en: "Continue setup", hi: "स्थापना जारी रखें" },
};

/** Small section heading shared across the blocks. */
function SectionHeading({ title, note }: { title: string; note?: string }) {
  return (
    <div className="mb-3">
      <h2 className="font-serif text-xl text-ink">{title}</h2>
      {note ? <p className="mt-0.5 text-sm text-muted">{note}</p> : null}
    </div>
  );
}

/** Build a session-player URL per the SESSION PLAYER URL CONTRACT. */
function sessionHref(kind: string, deityId: string, itemId?: string): string {
  return (
    "/session?kind=" +
    kind +
    "&deity=" +
    deityId +
    (itemId ? "&item=" + itemId : "")
  );
}

export default function PracticePage() {
  const { hydrated, deityId, lang } = useSaarthi();

  // 1) Calm dark skeleton while persisted state hydrates (avoids mismatch).
  if (!hydrated) {
    return (
      <main className="mx-auto min-h-screen max-w-md px-5 pb-28 pt-10 sm:pb-12">
        <div className="animate-pulse space-y-6" aria-hidden="true">
          <div className="h-9 w-44 rounded-full bg-surface2" />
          <div className="h-5 w-64 rounded-full bg-surface2/70" />
          <div className="h-44 rounded-3xl bg-surface2/60" />
          <div className="h-44 rounded-3xl bg-surface2/60" />
        </div>
        <span className="sr-only">{t(copy.title, lang)}</span>
      </main>
    );
  }

  // 2) No deity chosen yet — gently route back to onboarding.
  const deity = getDeity(deityId);
  if (!deity) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 pb-28 pt-10 text-center sm:pb-12">
        <h1 className="font-serif text-2xl text-ink">{t(copy.chooseTitle, lang)}</h1>
        <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-muted">
          {t(copy.chooseBody, lang)}
        </p>
        <Link href="/onboarding" className="mt-6">
          <Button>{t(copy.chooseCta, lang)}</Button>
        </Link>
      </main>
    );
  }

  const subtitle = t(copy.subtitle, lang).replace("{name}", t(deity.name, lang));

  return (
    // Per-deity accent exposed as --accent for arbitrary Tailwind values.
    <div style={{ ["--accent" as string]: deity.accent }}>
      <main className="mx-auto min-h-screen max-w-md px-5 pb-28 pt-10 sm:pb-12">
        <ScreenHeader title={t(copy.title, lang)} subtitle={subtitle} />

        {/* 1) Shlokas / Mantras */}
        <section className="mb-10" aria-labelledby="practice-shlokas">
          <div id="practice-shlokas">
            <SectionHeading
              title={t(copy.shlokasHeading, lang)}
              note={t(copy.shlokasNote, lang)}
            />
          </div>
          {deity.shlokas.length > 0 ? (
            <div className="space-y-4">
              {deity.shlokas.map((shloka) => (
                <ShlokaCard
                  key={shloka.id}
                  shloka={shloka}
                  lang={lang}
                  beginHref={sessionHref("shloka", deity.id, shloka.id)}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-3xl border border-hairline bg-card p-5 text-sm text-muted">
              {t(copy.noShlokas, lang)}
            </p>
          )}
        </section>

        {/* 2) Aarti / Sandhya */}
        <section className="mb-10" aria-labelledby="practice-aarti">
          <div id="practice-aarti">
            <SectionHeading
              title={t(copy.aartiHeading, lang)}
              note={t(copy.aartiNote, lang)}
            />
          </div>
          {deity.aarti ? (
            <ShlokaCard
              shloka={deity.aarti}
              lang={lang}
              eyebrow={t(copy.dailyAarti, lang)}
              beginHref={sessionHref("aarti", deity.id)}
            />
          ) : (
            <p className="rounded-3xl border border-hairline bg-card p-5 text-sm text-muted">
              {t(copy.noAarti, lang)}
            </p>
          )}
        </section>

        {/* 3) Quiet link out to Japa (its own screen at /chant). */}
        <section aria-labelledby="practice-japa">
          <h2 id="practice-japa" className="sr-only">
            {t(copy.japaTitle, lang)}
          </h2>
          <Link
            href="/chant"
            className="group flex items-center gap-4 rounded-3xl border border-hairline bg-card px-5 py-4 transition-colors hover:border-[color:var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            <span
              aria-hidden="true"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[color:var(--accent)]/10 text-[color:var(--accent)] transition-colors group-hover:bg-[color:var(--accent)]/15"
            >
              <BeadsIcon />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-serif text-[15px] leading-snug text-ink">
                {t(copy.japaTitle, lang)}
              </span>
              <span className="mt-0.5 block text-sm leading-relaxed text-muted">
                {t(copy.japaNote, lang)}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5"
            >
              <ChevronIcon />
            </span>
          </Link>
        </section>
      </main>
    </div>
  );
}

// --- Inline stroke icons (currentColor) -------------------------------------

function BeadsIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="4.5" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="19.5" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="19.5" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="17.3" cy="17.3" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="6.7" cy="17.3" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="6.7" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
