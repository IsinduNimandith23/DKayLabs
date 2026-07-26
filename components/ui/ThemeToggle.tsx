"use client";

import { useEffect, useState } from "react";

/**
 * Light/dark switch.
 *
 * Manual only by design: the site opens in light mode and only goes dark if
 * the visitor asks for it. The choice is stored in localStorage and re-applied
 * before paint by the inline script in app/layout.tsx.
 *
 * The `dark` class lives on <html>; every color token in globals.css is a CSS
 * variable keyed off it, so flipping the class re-themes the whole page.
 */
export default function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Sync initial state from whatever the pre-paint script already applied.
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
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
      className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-ink/10 bg-surface/70 text-ink backdrop-blur transition-colors duration-200 hover:border-primary/40 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
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
          className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
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
          className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
            isDark ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
          }`}
        >
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      </span>
    </button>
  );
}
