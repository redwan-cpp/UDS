import { UthanMark } from "@/components/brand/UthanMark";

/**
 * The mark, lighting up.
 *
 * Two copies of the same `UthanMark`, stacked: a dim, unlit silhouette always
 * present (the way a neon sign's glass tubing is visible even switched off),
 * and a bright copy clipped to nothing, revealed bottom-to-top by whatever
 * animates `[data-neon-fill]`'s `clip-path` — see `LoadingSequence` and
 * `PageTransition`, which both do this at different paces.
 *
 * "Neon" is deliberately not a new colour. `memory.md` is explicit that this
 * palette takes one accent and no second is introduced, so the glow is
 * pistachio at higher intensity — two stacked `drop-shadow`s, tight then
 * wide, which is the standard CSS neon-glow construction — rather than a
 * literal neon hue the brand doesn't have.
 *
 * `clip-path`, not a transform mask: the reveal-contract note elsewhere in
 * this codebase moved the curtain animation *off* `clip-path` specifically
 * because it was repainting a full-bleed, viewport-sized image every frame.
 * This element is a small mark, not a hero photograph — the repaint cost here
 * is trivial, and `clip-path` is the direct, correct tool for "reveal from
 * the bottom" on something this size.
 *
 * Armed only under `.js-motion` (see globals.css): the default, unanimated
 * state is fully lit, so a no-JS or reduced-motion visitor sees the finished
 * mark immediately rather than a dim silhouette nothing will ever fill.
 */
export function NeonMark({
  className = "",
  lit,
}: {
  className?: string;
  /**
   * Controlled mode: when passed (either value), the fill is driven by this
   * boolean via a CSS transition on `clip-path` — toggling `data-lit` — rather
   * than by an external GSAP tween. `PageTransition` uses this; the first-visit
   * intro still drives the same element with GSAP directly, timed against its
   * own longer, multi-step choreography. Both are safe on the same component:
   * GSAP's per-frame inline writes simply make the CSS transition irrelevant
   * wherever it is used instead.
   */
  lit?: boolean;
}) {
  return (
    <span
      // Stringified rather than a bare boolean: `lit === false` still needs
      // `data-lit` present (as "false") so the transition-enabling selector
      // below matches and the fill animates smoothly *closed*, not just open.
      // Only truly uncontrolled (`lit` never passed, the intro's GSAP path)
      // omits the attribute entirely.
      data-lit={lit === undefined ? undefined : String(lit)}
      className={`uds-neon-mark relative inline-block ${className}`}
    >
      <UthanMark className="block h-full w-full text-paper/10" />
      <span
        data-neon-fill
        className="uds-neon-mark__fill absolute inset-0 block"
      >
        <UthanMark className="block h-full w-full text-pistachio" />
      </span>
    </span>
  );
}
