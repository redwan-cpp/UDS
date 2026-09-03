/**
 * A faint stepped-terrace silhouette, used as background texture on an
 * otherwise plain dark band — the geometry the studio's own stepped-section
 * language draws in plan: three staggered contours reading as a terraced
 * elevation.
 *
 * Sourced from haikei.app's "Layered Steps" generator and used only as a
 * shape: the geometry is drawn straight from its live DOM (no download, no
 * generated file to track), then stripped of haikei's own default violet
 * fills and recoloured through this project's own token layer so it never
 * carries a design decision that came from somewhere else. `currentColor` on
 * every path is `text-hairline` wherever this is placed — the one token
 * already reserved for "decorative only" (see globals.css) — so it stays a
 * texture, never a shape competing with real content.
 */
export function TerraceMotif({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 600"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      className={`h-full w-full text-hairline ${className}`}
    >
      <path
        fill="currentColor"
        opacity="0.4"
        d="M0 307L129 307L129 337L257 337L257 305L386 305L386 343L514 343L514 375L643 375L643 311L771 311L771 376L900 376L900 297L900 601L900 601L771 601L771 601L643 601L643 601L514 601L514 601L386 601L386 601L257 601L257 601L129 601L129 601L0 601Z"
      />
      <path
        fill="currentColor"
        opacity="0.65"
        d="M0 389L129 389L129 362L257 362L257 441L386 441L386 462L514 462L514 423L643 423L643 385L771 385L771 422L900 422L900 410L900 601L900 601L771 601L771 601L643 601L643 601L514 601L514 601L386 601L386 601L257 601L257 601L129 601L129 601L0 601Z"
      />
      <path
        fill="currentColor"
        d="M0 475L129 475L129 485L257 485L257 499L386 499L386 525L514 525L514 526L643 526L643 465L771 465L771 463L900 463L900 517L900 601L900 601L771 601L771 601L643 601L643 601L514 601L514 601L386 601L386 601L257 601L257 601L129 601L129 601L0 601Z"
      />
    </svg>
  );
}
