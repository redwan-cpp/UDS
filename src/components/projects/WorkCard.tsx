import Link from "next/link";

import { Media } from "@/components/ui/Media";
import { ProjectSymbol } from "./ProjectSymbol";
import { categoryLabels } from "@/lib/labels";
import type { Project } from "@/types/content";

/**
 * A work card for the homepage grid.
 *
 * At rest it is the photograph and almost nothing else — an index in one
 * corner, the mark in the other. Everything about the project arrives on
 * hover: a scrim, then the name and the facts rising into it while the image
 * pushes in slightly behind them.
 *
 * The parts that matter for this not being a broken card on half the devices
 * that meet it:
 *
 * - **Hover is not the only way to the content.** The whole detail block is
 *   permanently visible below `md` and on any coarse pointer, because a phone
 *   has no hover and would otherwise get a wall of unlabelled photographs.
 * - **The link carries its own accessible name**, so the card is announced as
 *   the project it leads to whether or not the overlay is showing.
 * - **Focus does what hover does.** `group-focus-visible` mirrors every hover
 *   state, so a keyboard user tabbing the grid sees the same information a
 *   pointer user sees.
 * - Only `opacity` and `transform` animate, so the whole thing composites.
 */
export function WorkCard({
  project,
  index,
  priority = false,
}: {
  project: Project;
  index: number;
  priority?: boolean;
}) {
  return (
    <article>
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`${project.title} — ${project.summary}`}
        className="group relative block overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <Media
          asset={project.hero}
          ratio="landscape"
          hoverScale
          hoverDesaturate
          priority={priority}
          sizes="(min-width: 1024px) 46vw, 100vw"
        />

        {/* The scrim. Present at rest on small screens, where the detail block
            is also permanent — the text needs its ground either way. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/92 from-0% via-ink/55 via-55% to-ink/10 transition-opacity duration-[var(--dur-slow)] ease-out-soft motion-reduce:transition-none md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100"
        />

        {/* Corner marks, always visible: the index reads as a contents list,
            and the project's own mark sits opposite it. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5">
          <span data-numeric className="text-meta uppercase text-paper/90">
            {String(index).padStart(2, "0")}
          </span>
          <ProjectSymbol
            symbol={project.symbol}
            className="text-paper/80 transition-colors duration-[var(--dur-base)] group-hover:text-accent"
          />
        </div>

        {/* The detail block. Each line carries its own delay so the group
            arrives as a sequence rather than as one slab. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 md:p-7">
          <div className="surface-dark">
            <h3 className="text-h3 text-paper transition-[opacity,transform] duration-[var(--dur-slow)] ease-out-soft motion-reduce:transform-none motion-reduce:transition-none md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
              {project.title}
            </h3>

            <p className="mt-3 max-w-[46ch] text-small text-paper/80 text-pretty transition-[opacity,transform] delay-[60ms] duration-[var(--dur-slow)] ease-out-soft motion-reduce:transform-none motion-reduce:transition-none md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
              {project.summary}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-paper/25 pt-4 transition-[opacity,transform] delay-[120ms] duration-[var(--dur-slow)] ease-out-soft motion-reduce:transform-none motion-reduce:transition-none md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
              <span className="text-meta uppercase text-paper/85">
                {project.location}
              </span>
              <span className="text-meta uppercase text-accent">
                {categoryLabels[project.category]}
              </span>
              <span
                data-numeric
                className="text-meta uppercase text-paper/85"
              >
                {project.year}
              </span>

              <span className="ml-auto inline-flex items-center gap-2 text-meta uppercase text-paper">
                View
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="size-3.5 transition-transform duration-[var(--dur-base)] ease-out-soft group-hover:translate-x-1 motion-reduce:transition-none"
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="square"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
