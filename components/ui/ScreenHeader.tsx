// components/ui/ScreenHeader.tsx — consistent page heading in the serif face.

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function ScreenHeader({ title, subtitle, className }: ScreenHeaderProps) {
  return (
    <header
      className={["mb-6", className].filter(Boolean).join(" ")}
    >
      <h1 className="font-serif text-3xl leading-tight tracking-tight text-ink">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-1.5 text-[15px] leading-relaxed text-muted">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
