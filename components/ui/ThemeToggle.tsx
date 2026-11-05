"use client";

import { useEffect, useState } from "react";

/**
 * Light/dark switch.
 *
 * Follows the OS `prefers-color-scheme` by default, including live changes
 * while the page is open. Clicking the toggle records an explicit choice in
 * localStorage, which from then on overrides the OS for that visitor.
 * (Clearing `localStorage.theme` hands control back to the OS.)
 *
 * The initial resolution happens before paint in the inline script in
 * app/layout.tsx, so there's no flash of the wrong theme.
 *
 * The `dark` class lives on <html>; every color token in globals.css is a CSS
 * variable keyed off it, so flipping the class re-themes the whole page.
 */
/**
 * Swap the theme class with every CSS transition switched off for that one
 * frame. Most surfaces carry a `transition-colors`, so a plain class flip
 * started hundreds of colour transitions at once - the main reason the
 * toggle's click-to-paint (INP) measured 400-500ms on a mid-range phone. The
 * theme is meant to snap anyway. The toggle's own sun/moon (`.theme-icon`)
 * is exempt in globals.css, so the one animation the visitor is watching -
 * the icon they just clicked - still plays.
 */
function flipTheme(dark: boolean) {
  const root = document.documentElement;
  root.classList.add("theme-switching");
  root.classList.toggle("dark", dark);
  // Two frames: the first paints the new theme with transitions off, the
  // second re-enables them once that style has been committed.
  requestAnimationFrame(() =>
    requestAnimationFrame(() => root.classList.remove("theme-switching")),
  );
}

export default function ThemeToggle({
  size = 44,
  className = "",
  variant = "default",
}: {
  /** Diameter in px - set to match the height of the row it sits in. */
  size?: number;
  className?: string;
  /**
   * "bare" drops the built-in border/background/blur *and* the inline
   * sizing, so a caller can supply its own surface and dimensions (the
   * navbar's .nav-btn, whose height is a responsive variable).
   *
   * This has to be a prop rather than overrides passed through `className`:
   * Tailwind resolves classes of equal specificity by stylesheet order, not
   * by their order in the string, so a passed-in `bg-transparent` would win
   * or lose arbitrarily - and beating the inline `style` would need
   * `!important` on top of that.
   */
  variant?: "default" | "bare";
}) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Sync initial state from whatever the pre-paint script already applied.
    setIsDark(document.documentElement.classList.contains("dark"));
    setMounted(true);

    // Track the OS setting live, but only while the visitor hasn't made an
    // explicit choice - otherwise their pick would be overwritten mid-session.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = (e: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem("theme");
      } catch {
        // Storage unavailable - treat as "no explicit choice" and follow the OS.
      }
      if (stored) return;
      flipTheme(e.matches);
      setIsDark(e.matches);
    };

    mq.addEventListener("change", onSystemChange);
    return () => mq.removeEventListener("change", onSystemChange);
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    flipTheme(next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Private mode / storage disabled - the toggle still works for this session.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      // Until mounted we don't know the real state, so describe the control
      // generically rather than announce a wrong one.
      aria-label={
        mounted
          ? isDark
            ? "Switch to light theme"
            : "Switch to dark theme"
          : "Toggle theme"
      }
      aria-pressed={mounted ? isDark : undefined}
      style={variant === "bare" ? undefined : { height: size, width: size }}
      className={`flex shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        variant === "bare"
          ? ""
          : "border border-ink/10 bg-surface/70 text-ink backdrop-blur transition-colors duration-200 hover:border-primary/40 hover:text-primary"
      } ${className}`}
    >
      {/* Sun and moon are swapped by opacity/rotation so there's no layout shift. */}
      <span className="relative block h-5 w-5">
        {/* Sun - shown in dark mode (click to go light) */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden
          className={`theme-icon absolute inset-0 h-5 w-5 transition-all duration-300 ${
            isDark ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
          }`}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>

        {/* Moon - shown in light mode (click to go dark) */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={`theme-icon absolute inset-0 h-5 w-5 transition-all duration-300 ${
            isDark ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
          }`}
        >
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      </span>
    </button>
  );
}
