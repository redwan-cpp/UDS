import Link from "next/link";

import { Media } from "@/components/ui/Media";
import { categoryLabels } from "@/lib/labels";
import type { Project } from "@/types/content";

/**
 * A project in an index.
 *
 * Hairline and interval, not a filled card: a top rule, the frame, then the
 * metadata as a real definition list. The whole entry is one link, so keyboard
 * users get one tab stop per destination rather than three.
 *
 * Three things are deliberate here:
 *
 * - **The frame is landscape and stays landscape.** `Media` reserves the ratio
 *   before load and the image is `object-cover` inside it, so a portrait or an
 *   oddly-cropped source is never stretched to fit — it is cropped to the
 *   frame around its focal point. Every card in a row is therefore the same
 *   height whatever it contains, which is what keeps the grid symmetrical.
 *
 * - **The summary sits on the image**, revealed on hover or keyboard focus.
 *   It is always in the DOM and always announced; only its opacity moves. On
 *   coarse pointers — where there is no hover to reveal it — it is shown
 *   permanently rather than hidden behind a gesture that does not exist.
 *
 * - **The year is gone from the top row**, replaced by the arrow. It is still
 *   available on the project page and in the information table; in an index of
 *   this density it was the least useful of the three facts competing for the
 *   same line.
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
        <div className="flex items-center justify-between gap-4 pb-5">
          <span data-numeric className="text-meta uppercase text-accent">
            {String(index).padStart(2, "0")}
          </span>

          {/* The arrow travels up and to the right and a second one follows it
              in, so the corner reads as "this opens" rather than as a static
              glyph. Both are one element's worth of transform. */}
          <span
            aria-hidden="true"
            className="relative block size-4 overflow-hidden text-accent"
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
        </div>

        <div className="relative overflow-hidden">
          <Media
            asset={project.hero}
            ratio="landscape"
            hoverScale
            priority={priority}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
          />

          {/* Scrim + summary. `pointer-events-none` so the overlay never
              intercepts the click that belongs to the link underneath it. */}
          <div className="pointer-events-none absolute inset-0 flex items-end">
            <div className="w-full bg-gradient-to-t from-ink/90 from-10% via-ink/55 via-60% to-transparent p-5 opacity-100 transition-opacity duration-[var(--dur-slow)] ease-out-soft motion-reduce:transition-none md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
              <p className="max-w-[46ch] text-small text-paper/95 text-pretty md:translate-y-2 md:transition-transform md:duration-[var(--dur-slow)] md:ease-out-soft md:group-hover:translate-y-0 md:group-focus-visible:translate-y-0 md:motion-reduce:transform-none md:motion-reduce:transition-none">
                {project.summary}
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-6 text-h3 transition-transform duration-[var(--dur-base)] ease-out-soft group-hover:translate-x-1.5 motion-reduce:transform-none motion-reduce:transition-none">
          {project.title}
        </h2>

        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-3 border-t border-hairline pt-4">
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
        </dl>
      </Link>
    </article>
  );
}
