import Image from "next/image";

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
 * `currentColor` throughout, so an uploaded SVG picks up the accent on hover
 * the same way the drawn fallback does.
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
      <Image
        src={symbol.asset.src}
        alt={symbol.label}
        width={symbol.asset.width}
        height={symbol.asset.height}
        className={`h-6 w-auto object-contain ${className}`}
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
