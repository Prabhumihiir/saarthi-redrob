// components/ui/Button.tsx — the app's primary action element.

import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANTS: Record<Variant, string> = {
  // Saffron fill, white text — the default call to action.
  // Slight lift on hover via a soft saffron-tinted shadow.
  primary:
    "bg-saffron text-white shadow-[0_8px_22px_-10px_rgba(232,132,60,0.55)] hover:bg-saffrondeep hover:shadow-[0_12px_28px_-10px_rgba(232,132,60,0.65)] active:bg-saffrondeep disabled:opacity-50 disabled:shadow-none",
  // Text-only, low emphasis.
  ghost:
    "bg-transparent text-ink hover:bg-surface2 disabled:opacity-50",
  // Raised surface with hairline border, medium emphasis.
  outline:
    "bg-surface2 text-ink border border-hairline hover:border-saffron hover:text-saffron disabled:opacity-50",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-13 px-6 text-base py-3.5",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  type,
  ...props
}: ButtonProps) {
  return (
    <button
      // Default to type="button" so buttons don't accidentally submit forms.
      type={type ?? "button"}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
        "disabled:cursor-not-allowed",
        VARIANTS[variant],
        SIZES[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
