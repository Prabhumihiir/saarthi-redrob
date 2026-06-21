"use client";

// components/Nav.tsx — primary navigation.
// Mobile: fixed bottom tab bar. Desktop (sm+): fixed left side-nav.
// Hides itself entirely on the splash ("/") and on onboarding.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSaarthi } from "@/lib/state";
import { t, ui } from "@/lib/i18n";
import type { ReactNode } from "react";

interface Tab {
  href: string;
  labelKey: string;
  icon: ReactNode;
}

// Simple line icons; stroke inherits currentColor.
const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const TABS: Tab[] = [
  {
    href: "/today",
    labelKey: "navToday",
    icon: (
      <svg {...iconProps} aria-hidden="true">
        {/* sunrise */}
        <path d="M3 18h18M5.5 18a6.5 6.5 0 0 1 13 0M12 3v4M4.2 9.2l1.4 1.4M19.8 9.2l-1.4 1.4" />
      </svg>
    ),
  },
  {
    href: "/discover",
    labelKey: "navDiscover",
    icon: (
      <svg {...iconProps} aria-hidden="true">
        {/* compass — explore / discover */}
        <circle cx="12" cy="12" r="9" />
        <path d="M15.4 8.6 13.5 13.5 8.6 15.4 10.5 10.5 15.4 8.6Z" />
      </svg>
    ),
  },
  {
    href: "/practice",
    labelKey: "navPractice",
    icon: (
      <svg {...iconProps} aria-hidden="true">
        {/* lotus / hands */}
        <path d="M12 4c1.6 1.8 1.6 4.2 0 6-1.6-1.8-1.6-4.2 0-6Z" />
        <path d="M5 10c2.4 0 4 1.6 4 4-2.4 0-4-1.6-4-4ZM19 10c-2.4 0-4 1.6-4 4 2.4 0 4-1.6 4-4Z" />
        <path d="M4 14c2.6 2.6 5 3.6 8 3.6s5.4-1 8-3.6" />
      </svg>
    ),
  },
  {
    href: "/companion",
    labelKey: "navCompanion",
    icon: (
      <svg {...iconProps} aria-hidden="true">
        {/* speech / guidance */}
        <path d="M4 5h16v11H9l-4 3v-3H4z" />
        <path d="M8.5 10h7M8.5 13h4" />
      </svg>
    ),
  },
  {
    href: "/profile",
    labelKey: "navYou",
    icon: (
      <svg {...iconProps} aria-hidden="true">
        {/* person */}
        <circle cx="12" cy="8.5" r="3.5" />
        <path d="M5 19a7 7 0 0 1 14 0" />
      </svg>
    ),
  },
];

export function Nav() {
  const pathname = usePathname();
  const { lang } = useSaarthi();

  // Hide on splash and onboarding flow.
  if (pathname === "/" || pathname.startsWith("/onboarding")) {
    return null;
  }

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      aria-label="Primary"
      className={[
        // Mobile: fixed bottom bar — raised surface, hairline edge, blur.
        "fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-surface2/95 backdrop-blur",
        "supports-[backdrop-filter]:bg-surface2/80",
        // Desktop: become a left rail.
        "sm:inset-y-0 sm:right-auto sm:left-0 sm:w-20 sm:border-r sm:border-t-0",
      ].join(" ")}
    >
      <ul
        className={[
          "mx-auto flex max-w-md items-stretch justify-between px-2 py-1",
          "sm:h-full sm:max-w-none sm:flex-col sm:items-center sm:justify-start sm:gap-1 sm:px-0 sm:py-6",
        ].join(" ")}
      >
        {TABS.map((tab) => {
          const active = isActive(tab.href);
          const label = t(ui[tab.labelKey], lang);
          return (
            <li key={tab.href} className="flex-1 sm:flex-none sm:w-full">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                aria-label={label}
                className={[
                  "group flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition-colors",
                  "sm:px-1 sm:py-2.5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
                  active
                    ? "text-saffron"
                    : "text-muted hover:text-ink",
                ].join(" ")}
              >
                <span aria-hidden="true">{tab.icon}</span>
                <span className="leading-none">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
