"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SITE } from "@/lib/constants";

const TZ = "Asia/Colombo";
const CODE = "CMB";
/** How long each readout holds before the next slides up. */
const HOLD_MS = 5000;

/**
 * SITE.hours reads "Available 24/7", which is far too wide to sit beside a
 * centred wordmark in a 648px capsule - it collides with the logo. Only the
 * tail goes in the bar; the full phrasing is shown in the menu and footer.
 */
const HOURS_SHORT = SITE.hours.replace(/^available\s+/i, "");

function formatTime() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

/**
 * Small telemetry readout in the navbar, cycling the studio's local time
 * and availability. Desktop only - there's no room for it in the collapsed
 * capsule on a phone.
 *
 * Both rows stay mounted in one grid cell and are masked by the parent's
 * overflow, so the swap is a pure transform with no layout work.
 */
export default function NavClock() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState("--:--");
  const [index, setIndex] = useState(0);

  /* The server has no idea what the client's clock reads, so rendering a
     real time on the server is a guaranteed hydration mismatch. Start with
     a placeholder and fill it in after mount. */
  useEffect(() => {
    setMounted(true);
    setTime(formatTime());
  }, []);

  // Minute-resolution display, so resync on the minute rather than on a
  // fixed interval that would drift across the boundary.
  useEffect(() => {
    if (!mounted) return;

    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      setTime(formatTime());
      timeout = setTimeout(tick, 60000 - (Date.now() % 60000));
    };
    timeout = setTimeout(tick, 60000 - (Date.now() % 60000));

    return () => clearTimeout(timeout);
  }, [mounted]);

  useEffect(() => {
    if (!mounted || reduced) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % 2), HOLD_MS);
    return () => clearInterval(id);
  }, [mounted, reduced]);

  // Both rows are deliberately the same short length, so the readout is a
  // fixed-size block that can never grow into the centred logo.
  const rows = [
    { code: CODE, value: time },
    { code: "OPEN", value: HOURS_SHORT },
  ];
  // Reduced motion gets the time only - nothing to rotate between.
  const active = reduced ? 0 : index;
  const row = rows[active];

  return (
    <div
      // A hard width, not a min: the logo is absolutely centred, so anything
      // that lets this block grow pushes it under the wordmark. Combined with
      // tabular-nums it also keeps the digits from re-measuring the bar's
      // flex line on every scrub frame.
      className="hidden w-[4.5rem] justify-end overflow-hidden font-mono text-[11px] uppercase tracking-wider lg:grid"
      style={{ gridTemplateAreas: '"a"' }}
      /* Decorative telemetry. A readout that swaps itself every five
         seconds is hostile to a screen reader, and the same facts (hours,
         location) are announced properly in the menu and the footer. */
      aria-hidden
    >
      {/* Outgoing and incoming rows share the single grid area, so they
          stack during the swap and the motion is always upward. */}
      <AnimatePresence initial={false}>
        <motion.span
          key={active}
          className="flex items-center gap-1.5 whitespace-nowrap tabular-nums [grid-area:a]"
          initial={{ y: "105%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-105%", opacity: 0 }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
          }
        >
          <span className="text-muted-dim">{row.code}</span>
          <span className="text-ink">{row.value}</span>
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
