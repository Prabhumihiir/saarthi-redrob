import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm, deep, devotional dark palette — a dim mandir at dawn,
        // one oil lamp lit. Legacy keys keep their names but map to dark
        // values, so every existing token-based component goes dark.
        paper: "#141009",
        card: "#1E1810",
        ink: "#F4ECDD",
        muted: "#B7AB93",
        line: "#362C1E",
        saffron: "#E8843C",
        maroon: "#C2580F",
        gold: "#D9A441",
        // Per-deity accents (brightened to pop on dark).
        shiva: "#5B93D6",
        rama: "#3DA88E",
        ganesha: "#E8A33C",
        // New dark-palette aliases.
        surface: "#1E1810",
        surface2: "#271F15",
        hairline: "#362C1E",
        faint: "#8A7C66",
        saffrondeep: "#C2580F",
        goldsoft: "#3A2E18",
        bg: "#141009",
      },
      fontFamily: {
        // Mapped to the CSS vars set by next/font in app/layout.tsx.
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        deva: ["var(--font-deva)", "Georgia", "serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        // Slow, calm breath used by the Meditate screen.
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.85" },
          "50%": { transform: "scale(1.08)", opacity: "1" },
        },
      },
      animation: {
        breathe: "breathe 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
