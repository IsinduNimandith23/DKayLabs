/**
 * Decorative animated crimson glow blob used as a parallax/background accent.
 * Purely cosmetic - aria-hidden.
 */
export default function GlowOrb({
  className = "",
  size = 480,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full bg-crimson/30 blur-[120px] animate-pulse-glow ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
