"use client";

// components/chant/ChantLoops.tsx
// A small ambient-loop player for the Chant screen. The user picks one looping
// bed (Tanpura or Temple bells, drawn from `backgrounds`) and plays / pauses it
// while they count their mala. Only one loop plays at a time.
//
// A single <audio> element is reused; switching the selected loop swaps its src.
// The play/pause state is kept in sync via the element's own events so external
// pauses (e.g. another tab) are reflected.
//
// TODO: replace with produced audio.

import { useCallback, useEffect, useRef, useState } from "react";
import { backgrounds } from "@/lib/content";
import { t } from "@/lib/i18n";
import type { Lang, Localized } from "@/lib/types";

interface ChantLoopsProps {
  lang: Lang;
}

const copy: Record<string, Localized> = {
  heading: { en: "Chant loop", hi: "जप ध्वनि" },
  blurb: {
    en: "An optional bed of sound to rest the count upon.",
    hi: "गिनती को टिकाने हेतु एक वैकल्पिक ध्वनि-आधार।",
  },
  play: { en: "Play", hi: "चलाएँ" },
  pause: { en: "Pause", hi: "रोकें" },
};

// Only the audible loops are offered here (Silence has no audio).
const LOOPS = backgrounds.filter((b) => b.audio !== null);

export function ChantLoops({ lang }: ChantLoopsProps) {
  // The currently selected loop id (defaults to the first audible loop).
  const [selectedId, setSelectedId] = useState<string>(LOOPS[0]?.id ?? "");
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const selected = LOOPS.find((l) => l.id === selectedId) ?? LOOPS[0];

  // Keep the button state in sync with the underlying element.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play().catch(() => setPlaying(false));
    } else {
      el.pause();
    }
  }, []);

  // Choosing a loop selects it and immediately starts that bed playing, so the
  // chips act as a one-tap loop picker.
  const selectLoop = useCallback(
    (id: string) => {
      const el = audioRef.current;
      setSelectedId(id);
      // Defer until the new src has applied to the element on the next paint.
      requestAnimationFrame(() => {
        if (!el) return;
        void el.play().catch(() => setPlaying(false));
      });
    },
    [],
  );

  if (!selected) return null;

  return (
    <section className="w-full">
      <h2 className="mb-1 font-serif text-xl tracking-tight text-ink">
        {t(copy.heading, lang)}
      </h2>
      <p className="mb-4 text-sm leading-relaxed text-muted">
        {t(copy.blurb, lang)}
      </p>

      <div className="rounded-3xl border border-hairline bg-surface p-4 shadow-[0_1px_2px_rgba(0,0,0,0.30),0_18px_40px_-22px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(244,236,221,0.04)]">
        <div className="flex items-center gap-3">
          {/* Play / pause the selected loop. */}
          <button
            type="button"
            onClick={togglePlay}
            aria-pressed={playing}
            aria-label={playing ? t(copy.pause, lang) : t(copy.play, lang)}
            title="Placeholder audio — to be replaced with produced recording."
            className={[
              "grid h-12 w-12 shrink-0 place-items-center rounded-full text-white transition-transform active:scale-95",
              "bg-[color:var(--accent)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
            ].join(" ")}
          >
            {playing ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.29-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
              </svg>
            )}
          </button>

          <div className="min-w-0">
            <p className="truncate text-[15px] font-medium text-ink">
              {t(selected.name, lang)}
            </p>
            <p className="text-[13px] text-muted">
              {playing ? t(copy.pause, lang) : t(copy.play, lang)}
            </p>
          </div>
        </div>

        {/* Loop picker — one-tap chips. */}
        <div className="mt-4 flex flex-wrap gap-2">
          {LOOPS.map((loop) => {
            const active = loop.id === selectedId;
            return (
              <button
                key={loop.id}
                type="button"
                onClick={() => selectLoop(loop.id)}
                aria-pressed={active}
                className={[
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                  active
                    ? "border-[color:var(--accent)] bg-[color:var(--accent)]/12 text-[color:var(--accent)]"
                    : "border-hairline bg-surface2 text-muted hover:text-ink",
                ].join(" ")}
              >
                {t(loop.name, lang)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Looping ambient bed. // TODO: replace with produced audio. */}
      <audio ref={audioRef} src={selected.audio ?? undefined} loop preload="none" />
    </section>
  );
}
