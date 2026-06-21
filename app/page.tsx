"use client";

// app/page.tsx — root route.
// While state is loading from localStorage, shows a calm centered splash with
// the Logo + tagline. Once hydrated, redirects to /today (returning user) or
// /onboarding (first run).

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSaarthi } from "@/lib/state";
import { t, ui } from "@/lib/i18n";
import { Logo } from "@/components/Logo";

export default function RootPage() {
  const router = useRouter();
  const { hydrated, onboarded, lang } = useSaarthi();

  useEffect(() => {
    if (!hydrated) return;
    router.replace(onboarded ? "/today" : "/onboarding");
  }, [hydrated, onboarded, router]);

  // Calm splash. Shown until we know where to send the user, so the redirect
  // never flashes the wrong screen and there's no hydration mismatch.
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="animate-breathe text-saffron">
        <Logo size={72} />
      </div>
      <h1 className="mt-6 font-serif text-4xl tracking-tight text-ink">
        {t(ui.appName, lang)}
      </h1>
      <p className="mt-2 max-w-[18rem] text-[15px] leading-relaxed text-muted">
        {t(ui.taglineLong, lang)}
      </p>
      <span className="sr-only" role="status">
        {t(ui.loading, lang)}
      </span>
    </div>
  );
}
