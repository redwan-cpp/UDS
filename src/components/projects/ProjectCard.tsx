import Link from "next/link";

import { Media } from "@/components/ui/Media";
import { Arrow } from "@/components/ui/Button";
import { categoryLabels, statusLabels } from "@/lib/labels";
import type { Project } from "@/types/content";

/**
 * A project in an index.
 *
 * Hairline and interval, not a filled card: a top rule, the image, then the
 * metadata as a real definition list. The whole entry is one link, so keyboard
 * users get one tab stop per destination rather than three.
 */
export function ProjectCard({
  project,
  index,
  priority = false,
}: {
  project: Project;
  index: number;
  priority?: boolean;
}) {
  return (
    <article className="border-t border-hairline pt-5">
      <Link href={`/projects/${project.slug}`} className="group block">
        <div className="flex items-baseline justify-between gap-4 pb-5">
          <span data-numeric className="text-meta uppercase text-accent">
            {String(index).padStart(2, "0")}
          </span>
          <span className="text-meta uppercase text-secondary">
            {statusLabels[project.status]}
          </span>
        </div>

        <Media
          asset={project.hero}
          ratio="portrait"
          hoverScale
          priority={priority}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
        />

        <h2 className="mt-6 text-h3 transition-transform duration-[var(--dur-base)] ease-out-soft group-hover:translate-x-1.5 motion-reduce:transform-none motion-reduce:transition-none">
          {project.title}
        </h2>

        <p className="mt-3 max-w-[42ch] text-small text-secondary">
          {project.summary}
        </p>

        <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3 border-t border-hairline pt-4">
          <div>
            <dt className="sr-only">Location</dt>
            <dd className="text-meta uppercase text-secondary">
              {project.location}
            </dd>
          </div>
          <div>
            <dt className="sr-only">Category</dt>
            <dd className="text-meta uppercase text-secondary">
              {categoryLabels[project.category]}
            </dd>
          </div>
          <div>
            <dt className="sr-only">Year</dt>
            <dd data-numeric className="text-meta uppercase text-secondary">
              {project.year}
            </dd>
          </div>
        </dl>

        <span className="mt-5 inline-flex items-center gap-2.5 text-meta uppercase text-accent">
          View
          <Arrow className="transition-transform duration-[var(--dur-base)] ease-out-soft group-hover:translate-x-1 motion-reduce:transition-none" />
        </span>
      </Link>
    </article>
  );
}
