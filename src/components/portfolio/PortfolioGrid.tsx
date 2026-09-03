import Link from "next/link";

import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectSymbol } from "@/components/projects/ProjectSymbol";
import { categoryLabels } from "@/lib/labels";
import type { PortfolioItem } from "@/types/content";

/**
 * A portfolio entry.
 *
 * Lighter than a project card: image, name, one line, then location and area on
 * one rule. Items that also exist as a full case study link through to it;
 * items that do not are rendered as plain articles rather than as dead links.
 */
function PortfolioEntry({ item }: { item: PortfolioItem }) {
  const documented = Boolean(item.projectSlug);

  const body = (
    <>
      {/* Landscape and fixed, like every other card in the system: a row stays
          symmetrical whatever shape the source images are, because the frame
          crops to its own ratio rather than following the image. */}
      <div className="relative overflow-hidden">
        <Media
          asset={item.image}
          ratio="landscape"
          hoverScale
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
        />

        {/* The arrow is a hover affordance, not a badge. Shown at rest it
            appeared on some cards and not others, which read as an
            inconsistency rather than as meaning — so at rest every card in the
            grid is now identical, and the arrow arrives on hover only where
            there is somewhere to go. An arrow on a card that does not link
            would be a promise the card cannot keep. */}
        {documented && (
          <span
            aria-hidden="true"
            className="absolute top-4 right-4 block size-4 overflow-hidden text-paper opacity-0 transition-opacity duration-[var(--dur-base)] ease-out-soft group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="absolute inset-0 size-4 transition-transform duration-[var(--dur-base)] ease-out-soft group-hover:translate-x-4 group-hover:-translate-y-4 motion-reduce:transition-none"
            >
              <path
                d="M4 12L12 4M12 4H5.5M12 4V10.5"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="square"
              />
            </svg>
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="absolute inset-0 size-4 -translate-x-4 translate-y-4 transition-transform duration-[var(--dur-base)] ease-out-soft group-hover:translate-x-0 group-hover:translate-y-0 motion-reduce:hidden"
            >
              <path
                d="M4 12L12 4M12 4H5.5M12 4V10.5"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="square"
              />
            </svg>
          </span>
        )}
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <h3 className="text-h3 transition-transform duration-[var(--dur-base)] ease-out-soft group-hover:translate-x-1.5 motion-reduce:transform-none motion-reduce:transition-none">
          {item.title}
        </h3>
        <ProjectSymbol
          symbol={item.symbol}
          className="mt-1 shrink-0 text-secondary transition-colors duration-[var(--dur-base)] group-hover:text-accent"
        />
      </div>

      <p className="mt-3 max-w-[42ch] text-small text-secondary">{item.summary}</p>

      <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-hairline pt-3.5">
        <div className="flex gap-2">
          <dt className="sr-only">Location</dt>
          <dd className="text-meta uppercase text-secondary">{item.location}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="sr-only">Area</dt>
          <dd data-numeric className="text-meta uppercase text-secondary">
            {item.areaSize}
          </dd>
        </div>
        <div className="ml-auto flex gap-2">
          <dt className="sr-only">Category</dt>
          <dd className="text-meta uppercase text-accent">
            {categoryLabels[item.category]}
          </dd>
        </div>
      </dl>
    </>
  );

  return (
    <article className="border-t border-hairline pt-5">
      {item.projectSlug ? (
        <Link href={`/projects/${item.projectSlug}`} className="group block">
          {body}
        </Link>
      ) : (
        <div className="group">{body}</div>
      )}
    </article>
  );
}

export function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  if (items.length === 0) {
    return (
      <p className="border-t border-hairline pt-5 text-meta uppercase text-secondary">
        No projects in this category yet.
      </p>
    );
  }

  return (
    <Reveal
      as="ul"
      stagger={0.06}
      className="grid grid-cols-1 gap-x-(--grid-gap) gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((item) => (
        <li key={item.id}>
          <PortfolioEntry item={item} />
        </li>
      ))}
    </Reveal>
  );
}
