// components/discover/icons.tsx — small inline stroke icons (currentColor) used
// across Discover for group markers and section affordances. Decorative only;
// always aria-hidden where rendered.

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

interface IconProps {
  size?: number;
}

export function SearchIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

export function ClearIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function ChevronIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function LotusIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <path d="M12 4c1.8 2.2 1.8 5.5 0 8-1.8-2.5-1.8-5.8 0-8Z" />
      <path d="M12 12c-1.6-1.4-3.9-1.7-6-.8 0 3 2.6 5.3 6 5.3" />
      <path d="M12 12c1.6-1.4 3.9-1.7 6-.8 0 3-2.6 5.3-6 5.3" />
      <path d="M5 17c2 1.6 4.4 2.4 7 2.4s5-.8 7-2.4" />
    </svg>
  );
}

export function VerseIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <path d="M5 4h9a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H5z" />
      <path d="M19 4h0a3 3 0 0 0-3 3v13" />
    </svg>
  );
}

export function FlameIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <path d="M12 3c2.5 3 4.5 5.4 4.5 8.5A4.5 4.5 0 0 1 12 16a4.5 4.5 0 0 1-4.5-4.5C7.5 8.4 9.5 6 12 3Z" />
      <path d="M12 20.5c2.5 0 4.5-1.4 4.5-3.5" />
      <path d="M12 20.5c-2.5 0-4.5-1.4-4.5-3.5" />
    </svg>
  );
}

export function StoryIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 0 4 20.5z" />
      <path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5a1.5 1.5 0 0 1 1.5 1.5z" />
    </svg>
  );
}

export function TalkIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <path d="M4 5h16v11H9l-4 3v-3H4z" />
      <path d="M8.5 10h7M8.5 13h4" />
    </svg>
  );
}

export function LessonIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <path d="M12 6.5C10.5 5 8.5 4.5 6 4.5V18c2.5 0 4.5.5 6 2 1.5-1.5 3.5-2 6-2V4.5c-2.5 0-4.5.5-6 2Z" />
      <path d="M12 6.5V20" />
    </svg>
  );
}

export function CollectionIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function SadhanaIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4v8l5 3" />
    </svg>
  );
}

export function LockIcon({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <rect x="5" y="10.5" width="14" height="9" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </svg>
  );
}
