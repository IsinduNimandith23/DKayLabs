import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/constants";

/**
 * Brand lockup: mark + wordmark.
 *
 * The mark is loaded from /logo.svg (a placeholder ships in /public).
 * Drop your real file in at `public/logo.svg` - or use a PNG and change
 * the `src` below to `/logo.png` plus the width/height to your asset's size.
 */
export default function Logo({
  showWordmark = true,
  size = 40,
  className = "",
}: {
  showWordmark?: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label={`${SITE.name} - home`}
      className={`group flex items-center gap-3 ${className}`}
    >
      <span
        className="relative inline-flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105"
        style={{ width: size, height: size }}
      >
        {/* Red glow halo behind the mark. */}
        <span className="absolute inset-0 rounded-full bg-crimson/40 blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <Image
          src="/logo.png"
          alt={`${SITE.name} logo`}
          width={size}
          height={size}
          priority
          className="relative object-contain drop-shadow-[0_0_8px_rgba(255,46,63,0.5)]"
        />
      </span>
      {showWordmark && (
        <span className="font-display text-lg tracking-wider text-snow">
          DKAY<span className="text-crimson">LABS</span>
        </span>
      )}
    </Link>
  );
}
