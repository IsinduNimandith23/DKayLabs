import type { Config } from "tailwindcss";

/**
 * DKAYLABS - Tailwind theme.
 * All brand colors live here. Tweak a hex once and it cascades site-wide.
 * Usage examples: bg-charcoal, text-crimson, border-silver/30, shadow-glow.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- Backgrounds (black editorial with a faint red warmth) ---
        charcoal: "#1B1416", // warm near-black - primary surface
        obsidian: "#0D090A", // black with red undertone - page base
        void: "#000000", // pure black - deep contrast wells

        // --- Primary accent ---
        crimson: {
          DEFAULT: "#C1121F", // vivid magazine red
          dark: "#8C0E14", // deeper red for depth/shadows
          glow: "#FF2E3F", // hot edge used for glows/highlights
        },

        // --- Highlights / neutrals ---
        snow: "#F6EFEC", // warm ivory text
        silver: {
          DEFAULT: "#C4B2B0", // warm rose-gray - secondary text
          dim: "#8A7A79", // muted warm gray for tertiary text
        },
      },
      fontFamily: {
        // Wired up to next/font CSS variables in app/layout.tsx
        display: ["var(--font-display)", "Georgia", "serif"], // Abril Fatface
        body: ["var(--font-body)", "system-ui", "sans-serif"], // Archivo
      },
      boxShadow: {
        // Hot-red rim-glow used on cards, buttons, the 3D frame, etc.
        glow: "0 0 24px -2px rgba(255,46,63,0.55)",
        "glow-lg": "0 0 60px -8px rgba(255,46,63,0.65)",
        "glow-soft": "0 0 40px -10px rgba(255,46,63,0.35)",
        bevel: "inset 0 1px 0 0 rgba(246,239,236,0.08)", // subtle ivory sheen
      },
      backgroundImage: {
        "metal-sheen":
          "linear-gradient(135deg, rgba(246,239,236,0.10) 0%, rgba(228,183,179,0.04) 40%, rgba(0,0,0,0) 60%)",
        "crimson-fade":
          "radial-gradient(60% 60% at 50% 0%, rgba(255,46,63,0.20) 0%, rgba(255,46,63,0) 70%)",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.55", filter: "blur(40px)" },
          "50%": { opacity: "1", filter: "blur(52px)" },
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
