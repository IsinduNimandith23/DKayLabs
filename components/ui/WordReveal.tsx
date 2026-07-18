"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Word-by-word rising text reveal, triggered on scroll into view.
 * Each word slides up from behind an invisible mask line.
 * Inline - safe to chain multiple instances (with different colors)
 * inside a single heading. No-op under prefers-reduced-motion.
 */
export default function WordReveal({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ").filter(Boolean);
  const trailingSpace = text.endsWith(" ");

  if (reduced) return <span className={className}>{text}</span>;

  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12, delayChildren: delay } },
      }}
      className="inline"
    >
      {words.map((word, i) => (
        <span
          key={i}
          // Mask for the rising word. Padding keeps descenders (y/g/p) unclipped.
          className="inline-block overflow-hidden pb-[0.12em] align-bottom -mb-[0.12em]"
        >
          <motion.span
            variants={{
              hidden: { y: "115%", opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className={`inline-block ${className}`}
          >
            {word}
          </motion.span>
          {i < words.length - 1 || trailingSpace ? " " : null}
        </span>
      ))}
    </motion.span>
  );
}
