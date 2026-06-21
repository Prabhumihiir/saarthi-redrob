"use client";

// components/today/Greeting.tsx — the warm header of the Today screen:
// a time-of-day greeting paired with the chosen deity's name, with a faint
// accent glow behind the Devanagari name. The panchang line now lives in its
// own card (components/today/Panchang) directly below.

import { useEffect, useState } from "react";
import { ui, t } from "@/lib/i18n";
import type { Deity, Lang } from "@/lib/types";

interface GreetingProps {
  deity: Deity;
  lang: Lang;
}

/** Map a local hour to a greeting key. Morning < 12, afternoon < 17, else evening. */
function greetingKey(
  hour: number,
): "greetingMorning" | "greetingAfternoon" | "greetingEvening" {
  if (hour < 12) return "greetingMorning";
  if (hour < 17) return "greetingAfternoon";
  return "greetingEvening";
}

export function Greeting({ deity, lang }: GreetingProps) {
  // The greeting depends on the local clock. Resolve it in an effect
  // (client-only) so the server render never calls Date — avoiding a hydration
  // mismatch from the time of day.
  const [hour, setHour] = useState<number | null>(null);

  useEffect(() => {
    setHour(new Date().getHours());
  }, []);

  const greeting = hour === null ? null : t(ui[greetingKey(hour)], lang);

  return (
    <header className="mb-6">
      <p className="text-sm font-medium text-muted">
        {greeting ?? (
          <span className="inline-block h-4 w-28 animate-pulse rounded bg-line/70 align-middle" />
        )}
      </p>

      {/* Hero: "With {Deity}" + the Devanagari name over a faint accent glow. */}
      <div className="relative mt-2">
        <div
          aria-hidden="true"
          className="glow-accent pointer-events-none absolute -inset-x-6 -top-8 bottom-0 -z-10"
        />
        <h1 className="font-serif text-[34px] leading-[1.15] tracking-tight text-ink">
          {lang === "hi" ? (
            <>
              <span className="font-deva text-[color:var(--accent)]">
                {t(deity.name, lang)}
              </span>{" "}
              के साथ
            </>
          ) : (
            <>
              With{" "}
              <span className="text-[color:var(--accent)]">
                {t(deity.name, lang)}
              </span>
            </>
          )}{" "}
          <span className="align-baseline font-deva text-[28px] text-[color:var(--accent)]">
            {deity.devanagariName}
          </span>
        </h1>
      </div>
    </header>
  );
}
