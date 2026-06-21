// components/ui/Card.tsx — soft, rounded surface used throughout the app.

import type { ElementType, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Render as a different element (e.g. "section", "article", "li"). */
  as?: ElementType;
}

export function Card({ children, className, as }: CardProps) {
  const Tag = as ?? "div";
  return (
    <Tag
      className={[
        // Dark surface over the app bg: hairline border, ~20px radius,
        // a soft deep shadow for lift, plus a very subtle warm inset
        // highlight along the top edge (the lamp catching the rim).
        "rounded-3xl border border-hairline bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,0.30),0_18px_40px_-22px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(244,236,221,0.04)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Tag>
  );
}
