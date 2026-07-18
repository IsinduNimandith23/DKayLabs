"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Route transition - remounts on every navigation, fading/rising the
 * incoming page. Navbar + Footer live in layout.tsx, so they stay put.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
