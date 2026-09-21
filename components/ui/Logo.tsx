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
 * Within a variant, both files are cropped identically, which is what keeps
 * the lockup from jumping sideways on a theme switch - the earlier exports
 * carried different transparent margins, so the light copy sat ~5px further
 * right than the dark one. Re-exports must stay identical in size *and* in
 * their transparent padding, or that shift comes back.
 *
 * `size` is the rendered height of the artwork box, so centering the box
 * centers the letterforms - no optical baseline nudge belongs here.
 */
const VARIANTS = {
  /** Full lockup: mascot glyph + wordmark. Tight-cropped to the ink box. */
  lockup: {
    ratio: 10560 / 2782,
    art: [
      { src: "/Logo/BlackText.png", display: "block dark:hidden" },
      { src: "/Logo/WhiteText.png", display: "hidden dark:block" },
    ],
  },
  /**
   * Wordmark only, no mascot - reads better at the small size the navbar
   * capsule allows. Both files are 8382x1829 with the ink ending at 8217,
   * i.e. a ~2% transparent margin on the right. It is the same on both, so
   * there is no theme-switch shift; it only means a centred wordmark sits
   * ~1px left of true centre, which is below the threshold of noticing.
   */
  wordmark: {
    ratio: 8382 / 1829,
    art: [
      { src: "/Logo/BlackTextLogo.png", display: "block dark:hidden" },
      { src: "/Logo/WhiteTextLogo.png", display: "hidden dark:block" },
    ],
  },
} as const;

export default function Logo({
  size = 38,
  className = "",
  variant = "lockup",
}: {
  /** Rendered height of the wordmark, in px. Width scales with it. */
  size?: number;
  className?: string;
  /** "wordmark" drops the mascot glyph - used in the navbar. */
  variant?: keyof typeof VARIANTS;
}) {
  const { ratio: RATIO, art: ART } = VARIANTS[variant];

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
