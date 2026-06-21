// components/ui/Badge.tsx — small pill for labels, streaks, and statuses.

import type { ReactNode } from "react";

type Tone = "gold" | "saffron" | "muted";

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

const TONES: Record<Tone, string> = {
  // Used sparingly for achievements / streaks: gold text on a gold-tint fill.
  gold: "bg-goldsoft text-gold border border-gold/30",
  saffron: "bg-saffron/12 text-saffron border border-saffron/30",
  muted: "bg-surface2 text-muted border border-hairline",
};

export function Badge({ children, tone = "muted", className }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium leading-none",
        TONES[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
