// components/Logo.tsx — the Saarthi charioteer mark.
// Original artwork: a rising sun whose rays form the spokes of a chariot wheel
// (Krishna the charioteer; "from darkness, to light"). Single-color via
// currentColor so it inherits the surrounding text color.

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label="Saarthi"
      className={className}
    >
      <g
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Horizon */}
        <path d="M5 35 H43" />
        {/* Wheel / sun disc */}
        <circle cx="24" cy="21" r="9.5" />
        {/* Spokes that read as rays */}
        <path d="M24 11.5 V30.5 M14.5 21 H33.5 M17.3 14.3 L30.7 27.7 M30.7 14.3 L17.3 27.7" />
      </g>
      {/* Hub */}
      <circle cx="24" cy="21" r="2.4" fill="currentColor" />
    </svg>
  );
}

interface WordmarkProps {
  className?: string;
  /** Size of the mark; the text scales relative to it. */
  size?: number;
}

/** The mark paired with the "Saarthi" wordmark in the serif face. */
export function Wordmark({ className, size = 32 }: WordmarkProps) {
  return (
    <span className={["inline-flex items-center gap-2.5", className].filter(Boolean).join(" ")}>
      <Logo size={size} />
      <span className="font-serif text-2xl tracking-tight">Saarthi</span>
    </span>
  );
}
