"use client";

// app/session/page.tsx — the Session Player: a full-screen, dark, audio-first
// flow for any practice. It reads ?kind=&deity=&item= from the URL, resolves a
// ResolvedPractice, and walks the user through three stages:
//   1) Setup     — choose length, guide, background, intention, then Begin.
//   2) Playing    — a calm, breathing full-screen with a self-managed timer.
//   3) Completion — mark the practice done, celebrate the streak, reflect.
//
// The component that reads useSearchParams() is wrapped in <Suspense> below, a
// hard requirement in Next 14.

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSaarthi } from "@/lib/state";
import { resolvePractice } from "@/lib/content";
import { t } from "@/lib/i18n";
import { Logo } from "@/components/Logo";
import type { Lang, PracticeKind, ResolvedPractice } from "@/lib/types";
import { SetupScreen } from "@/components/session/SetupScreen";
import { PlayingScreen } from "@/components/session/PlayingScreen";
import { CompletionScreen } from "@/components/session/CompletionScreen";
import { SESSION_COPY, type SessionConfig } from "@/components/session/shared";

// The valid session kinds, used to validate the ?kind= param.
const VALID_KINDS: PracticeKind[] = [
  "meditation",
  "shloka",
  "aarti",
  "night",
  "japa",
];

type Stage = "setup" | "playing" | "completion";

// ---------------------------------------------------------------------------
// Page (server/client boundary): wraps the search-param consumer in <Suspense>.
// ---------------------------------------------------------------------------
export default function SessionPage() {
  return (
    <Suspense fallback={<SessionSkeleton />}>
      <SessionFlow />
    </Suspense>
  );
}

// ---------------------------------------------------------------------------
// The flow itself. Reads ?kind=&deity=&item=, resolves the practice, and holds
// the three-stage local state machine.
// ---------------------------------------------------------------------------
function SessionFlow() {
  const { hydrated, lang } = useSaarthi();
  const params = useSearchParams();

  const kindParam = params.get("kind");
  const deityParam = params.get("deity");
  const itemParam = params.get("item");

  // Resolve the practice once per param set.
  const resolved: ResolvedPractice | undefined = useMemo(() => {
    if (!deityParam) return undefined;
    if (!kindParam || !VALID_KINDS.includes(kindParam as PracticeKind)) {
      return undefined;
    }
    return resolvePractice({
      kind: kindParam as PracticeKind,
      deityId: deityParam,
      itemId: itemParam ?? undefined,
    });
  }, [kindParam, deityParam, itemParam]);

  // Three-stage machine, plus the chosen setup config and the completion result.
  const [stage, setStage] = useState<Stage>("setup");
  const [config, setConfig] = useState<SessionConfig | null>(null);

  // 1) Quiet splash while persisted state hydrates.
  if (!hydrated) {
    return <SessionSkeleton />;
  }

  // 2) Couldn't resolve a practice (bad/missing params, unknown deity/item).
  if (!resolved) {
    return <SessionFallback lang={lang} />;
  }

  // 3) Theme the whole flow to the deity's accent via the --accent CSS var.
  return (
    <main
      style={{ ["--accent" as string]: resolved.deityAccent } as React.CSSProperties}
      className="min-h-[100dvh] w-full bg-bg text-ink"
    >
      {stage === "setup" ? (
        <SetupScreen
          practice={resolved}
          lang={lang}
          onBegin={(cfg) => {
            setConfig(cfg);
            setStage("playing");
          }}
        />
      ) : null}

      {stage === "playing" && config ? (
        <PlayingScreen
          practice={resolved}
          lang={lang}
          config={config}
          onComplete={() => setStage("completion")}
        />
      ) : null}

      {stage === "completion" && config ? (
        <CompletionScreen practice={resolved} lang={lang} config={config} />
      ) : null}
    </main>
  );
}

// ---------------------------------------------------------------------------
// Hydration / Suspense splash — calm and dark, never flashes state.
// ---------------------------------------------------------------------------
function SessionSkeleton() {
  return (
    <main className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-bg px-6 text-muted">
      <Logo size={40} className="text-saffron/60" />
      <p className="mt-4 text-sm">{t({ en: "Preparing", hi: "तैयारी हो रही है" }, "en")}…</p>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Fallback — shown when the practice can't be resolved. Calm, with a way back.
// ---------------------------------------------------------------------------
function SessionFallback({ lang }: { lang: Lang }) {
  const copy = SESSION_COPY.fallback;
  return (
    <main className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-bg px-6 text-center">
      <div className="relative">
        <div
          aria-hidden="true"
          className="glow-saffron pointer-events-none absolute inset-0 -m-10"
        />
        <Logo size={36} className="relative text-saffron/70" />
      </div>
      <h1 className="mt-6 font-serif text-2xl tracking-tight text-ink">
        {t(copy.title, lang)}
      </h1>
      <p className="mx-auto mt-2 max-w-xs text-[15px] leading-relaxed text-muted">
        {t(copy.body, lang)}
      </p>
      <Link
        href="/today"
        className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-saffron px-6 text-[15px] font-medium text-white transition-colors hover:bg-saffrondeep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        {t(copy.cta, lang)}
      </Link>
    </main>
  );
}
