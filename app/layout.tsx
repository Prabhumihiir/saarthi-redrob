// app/layout.tsx — root server component.
// Loads the three typefaces via next/font and exposes them as CSS variables
// (--font-sans / --font-serif / --font-deva) consumed by Tailwind + globals.css.

import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, Noto_Serif_Devanagari } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const notoDeva = Noto_Serif_Devanagari({
  subsets: ["devanagari", "latin"],
  variable: "--font-deva",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Saarthi — Your guide, every day",
  description:
    "A short, personalized daily devotional practice for Sanatan dharma. From darkness, to light — every morning.",
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  // Dark devotional bg so the mobile browser chrome matches the app.
  themeColor: "#141009",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${notoDeva.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
