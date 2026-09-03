/**
 * The studio mark — three stacked plates.
 *
 * IMPORTANT: this is a geometric reconstruction of the supplied logo, not the
 * studio's own artwork. It was rebuilt as SVG because the logo arrived as a
 * raster preview rather than as a file. Before launch, replace the geometry in
 * `MarkGeometry` below with the real vector — everything else in the codebase
 * (header, loader, favicon) draws through this component, so that is a
 * one-file swap and nothing downstream changes.
 *
 * Drawn with `currentColor` rather than a fixed fill, so the same mark works on
 * ink and on paper and picks up the accent on hover without a second asset.
 * The supplied light/dark lockups are therefore one component here, not two
 * files — which is also why there is no colour hard-coded anywhere below.
 *
 * `data-plate` is on each plate so the loader can animate them independently
 * without knowing anything about the geometry.
 */

/** One plate: a sheared band, high on the left, descending to the right. */
function Plate({ y }: { y: number }) {
  return (
    <g data-plate transform={`translate(0 ${y})`}>
      <path
        d="M0 44 L104 0 L208 44 L104 88 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="26"
        strokeLinejoin="miter"
      />
    </g>
  );
}

export function UthanMark({
  className = "",
  title,
}: {
  className?: string;
  /** Supply only when the mark is the sole label; otherwise it stays decorative. */
  title?: string;
}) {
  return (
    <svg
      viewBox="-13 -13 234 254"
      fill="none"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <Plate y={0} />
      <Plate y={70} />
      <Plate y={140} />
    </svg>
  );
}
