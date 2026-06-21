"use client";

// components/onboarding/StepDots.tsx — a quiet step indicator for the
// onboarding flow. Renders a row of dots; the active step is filled with the
// saffron primary, completed steps are a soft saffron, upcoming ones the line
// color. Purely presentational.

interface StepDotsProps {
  /** Total number of steps. */
  total: number;
  /** The current (zero-based) step index. */
  current: number;
  /** Accessible label for the progress region. */
  label: string;
}

export function StepDots({ total, current, label }: StepDotsProps) {
  return (
    <div
      className="flex items-center justify-center gap-2"
      role="progressbar"
      aria-label={label}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current + 1}
    >
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === current;
        const isDone = i < current;
        return (
          <span
            key={i}
            aria-hidden="true"
            className={[
              "h-1.5 rounded-full transition-all duration-300",
              isActive
                ? "w-6 bg-saffron"
                : isDone
                  ? "w-1.5 bg-saffron/40"
                  : "w-1.5 bg-line",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}
