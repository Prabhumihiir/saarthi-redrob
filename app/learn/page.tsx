"use client";

// app/learn/page.tsx — legacy route.
// Learn has been folded into Katha (stories, talks, and lessons now live at
// /katha). This page exists only so the old /learn URL keeps working: it
// replaces itself with /katha on mount, leaving no extra history entry.

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { t, ui } from "@/lib/i18n";
import { useSaarthi } from "@/lib/state";
import { Logo } from "@/components/Logo";

export default function LearnRedirect() {
  const router = useRouter();
  const { lang } = useSaarthi();

  useEffect(() => {
    router.replace("/katha");
  }, [router]);

  // Brief calm placeholder while the redirect takes effect.
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[50vh] flex-col items-center justify-center text-muted"
    >
      <Logo size={40} className="text-saffron/70" />
      <p className="mt-4 text-sm">{t(ui.loading, lang)}…</p>
    </div>
  );
}
