import type { CSSProperties, ReactNode } from "react";

/* Total spread of the stagger, first letter to last. Long labels divide it
   more finely rather than taking longer, so "Apply for early access" lands
   as quickly as "Contact" - the per-letter step is capped for short ones. */
const MAX_STEP = 0.01;
const MAX_SPREAD = 0.1;

/**
 * Button label that rolls on hover: each letter slides up out of a one-line
 * window while an identical copy slides up in from underneath, staggered
 * left to right so the end of the word trails the start - the
 * landonorris.com "Store" button.
 *
 * Pure CSS (see .roll-text in globals.css), triggered by the nearest
 * hovered or keyboard-focused <a>/<button>, so it needs no client JS and no
 * `group` class on the parent. The split letters are aria-hidden and the
 * label is exposed once, whole, to screen readers.
 *
 * Non-string children can't be split, so they roll as a single block.
 */
export default function RollText({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  if (typeof children !== "string") {
    return (
      <span className={`roll-text ${className}`}>
        <span className="roll-text__char">
          <Track>{children}</Track>
        </span>
      </span>
    );
  }

  const chars = Array.from(children);
  const step = Math.min(MAX_STEP, MAX_SPREAD / Math.max(chars.length - 1, 1));

  return (
    <span className={`roll-text ${className}`}>
      <span className="sr-only">{children}</span>
      <span aria-hidden className="roll-text__chars">
        {chars.map((char, i) => (
          <span
            key={i}
            className="roll-text__char"
            style={{ "--roll-delay": `${(i * step).toFixed(3)}s` } as CSSProperties}
          >
            {/* A bare space collapses inside an inline-block. */}
            <Track>{char === " " ? " " : char}</Track>
          </span>
        ))}
      </span>
    </span>
  );
}

function Track({ children }: { children: ReactNode }) {
  return (
    <span className="roll-text__track">
      <span className="roll-text__line">{children}</span>
      <span className="roll-text__line roll-text__copy">{children}</span>
    </span>
  );
}
