/**
 * Route transition - remounts on every navigation, fading/rising the
 * incoming page. Navbar + Footer live in layout.tsx, so they stay put.
 *
 * A CSS animation, not framer-motion. The framer version server-rendered
 * every page at `opacity: 0` and only faded it in once React had hydrated,
 * so on a mid-range phone the whole page - the LCP included - stayed
 * invisible for ~1-1.5s after its HTML had arrived. A CSS animation starts on
 * first paint with no JavaScript at all, and because a template remounts per
 * navigation, each new page gets a fresh element and replays it.
 *
 * `.page-enter` (globals.css) uses the `translate` property with a
 * `backwards` fill, so once it finishes the wrapper carries no transform: a
 * lingering transform would turn it into the containing block for every
 * `position: fixed` element inside the page.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
