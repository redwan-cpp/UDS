import Image from "next/image";

import type { Brand } from "@/types/content";

/**
 * The collaborator strip, on the band beneath the figures.
 *
 * Each collaborator is a mark, the company name, and what they did — the way a
 * drawing sheet lists a consultant team, rather than the way a homepage lists
 * client logos.
 *
 * **Scrolled by the reader, not by a timer.** This was an auto-running marquee:
 * two identical passes translated by -50% so the loop had no seam. It read
 * well and it could not accept the studio's request for a scrollbar, because
 * the two ideas are incompatible — a bar cannot report a position on a track
 * that is sliding underneath it, and grabbing one means fighting the animation
 * for control of the same axis. So the motion is gone and the row is a real
 * scroll container: `.uds-scroll-x` puts a 3px hairline track under it with a
 * thumb in the secondary tone, the same scroller the project filters already
 * use. It works with a trackpad, a shift-wheel, a touch drag and the keyboard,
 * and it needs no JavaScript at all — which the marquee also managed, but this
 * one stops when the reader wants to read something.
 *
 * The duplicate pass goes with it. It existed only to hide the loop's seam,
 * and it meant every collaborator was in the DOM twice with half of them
 * `aria-hidden` to stop screen readers announcing the list again.
 *
 * **The mark and the name, not one or the other.** The old row showed the logo
 * where one existed and fell back to the name where it did not, so a strip
 * with mixed assets read as two different kinds of thing. Both always show
 * now: a logo without its company's name spelled out is a guessing game, and
 * the name is what a visitor is actually scanning for.
 */
export function LogoStrip({ brands }: { brands: Brand[] }) {
  if (brands.length === 0) return null;

  return (
    <ul
      aria-label="Collaborators and consultants"
      tabIndex={0}
      className="uds-scroll-x uds-scroll-fade -mx-(--gutter) flex gap-px px-(--gutter) pb-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      {brands.map((brand) => (
        <li
          key={brand.id}
          className="flex w-[15rem] shrink-0 flex-col gap-5 border-l border-hairline pl-8 first:border-l-0 first:pl-0"
        >
          <LogoPlate brand={brand} />
          <div className="flex flex-col gap-1.5">
            <span className="text-small text-balance">{brand.name}</span>
            <span className="text-meta uppercase text-secondary">
              {brand.relationship}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * One collaborator's mark, or the plate reserved for it.
 *
 * The plate is drawn rather than left empty for two reasons. It holds the
 * height, so the row does not reflow the day the studio supplies its first
 * logo. And it is honest in a way an invented mark could not be: shipping a
 * real company's logo as proof of a relationship the studio has not documented
 * is a fabrication, and a made-up mark is worth nothing to anybody — so the
 * plate says "no mark supplied" in the drawing convention for it, a ruled
 * rectangle struck through, and stays identical for every collaborator without
 * one. Same reasoning as the section mark on a project without its own symbol.
 */
function LogoPlate({ brand }: { brand: Brand }) {
  if (brand.logo) {
    return (
      <Image
        src={brand.logo.src}
        alt={brand.logo.alt}
        width={brand.logo.width}
        height={brand.logo.height}
        className="h-10 w-auto max-w-[9rem] object-contain object-left"
      />
    );
  }

  return (
    <svg
      viewBox="0 0 64 40"
      fill="none"
      aria-hidden="true"
      className="h-10 w-16 text-hairline"
    >
      <rect
        x="0.5"
        y="0.5"
        width="63"
        height="39"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path d="M0.5 39.5L63.5 0.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
