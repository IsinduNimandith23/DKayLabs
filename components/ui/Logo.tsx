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

/**
 * Both files are cropped to the same tight ink box (10560 x 2782), which is
 * what keeps the lockup from jumping sideways on a theme switch - the earlier
 * exports carried different transparent margins, so the light copy sat ~5px
 * further right than the dark one. Re-exports must stay trimmed and identical
 * in size, or that shift comes back.
 *
 * Tight-cropped also means `size` is the real ink height, so centering the box
 * centers the letterforms - no optical baseline nudge belongs here.
 */
const RATIO = 10560 / 2782;

const ART = [
  { src: "/Logo/BlackText.png", display: "block dark:hidden" },
  { src: "/Logo/WhiteText.png", display: "hidden dark:block" },
] as const;

export default function Logo({
  size = 38,
  className = "",
}: {
  /** Rendered height of the wordmark, in px. Width scales with it. */
  size?: number;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label={`${SITE.name} - home`}
      className={`group flex items-center ${className}`}
    >
      <span className="flex shrink-0 items-center transition-transform duration-300 group-hover:scale-105">
        {ART.map((art) => {
          const width = Math.round(size * RATIO);
          return (
            <Image
              key={art.src}
              // The link's aria-label already names the brand, so the artwork
              // itself is decorative - an alt here would read the name twice.
              alt=""
              aria-hidden
              src={art.src}
              width={width}
              height={size}
              priority
              sizes={`${width}px`}
              style={{ width: "auto", height: size }}
              className={`object-contain ${art.display}`}
            />
          );
        })}
      </span>
    </Link>
  );
}
