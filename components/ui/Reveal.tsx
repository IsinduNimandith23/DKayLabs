"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "scale";

const OFFSET = 40;

function buildVariants(direction: Direction): Variants {
  const hidden: Record<string, number> = { opacity: 0 };
  switch (direction) {
    case "up":
      hidden.y = OFFSET;
      break;
    case "down":
      hidden.y = -OFFSET;
      break;
    case "left":
      hidden.x = OFFSET;
      break;
    case "right":
      hidden.x = -OFFSET;
      break;
    case "scale":
      hidden.scale = 0.92;
      break;
  }
  return {
    hidden,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
    },
  };
}

/**
 * Scroll-triggered reveal. Fades/slides/scales children in once they
 * enter the viewport. Becomes a no-op under prefers-reduced-motion.
 */
export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  className,
  once = true,
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
  once?: boolean;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={buildVariants(direction)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.25 }}
      transition={{
        duration: 1.1,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
