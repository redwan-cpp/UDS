import Link from "next/link";

import { Media } from "@/components/ui/Media";
import { Arrow } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { categoryLabels } from "@/lib/labels";
import type { Project } from "@/types/content";

/**
 * A featured project, presented as a full spread rather than a card.
 *
 * Alternating side: even entries put the image left, odd entries put it right,
 * so scrolling the showcase reads as a spread turning rather than as a column
 * of identical tiles. The whole spread is one link — a card with a separate
 * "read more" gives keyboard users two stops for one destination.
 */
export function FeaturedProject({
  project,
  position,
  priority = false,
}: {
  project: Project;
  /** 1-based, used for the index and to decide which side the image sits on. */
  position: number;
  priority?: boolean;
}) {
  const imageRight = position % 2 === 0;

  return (
    <article className="border-t border-hairline pt-8 md:pt-10">
      <Link
        href={`/projects/${project.slug}`}
        className="group grid grid-cols-1 gap-x-(--grid-gap) gap-y-8 lg:grid-cols-12 lg:items-center"
      >
        <div
          className={[
            "lg:col-span-7",
            imageRight ? "lg:col-start-6 lg:order-2" : "lg:col-start-1",
          ].join(" ")}
        >
          <Reveal variant="curtain">
            <Media
              asset={project.hero}
              ratio="landscape"
              hoverScale
              revealMedia
              priority={priority}
              sizes="(min-width: 1024px) 58vw, 100vw"
            />
          </Reveal>
        </div>

        <div
          className={[
            "lg:col-span-4",
            imageRight ? "lg:col-start-1 lg:order-1" : "lg:col-start-9",
          ].join(" ")}
        >
          <Reveal delay={0.1}>
            <span
              data-numeric
              className="block text-meta uppercase text-accent"
            >
              {String(position).padStart(2, "0")}
            </span>

            <h3 className="mt-4 text-h2 transition-transform duration-[var(--dur-base)] ease-out-soft group-hover:translate-x-2 motion-reduce:transform-none motion-reduce:transition-none">
              {project.title}
            </h3>

            <p className="mt-5 max-w-[42ch] text-body text-secondary">
              {project.summary}
            </p>

            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-hairline pt-5">
              <div>
                <dt className="text-meta uppercase text-secondary">Location</dt>
                <dd className="mt-1.5 text-small">{project.location}</dd>
              </div>
              <div>
                <dt className="text-meta uppercase text-secondary">Category</dt>
                <dd className="mt-1.5 text-small">
                  {categoryLabels[project.category]}
                </dd>
              </div>
              <div>
                <dt className="text-meta uppercase text-secondary">Year</dt>
                <dd className="mt-1.5 text-small" data-numeric>
                  {project.year}
                </dd>
              </div>
            </dl>

            <span className="mt-8 inline-flex items-center gap-3 text-meta uppercase text-accent">
              View project
              <Arrow className="transition-transform duration-[var(--dur-base)] ease-out-soft group-hover:translate-x-1 motion-reduce:transition-none" />
            </span>
          </Reveal>
        </div>
      </Link>
    </article>
  );
}
