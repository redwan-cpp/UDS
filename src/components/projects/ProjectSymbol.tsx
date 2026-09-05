import type { ProjectSymbol as ProjectSymbolContent } from "@/types/content";

/**
 * A project's mark.
 *
 * Replaces the "Case study" text label that used to sit beside the title. That
 * label was answering a question nobody asked — it described the *format* of
 * the page behind the card rather than saying anything about the project — and
 * it only appeared on some cards, so it also read as an inconsistency rather
 * than as information.
 *
 * When an editor uploads a mark for a project (`symbol` in the content
 * contract), that artwork is what renders. Until then this draws a section
 * mark: the standard drawing convention for a cut line through a building,
 * with the direction of view. It is deliberately the *same* mark on every
 * project without one — a different invented glyph per project would be
 * asserting a design idea for that project that nobody at the studio chose.
 *
 * `currentColor` throughout — and for an uploaded mark that takes a CSS mask
 * to actually be true. This component rendered supplied artwork with `<Image>`,
 * where the SVG is a separate document and its `currentColor` has nothing to
 * inherit from, so it resolved to black. The one mark in the content is stroked
 * entirely in `currentColor` and the project index is a dark section, so it was
 * painting black on #0A0A0A: present in the DOM, invisible on the page, since
 * the day it shipped. Masked, it takes the surface's colour and lifts to the
 * accent on hover exactly as the drawn fallback beside it does.
 */
export function ProjectSymbol({
  symbol,
  className = "",
}: {
  symbol?: ProjectSymbolContent;
  className?: string;
}) {
  if (symbol) {
    return (
      <span
        role="img"
        aria-label={symbol.label}
        className={`uds-mark block size-6 ${className}`}
        style={{ "--mark": `url(${symbol.asset.src})` } as React.CSSProperties}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      role="img"
      aria-label="Section mark"
      className={`size-6 ${className}`}
    >
      {/* The cut line. */}
      <path
        d="M12 3.5V20.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeDasharray="3 2.5"
      />
      {/* Head and tail discs, as drawn on a section marker. */}
      <circle cx="12" cy="4.75" r="3" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="12" cy="19.25" r="3" stroke="currentColor" strokeWidth="1.25" />
      {/* Direction of view. */}
      <path
        d="M15.4 4.75H20M20 4.75L17.9 2.9M20 4.75L17.9 6.6"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
      />
    </svg>
  );
}
