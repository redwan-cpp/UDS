/**
 * A drawn section, used as background texture on a light band.
 *
 * The counterpart to `TerraceMotif`, and deliberately the same building: that
 * one is the stepped mass as a filled silhouette on ink, this is the same
 * stepped mass drawn — outline, slab edges, grid lines with their bubbles, a
 * dimension run with the 45° ticks a drawing actually uses instead of
 * arrowheads, poché hatching on the cut, and a level marker. Two motifs, one
 * subject, one seen as solid and one as drawing, which is the pairing the
 * whole site is built on: "a drawing sheet laid over a photograph."
 *
 * Authored here rather than sourced. There is no honest stock version of
 * this: an architectural line drawing carries a specific building, and
 * borrowing one would put someone else's project in the background of this
 * studio's page. Every coordinate below is set by hand, in the same 1.25
 * stroke weight as the section mark and the arrow, so it belongs to the same
 * drawn family rather than reading as clip art.
 *
 * `currentColor` throughout — the caller sets `text-hairline` and an opacity,
 * so the drawing takes the light surface's own hairline tone and never has to
 * be told which ground it is on.
 */
export function SectionSketch({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 560 320"
      fill="none"
      aria-hidden="true"
      className={`h-full w-full ${className}`}
      preserveAspectRatio="xMidYMax meet"
    >
      <g stroke="currentColor" strokeWidth="1.25" strokeLinecap="square">
        {/* Grid lines and their bubbles, at the three structural gridlines the
            section is set out from. Dashed, because a gridline is a reference,
            not a built thing. */}
        {[60, 250, 430].map((x) => (
          <g key={x}>
            <circle cx={x} cy="26" r="13" />
            <path d={`M${x} 39 V300`} strokeDasharray="5 6" opacity="0.7" />
          </g>
        ))}

        {/* The stepped mass, in section: ground up, terrace by terrace. */}
        <path d="M60 282 V210 H150 V166 H250 V122 H340 V78 H430 V282" />

        {/* Slab edges — each tread carried a little past its riser, the way a
            floor plate is drawn projecting beyond the wall below it. */}
        <path d="M46 210 H150" />
        <path d="M136 166 H250" />
        <path d="M236 122 H340" />
        <path d="M326 78 H444" />

        {/* Ground line, heavier in reading than the rest by being the only
            thing that runs the full width. */}
        <path d="M0 282 H560" />

        {/* Poché: the cut portion of the base, hatched at 45°. Five strokes
            placed by hand rather than a <pattern>, which would need a unique
            id per instance to be safe to render more than once. */}
        <g opacity="0.55">
          <path d="M60 282 L88 254" />
          <path d="M76 282 L104 254" />
          <path d="M92 282 L120 254" />
          <path d="M108 282 L136 254" />
          <path d="M124 282 L150 256" />
        </g>

        {/* Dimension run, with the 45° ticks used on a drawing instead of
            arrowheads, and witness lines dropping to it. */}
        <path d="M60 306 H430" />
        <path d="M54 312 L66 300" />
        <path d="M244 312 L256 300" />
        <path d="M424 312 L436 300" />

        {/* Level marker on the top terrace: the half-filled triangle sitting
            on the line it measures. */}
        <path d="M430 78 L438 64 H422 Z" />
        <path d="M430 78 L438 64" />
      </g>
    </svg>
  );
}
