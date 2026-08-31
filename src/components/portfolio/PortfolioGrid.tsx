import Link from "next/link";

import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/motion/Reveal";
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
  const body = (
    <>
      <Media
        asset={item.image}
        ratio="portrait"
        hoverScale
        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
      />

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="text-h3 transition-transform duration-[var(--dur-base)] ease-out-soft group-hover:translate-x-1.5 motion-reduce:transform-none motion-reduce:transition-none">
          {item.title}
        </h3>
        <span data-numeric className="shrink-0 text-meta uppercase text-secondary">
          {item.year}
        </span>
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
