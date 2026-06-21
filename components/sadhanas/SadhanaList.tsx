"use client";

// components/sadhanas/SadhanaList.tsx — the list of available sadhanas on the
// index screen. Reads enrollment state per sadhana from useSaarthi() and hands
// each one to SadhanaCard. Keeping the state reads here lets SadhanaCard stay a
// pure presentational component.

import { useSaarthi } from "@/lib/state";
import { sadhanas } from "@/lib/content";
import type { Lang } from "@/lib/types";
import { SadhanaCard } from "./SadhanaCard";

interface SadhanaListProps {
  lang: Lang;
}

export function SadhanaList({ lang }: SadhanaListProps) {
  const { hydrated, isEnrolled, sadhanaDay } = useSaarthi();

  return (
    <ul className="space-y-3.5">
      {sadhanas.map((sadhana) => {
        const enrolled = isEnrolled(sadhana.id);
        const currentDay = sadhanaDay(sadhana.id, sadhana.length);
        return (
          <li key={sadhana.id}>
            <SadhanaCard
              sadhana={sadhana}
              lang={lang}
              hydrated={hydrated}
              enrolled={enrolled}
              currentDay={currentDay}
            />
          </li>
        );
      })}
    </ul>
  );
}
