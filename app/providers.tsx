"use client";

// app/providers.tsx — client-side app frame.
// Wraps everything in the Saarthi state provider and lays out the responsive
// shell: a centered content column with room for the bottom tab bar (mobile)
// or the left rail (desktop). <Nav> hides itself on "/" and /onboarding.

import type { ReactNode } from "react";
import { SaarthiProvider } from "@/lib/state";
import { Nav } from "@/components/Nav";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SaarthiProvider>
      {/* Leave space for the left rail on desktop. */}
      <div className="min-h-dvh sm:pl-20">
        <main className="mx-auto w-full max-w-md px-5 pb-28 pt-6 sm:pb-10">
          {children}
        </main>
      </div>
      <Nav />
    </SaarthiProvider>
  );
}
