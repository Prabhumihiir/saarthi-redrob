"use client";

// components/session/SetupScreen.tsx — stage 1 of the session player.
// Before any audio: the practice title + deity name, a one-line framing by
// kind, then the choices (length, guide, background, optional intention) and
// the Begin call to action.

import { useState } from "react";
import { useSaarthi } from "@/lib/state";
import { voices, backgrounds } from "@/lib/content";
import { t } from "@/lib/i18n";
import type { Lang, ResolvedPractice } from "@/lib/types";
import {
  SESSION_COPY,
  LENGTH_OPTIONS,
  type LengthOption,
  type SessionConfig,
  framingForKind,
  lengthLabel,
  defaultLength,
} from "./shared";

interface SetupScreenProps {
  practice: ResolvedPractice;
  lang: Lang;
  onBegin: (config: SessionConfig) => void;
}

export function SetupScreen({ practice, lang, onBegin }: SetupScreenProps) {
  const { setIntention } = useSaarthi();
  const copy = SESSION_COPY.setup;

  const [length, setLength] = useState<LengthOption>(() =>
    defaultLength(practice.kind, practice.minutes),
  );
  // The chosen guide is a PLACEHOLDER for the future produced / cloned deity
  // voice — the copy never presents it as the deity's actual voice.
  const [voiceId, setVoiceId] = useState<string>(voices[0].id);
  const [backgroundId, setBackgroundId] = useState<string>(backgrounds[0].id);
  const [intention, setIntentionText] = useState<string>("");

  const handleBegin = () => {
    const trimmed = intention.trim();
    // Persist the sankalp only when the user actually typed one.
    if (trimmed !== "") setIntention(trimmed);
    onBegin({ minutes: length, voiceId, backgroundId, intention: trimmed });
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-5 pb-10 pt-12">
      {/* Title + deity, with a faint accent glow behind. */}
      <header className="relative text-center">
        <div
          aria-hidden="true"
          className="glow-accent pointer-events-none absolute inset-x-0 -top-8 mx-auto h-40 w-40"
        />
        <p className="relative text-sm font-medium text-muted">
          {t(practice.deityName, lang)}
        </p>
        <h1 className="relative mt-1.5 font-serif text-[28px] leading-tight tracking-tight text-ink">
          {t(practice.title, lang)}
        </h1>
        <p className="relative mx-auto mt-4 max-w-xs text-[15px] leading-relaxed text-muted">
          {t(framingForKind(practice.kind), lang)}
        </p>
      </header>

      <div className="mt-10 space-y-8">
        {/* Length — segmented control. */}
        <Section heading={t(copy.lengthHeading, lang)}>
          <div
            role="radiogroup"
            aria-label={t(copy.lengthHeading, lang)}
            className="space-y-2.5"
          >
            {LENGTH_OPTIONS.map((n) => {
              const selected = n === length;
              return (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setLength(n)}
                  className={[
                    "flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left text-[15px] transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                    selected
                      ? "border-[color:var(--accent)] bg-[color:var(--accent)]/12 text-ink"
                      : "border-hairline bg-surface text-muted hover:border-[color:var(--accent)]/50 hover:text-ink",
                  ].join(" ")}
                >
                  <span className={selected ? "font-medium" : ""}>
                    {t(lengthLabel(n), lang)}
                  </span>
                  <RadioDot selected={selected} />
                </button>
              );
            })}
          </div>
        </Section>

        {/* Guide (voice). The chosen guide is a placeholder for the future
            produced / cloned deity voice — never presented as the deity. */}
        <Section heading={t(copy.guideHeading, lang)}>
          <div role="radiogroup" aria-label={t(copy.guideHeading, lang)} className="space-y-2.5">
            {voices.map((v) => {
              const selected = v.id === voiceId;
              return (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setVoiceId(v.id)}
                  className={[
                    "flex w-full items-start justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                    selected
                      ? "border-[color:var(--accent)] bg-[color:var(--accent)]/12"
                      : "border-hairline bg-surface hover:border-[color:var(--accent)]/50",
                  ].join(" ")}
                >
                  <span className="min-w-0">
                    <span
                      className={[
                        "block text-[15px]",
                        selected ? "font-medium text-ink" : "text-ink/90",
                      ].join(" ")}
                    >
                      {t(v.name, lang)}
                    </span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-muted">
                      {t(v.note, lang)}
                    </span>
                  </span>
                  <RadioDot selected={selected} className="mt-0.5 shrink-0" />
                </button>
              );
            })}
          </div>
        </Section>

        {/* Background — single-select chips. */}
        <Section heading={t(copy.backgroundHeading, lang)}>
          <div
            role="radiogroup"
            aria-label={t(copy.backgroundHeading, lang)}
            className="flex flex-wrap gap-2.5"
          >
            {backgrounds.map((b) => {
              const selected = b.id === backgroundId;
              return (
                <button
                  key={b.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setBackgroundId(b.id)}
                  className={[
                    "rounded-full border px-4 py-2.5 text-sm transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                    selected
                      ? "border-[color:var(--accent)] bg-[color:var(--accent)]/15 font-medium text-ink"
                      : "border-hairline bg-surface text-muted hover:border-[color:var(--accent)]/50 hover:text-ink",
                  ].join(" ")}
                >
                  {t(b.name, lang)}
                </button>
              );
            })}
          </div>
        </Section>

        {/* Intention (sankalp) — optional one-line input. */}
        <Section heading={t(copy.intentionHeading, lang)}>
          <input
            type="text"
            value={intention}
            onChange={(e) => setIntentionText(e.target.value)}
            placeholder={t(copy.intentionPlaceholder, lang)}
            maxLength={120}
            className="w-full rounded-2xl border border-hairline bg-surface px-4 py-3.5 text-[15px] text-ink placeholder:text-faint transition-colors focus:border-[color:var(--accent)] focus:outline-none"
          />
        </Section>
      </div>

      {/* Begin — themed to the deity accent. */}
      <div className="mt-10">
        <button
          type="button"
          onClick={handleBegin}
          className="inline-flex h-13 w-full items-center justify-center rounded-full bg-[color:var(--accent)] px-6 py-3.5 text-base font-medium text-white shadow-[0_10px_28px_-12px_rgba(0,0,0,0.7)] transition-opacity hover:opacity-90 active:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          {t(copy.begin, lang)}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small building blocks.
// ---------------------------------------------------------------------------
function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
        {heading}
      </h2>
      {children}
    </section>
  );
}

function RadioDot({
  selected,
  className,
}: {
  selected: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={[
        "grid h-5 w-5 place-items-center rounded-full border transition-colors",
        selected
          ? "border-[color:var(--accent)] bg-[color:var(--accent)]"
          : "border-hairline",
        className ?? "",
      ].join(" ")}
    >
      {selected ? (
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
      ) : null}
    </span>
  );
}
