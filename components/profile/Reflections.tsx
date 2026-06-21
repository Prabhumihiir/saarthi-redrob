"use client";

// components/profile/Reflections.tsx — the user's gathered reflections.
// Lists state.reflections (already newest-first from the hook), each showing
// its date, text, and the practice tag if present. Each entry can be removed
// via deleteReflection(id). A calm empty state holds the space when there are
// none yet.

import type { Lang } from "@/lib/types";
import { useSaarthi } from "@/lib/state";
import { t } from "@/lib/i18n";
import { Card } from "@/components/ui";

interface ReflectionsProps {
  lang: Lang;
}

const copy = {
  heading: { en: "Your reflections", hi: "आपके चिंतन" },
  subtitle: {
    en: "A quiet record of what you have noticed, in your own words.",
    hi: "जो आपने अनुभव किया, आपके अपने शब्दों में एक मौन अभिलेख।",
  },
  empty: {
    en: "Your reflections will gather here, one honest line at a time.",
    hi: "आपके चिंतन यहाँ एकत्र होंगे, एक-एक सच्ची पंक्ति के साथ।",
  },
  delete: { en: "Remove this reflection", hi: "यह चिंतन हटाएँ" },
} as const;

/** Format an ISO "YYYY-MM-DD" into a gentle, readable date for the active lang. */
function formatDate(dateISO: string, lang: Lang): string {
  const d = new Date(`${dateISO}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateISO;
  try {
    return new Intl.DateTimeFormat(lang === "hi" ? "hi-IN" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return dateISO;
  }
}

export function Reflections({ lang }: ReflectionsProps) {
  const { reflections, deleteReflection } = useSaarthi();

  return (
    <Card as="section" aria-labelledby="reflections-heading">
      <h2
        id="reflections-heading"
        className="font-serif text-lg tracking-tight text-ink"
      >
        {t(copy.heading, lang)}
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        {t(copy.subtitle, lang)}
      </p>

      {reflections.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-hairline bg-surface2/40 px-4 py-7 text-center">
          <p className="mx-auto max-w-xs text-[14px] leading-relaxed text-faint">
            {t(copy.empty, lang)}
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {reflections.map((r) => (
            <li
              key={r.id}
              className="rounded-2xl border border-hairline bg-surface2/50 px-4 py-3.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-medium uppercase tracking-wide text-faint">
                      {formatDate(r.dateISO, lang)}
                    </span>
                    {r.practice ? (
                      <span className="inline-flex items-center rounded-full border border-saffron/30 bg-saffron/[0.10] px-2 py-0.5 text-[11px] font-medium text-saffron">
                        {r.practice}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1.5 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-ink">
                    {r.text}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => deleteReflection(r.id)}
                  aria-label={t(copy.delete, lang)}
                  title={t(copy.delete, lang)}
                  className={[
                    "-mr-1 -mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition-colors",
                    "hover:bg-surface2 hover:text-maroon",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                  ].join(" ")}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7M10 11v6M14 11v6" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
