import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/constants";

/**
 * Brand lockup - the full DKayLABS wordmark, shipped as two artwork files:
 *
 *   public/Logo/BlackText.png  dark "DKay" - for light backgrounds
 *   public/Logo/WhiteText.png  white "DKay" - for dark backgrounds
 *
 * Both are rendered and one is hidden with a `dark:` variant rather than read
 * off a theme hook: the theme class is applied before first paint (see the
 * no-flash script in app/layout.tsx), so a CSS swap has no hydration gap.
 */

/** Intrinsic artwork ratio (8539 x 1829) - width follows the requested height. */
const ASPECT = 8539 / 1829;

/**
 * Where the baseline sits in the artwork: the canvas is cropped tight, so the
 * descender of the "y" owns the bottom 22% and no glyph balances it on top.
 * Centering the raw box therefore parks the visible text high and leaves a
 * gap under it. Nudging down by half the descender centers the letterforms
 * instead of the bounding box, which is what the eye actually measures.
 */
const BASELINE = 1418 / 1829;

export default function Logo({
  size = 30,
  className = "",
}: {
  /** Rendered height of the wordmark, in px. Width scales with it. */
  size?: number;
  className?: string;
}) {
  const width = Math.round(size * ASPECT);
  // The link's aria-label already names the brand, so the artwork itself is
  // decorative - an alt on each copy would read the name out twice.
  const shared = {
    "aria-hidden": true,
    width,
    height: size,
    priority: true,
    sizes: `${width}px`,
    style: { width: "auto", height: size },
  };

  return (
    <Link
      href="/"
      aria-label={`${SITE.name} - home`}
      className={`group flex items-center ${className}`}
    >
      {/* Two spans, not one: the optical offset has to be an inline transform,
          and Tailwind's scale utilities compile to `transform` too - on one
          element the inline style would win and kill the hover scale. */}
      <span
        className="flex shrink-0 items-center"
        style={{
          height: size,
          transform: `translateY(${(size * (1 - BASELINE)) / 2}px)`,
        }}
      >
        <span className="flex items-center transition-transform duration-300 group-hover:scale-105">
          <Image
            {...shared}
            alt=""
            src="/Logo/BlackText.png"
            className="block object-contain dark:hidden"
          />
          <Image
            {...shared}
            alt=""
            src="/Logo/WhiteText.png"
            className="hidden object-contain dark:block"
          />
        </span>
      </span>
    </Link>
  );
}
