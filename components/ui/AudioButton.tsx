"use client";

// components/ui/AudioButton.tsx — accessible play/pause for an <audio> element.
// The audio files are placeholders for now.
// TODO: replace with produced audio.

import { useEffect, useRef, useState } from "react";

interface AudioButtonProps {
  src: string;
  label?: string;
  className?: string;
}

export function AudioButton({ src, label, className }: AudioButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  // Keep React state in sync if playback ends or is paused elsewhere.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onEnded = () => setPlaying(false);
    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    el.addEventListener("ended", onEnded);
    el.addEventListener("pause", onPause);
    el.addEventListener("play", onPlay);
    return () => {
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("play", onPlay);
    };
  }, []);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play().catch(() => {
        // Autoplay/availability failures shouldn't break the UI.
        setPlaying(false);
      });
    } else {
      el.pause();
    }
  };

  const text = label ?? (playing ? "Pause" : "Play");

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? `Pause ${label ?? "audio"}` : `Play ${label ?? "audio"}`}
      // Surfaces that this is a placeholder track on hover/focus.
      title="Placeholder audio — to be replaced with produced recording."
      className={[
        "inline-flex items-center gap-2.5 rounded-full border border-hairline bg-surface2 px-4 py-2.5 text-sm font-medium text-ink transition-colors",
        "hover:border-saffron hover:text-saffron",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        aria-hidden="true"
        className="grid h-7 w-7 place-items-center rounded-full bg-saffron text-white"
      >
        {playing ? (
          // Pause icon
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          // Play icon
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.29-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
          </svg>
        )}
      </span>
      <span>{text}</span>
      {/* TODO: replace with produced audio. */}
      <audio ref={audioRef} src={src} preload="none" />
    </button>
  );
}
