"use client";

// app/sadhanas/[id]/page.tsx — a single sadhana's detail screen.
// Reads the plan via getSadhana(params.id), themes to its deity accent, and
// hands the body (description, progress, day-by-day unlock, enroll CTA) to
// SadhanaDetail. Guards on hydration and on an unknown id.

import Link from "next/link";
import { useSaarthi } from "@/lib/state";
import { getDeity, getSadhana } from "@/lib/content";
import { t } from "@/lib/i18n";
import type { Lang, Localized } from "@/lib/types";
import { Card, Button } from "@/components/ui";
import { SadhanaDetail } from "@/components/sadhanas/SadhanaDetail";

const copy: Record<string, Localized> = {
  back: { en: "All sadhanas", hi: "सभी साधनाएँ" },
  daysLabel: { en: "days", hi: "दिन" },
  withDeity: { en: "With", hi: "साथ" },
  notFoundTitle: { en: "This journey isn't here", hi: "यह यात्रा यहाँ नहीं है" },
  notFoundBody: {
    en: "We couldn't find that sadhana. Return to the list to choose a journey.",
    hi: "हमें वह साधना नहीं मिली। यात्रा चुनने के लिए सूची पर लौटें।",
  },
  notFoundCta: { en: "Back to sadhanas", hi: "साधनाओं पर लौटें" },
};

export default function SadhanaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { hydrated, lang } = useSaarthi();

  if (!hydrated) {
    return <DetailSkeleton />;
  }

  const sadhana = getSadhana(params.id);
  if (!sadhana) {
    return <NotFound lang={lang} />;
  }

  const deity = getDeity(sadhana.deityId);
  const accent = deity?.accent ?? "var(--saffron)";

  return (
    <main
      style={{ ["--accent" as string]: accent } as React.CSSProperties}
      className="mx-auto min-h-screen w-full max-w-md px-5 pb-28 pt-8 sm:pb-12"
    >
      {/* Back link. */}
      <Link
        href="/sadhanas"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-full"
      >
        <svg
          aria-hidden="true"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m13 18-6-6 6-6" />
        </svg>
        {t(copy.back, lang)}
      </Link>

      {/* Heading — serif title, length, and the companion deity. */}
      <header className="mb-6 mt-4">
        <h1 className="font-serif text-3xl leading-tight tracking-tight text-ink">
          {t(sadhana.title, lang)}
        </h1>
        <p className="mt-1.5 text-[15px] leading-relaxed text-muted">
          {t(sadhana.subtitle, lang)}
        </p>
        <p className="mt-3 text-xs uppercase tracking-wide text-muted">
          {sadhana.length} {t(copy.daysLabel, lang)}
          {deity ? (
            <>
              {" · "}
              {t(copy.withDeity, lang)}{" "}
              <span className="text-[color:var(--accent)]">
                {t(deity.name, lang)}
              </span>
            </>
          ) : null}
        </p>
      </header>

      <SadhanaDetail sadhana={sadhana} lang={lang} />
    </main>
  );
}

// ---------------------------------------------------------------------------
// Unknown id — a calm, non-alarming fallback back to the list.
// ---------------------------------------------------------------------------
function NotFound({ lang }: { lang: Lang }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 pb-28 pt-8 sm:pb-12">
      <Card className="text-center">
        <h1 className="font-serif text-2xl tracking-tight text-ink">
          {t(copy.notFoundTitle, lang)}
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-[15px] leading-relaxed text-muted">
          {t(copy.notFoundBody, lang)}
        </p>
        <Link href="/sadhanas" className="mt-6 inline-block">
          <Button size="md">{t(copy.notFoundCta, lang)}</Button>
        </Link>
      </Card>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Skeleton — calm placeholder shown while !hydrated.
// ---------------------------------------------------------------------------
function DetailSkeleton() {
  return (
    <main
      aria-hidden="true"
      className="mx-auto min-h-screen w-full max-w-md animate-pulse px-5 pb-28 pt-8 sm:pb-12"
    >
      <div className="h-3 w-24 rounded bg-line/50" />
      <div className="mb-6 mt-4">
        <div className="h-8 w-56 rounded-lg bg-line/70" />
        <div className="mt-3 h-4 w-48 rounded bg-line/50" />
        <div className="mt-3 h-3 w-32 rounded bg-line/40" />
      </div>
      <div className="rounded-3xl border border-hairline bg-surface p-5">
        <div className="h-4 w-full rounded bg-line/50" />
        <div className="mt-2 h-4 w-5/6 rounded bg-line/50" />
        <div className="mt-5 h-2 w-full rounded-full bg-line/60" />
        <div className="mt-6 h-12 w-full rounded-full bg-line/60" />
      </div>
      <div className="mt-5 space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-start gap-4 rounded-3xl border border-hairline bg-surface p-4"
          >
            <div className="h-10 w-10 shrink-0 rounded-full bg-line/70" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded bg-line/70" />
              <div className="h-3 w-full rounded bg-line/50" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
