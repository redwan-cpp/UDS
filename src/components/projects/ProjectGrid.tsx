"use client";

import { useEffect, useState } from "react";

import { WorkCard } from "./WorkCard";
import { Chevron } from "@/components/ui/Button";
import type { Project } from "@/types/content";

/** How many cards are on screen before anyone asks for more. */
const VISIBLE_CARDS = 4;

/**
 * The work band: four projects, and a control that adds a row.
 *
 * This replaces `ProjectLoop`, which held a fixed window and stepped through
 * it in both directions — the grid stayed the same height and its contents
 * swapped underneath the reader. The studio asked for the opposite: one
 * control, and the section growing downward as it is pressed.
 *
 * That is a better fit than it first sounds. A carousel asks the reader to
 * hold a position in their head; an expanding list does not, and nothing that
 * was already on screen moves when more arrives. It also removes the seam the
 * loop needed to hide, the duplicate pass that hid it, and the wrap arithmetic
 * that made a rename of the file honest — none of which exist here.
 *
 * **Only new cards animate, and no bookkeeping makes that true.** Each card is
 * keyed on its project id, so React keeps the DOM of everything already shown
 * and mounts only the arrivals. A mount-time keyframe therefore plays exactly
 * once, on exactly the new row. Tracking a previous count would produce the
 * same effect and something else to keep in step.
 *
 * **It degrades to the full list.** `cols` is `null` until the viewport is
 * measured, and while it is null every project renders with no control. That
 * is what the server sends, what a crawler reads, and what a visitor without
 * JavaScript keeps — so the work is never behind a button that cannot be
 * pressed.
 */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [cols, setCols] = useState<number | null>(null);
  const [shown, setShown] = useState(VISIBLE_CARDS);

  useEffect(() => {
    // Mirrors the `md:grid-cols-2` below. If that breakpoint moves, this moves.
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setCols(mq.matches ? 2 : 1);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Before measurement, everything. See the note above.
  const limit = cols === null ? projects.length : Math.min(shown, projects.length);
  const visible = projects.slice(0, limit);
  const remaining = projects.length - limit;

  return (
    <div role="group" aria-label="Selected work" className="mt-16 md:mt-20">
      <ul className="grid grid-cols-1 gap-x-(--grid-gap) gap-y-10 md:grid-cols-2">
        {visible.map((project, i) => (
          <li
            key={project.id}
            className="animate-[uds-rise_400ms_ease-out] motion-reduce:animate-none"
          >
            <WorkCard project={project} index={i + 1} priority={i < 2} />
          </li>
        ))}
      </ul>

      {remaining > 0 && (
        <div className="mt-12 grid grid-cols-3 items-center gap-4 border-t border-hairline pt-4">
          <span data-numeric className="text-meta uppercase text-secondary">
            {String(limit).padStart(2, "0")} /{" "}
            {String(projects.length).padStart(2, "0")}
          </span>

          <button
            type="button"
            // The count is in the name, not just beside it: "Show more" tells a
            // screen reader nothing about how much is left, and the numerals to
            // the left are decorative to it.
            aria-label={`Show ${Math.min(cols ?? 1, remaining)} more of ${remaining} remaining projects`}
            onClick={() => setShown((n) => n + (cols ?? 1))}
            className="group/more mx-auto flex size-12 items-center justify-center border border-hairline transition-colors duration-[var(--dur-fast)] hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent"
          >
            <Chevron
              direction="down"
              className="size-6 transition-transform duration-[var(--dur-base)] ease-out-soft group-hover/more:translate-y-0.5 motion-reduce:transition-none"
            />
          </button>

          {/* Announced on expand, so the change is not visual-only. */}
          <p aria-live="polite" className="sr-only">
            Showing {limit} of {projects.length} projects
          </p>
        </div>
      )}
    </div>
  );
}
