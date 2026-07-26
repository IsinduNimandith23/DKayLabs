import type { Config } from "tailwindcss";

/**
 * DKAYLABS - Tailwind theme.
 *
 * Tokens are semantic (role-based), not color-named:
 *   surfaces -> base / surface / sunken
 *   accents  -> primary / accent / on-primary
 *   text     -> ink / muted
 *
 * Every color resolves through a CSS variable defined in app/globals.css
 * (`:root` for light, `.dark` for dark). That means a single class like
 * `bg-surface` or `border-ink/10` works in BOTH themes with no `dark:`
 * variant - flipping the theme just re-points the variables.
 *
 * Variables hold bare "R G B" triplets so Tailwind's `<alpha-value>` slot
 * still works, i.e. `bg-primary/20` and `border-ink/10` behave normally.
 *
 * Usage examples: bg-surface, text-primary, border-ink/10, shadow-glow.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- Surfaces ---
        base: "rgb(var(--c-base) / <alpha-value>)", // page base
        surface: "rgb(var(--c-surface) / <alpha-value>)", // elevated cards / glass
        sunken: "rgb(var(--c-sunken) / <alpha-value>)", // recessed wells

        // --- Action accent (buttons, links, small text) ---
        primary: {
          DEFAULT: "rgb(var(--c-primary) / <alpha-value>)",
          dark: "rgb(var(--c-primary-dark) / <alpha-value>)",
          light: "rgb(var(--c-primary-light) / <alpha-value>)",
        },

        // --- Display accent (vivid orange: large headings, rules, decoration) ---
        accent: "rgb(var(--c-accent) / <alpha-value>)",

        // --- Label color that sits ON a primary fill ---
        // White in light mode, near-black in dark mode, so solid orange
        // buttons stay above 4.5:1 in both themes.
        "on-primary": "rgb(var(--c-on-primary) / <alpha-value>)",

        // --- Text ---
        ink: "rgb(var(--c-ink) / <alpha-value>)", // primary text; also drives border-ink/10
        muted: {
          DEFAULT: "rgb(var(--c-muted) / <alpha-value>)", // secondary text
          dim: "rgb(var(--c-muted-dim) / <alpha-value>)", // tertiary text
        },
      },
      fontFamily: {
        // Wired up to next/font CSS variables in app/layout.tsx
        display: ["var(--font-display)", "system-ui", "sans-serif"], // Space Grotesk
        body: ["var(--font-body)", "system-ui", "sans-serif"], // Space Grotesk
        mono: ["var(--font-mono)", "ui-monospace", "monospace"], // JetBrains Mono
      },
      boxShadow: {
        // Accent halo, driven by the theme's primary so it follows light/dark.
        // Kept restrained - the technical look is crisp, not haloed.
        glow: "0 0 20px -6px rgb(var(--c-primary) / 0.28)",
        "glow-lg": "0 0 48px -14px rgb(var(--c-primary) / 0.32)",
        "glow-soft": "0 0 32px -14px rgb(var(--c-primary) / 0.16)",
        // Card lift, tuned per theme via --c-shadow.
        bevel:
          "0 1px 2px 0 rgb(var(--c-shadow) / 0.06), 0 10px 30px -12px rgb(var(--c-shadow) / 0.12)",
      },
      backgroundImage: {
        "metal-sheen":
          "linear-gradient(135deg, rgb(var(--c-ink) / 0.04) 0%, rgb(var(--c-accent) / 0.03) 40%, rgb(var(--c-surface) / 0) 60%)",
        "primary-fade":
          "radial-gradient(60% 60% at 50% 0%, rgb(var(--c-accent) / 0.14) 0%, rgb(var(--c-accent) / 0) 70%)",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.45", filter: "blur(40px)" },
          "50%": { opacity: "0.8", filter: "blur(52px)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 6s ease-in-out infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        shimmer: "shimmer 2.5s linear infinite",
        marquee: "marquee 40s linear infinite",
        "marquee-slow": "marquee 75s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
