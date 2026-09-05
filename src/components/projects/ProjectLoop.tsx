"use client";

import { useEffect, useState } from "react";

import { WorkCard } from "./WorkCard";
import { Chevron } from "@/components/ui/Button";
import type { Project } from "@/types/content";

/**
 * How many cards are on screen at once, whatever the column count.
 *
 * Expressed in cards rather than rows on purpose. Two rows is four projects on
 * a desktop and two on a phone, because a row is one card there — so a fixed
 * row count quietly halves how much work a phone visitor sees before they have
 * to start pressing anything. The window holds four either way; only the step
 * changes size with the grid, which is what "a row at a time" means.
 */
const VISIBLE_CARDS = 4;

/**
 * The work grid as an endless stack, stepped a row at a time.
 *
 * The band showed every project at once, which on a six-project homepage was a
 * long uninterrupted scroll of photographs. It now holds four cards and steps
 * through the rest, with a control above and below the grid — up for the row
 * before, down for the row after.
 *
 * **Endless without cloning anything.** The rows are addressed modulo the row
 * count, so stepping past the last one lands on the first with no duplicated
 * markup, no reset jump at the seam, and no scroll hijacking — the three
 * things that make an infinite carousel unpleasant. The page scrolls normally
 * throughout; only the contents of the grid change.
 *
 * **It degrades to the full list.** `cols` is `null` until the viewport has
 * been measured, and while it is null every project renders in the plain grid
 * with no controls. That is what the server sends, what a crawler reads, and
 * what a visitor without JavaScript keeps — the loop is an enhancement over a
 * complete list rather than the only way to reach the work. It also means
 * there is no hydration mismatch to paper over: the first client render is
 * identical to the server's.
 *
 * The column count has to be known in JS because a "row" is a rendered fact,
 * not a data one — the grid is one column below `md` and two above it, so the
 * same step is one project or two depending on the viewport. It is read from
 * the same breakpoint the grid uses, and re-read when the viewport crosses it.
 */
export function ProjectLoop({ projects }: { projects: Project[] }) {
  const [cols, setCols] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // Mirrors the `md:grid-cols-2` below. If that breakpoint moves, this moves.
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setCols(mq.matches ? 2 : 1);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const rowCount = cols ? Math.ceil(projects.length / cols) : 0;
  const visibleRows = cols ? Math.ceil(VISIBLE_CARDS / cols) : 0;
  const looping = cols !== null && rowCount > visibleRows;

  // Rotating the phone can drop the row count under the stored offset. Folded
  // back in on read rather than corrected in an effect: an effect would set
  // state during render-commit, which renders one frame of an empty window
  // before fixing itself, and is what `react-hooks/set-state-in-effect` is
  // pointing at. The offset is a cursor, and this is the only place it has to
  // be in range.
  const at = rowCount > 0 ? offset % rowCount : 0;

  const shown =
    looping && cols
      ? Array.from(
          { length: visibleRows },
          (_, row) => ((at + row) % rowCount) * cols,
        ).flatMap((start) =>
          projects
            .slice(start, start + cols)
            .map((project, i) => ({ project, index: start + i + 1 })),
        )
      : projects.map((project, i) => ({ project, index: i + 1 }));

  const step = (delta: number) => setOffset((at + delta + rowCount) % rowCount);

  return (
    <div
      role="group"
      aria-label="Selected work"
      className="mt-16 md:mt-20"
    >
      {looping && (
        <Control
          direction="up"
          label="Show the previous row of projects"
          onClick={() => step(-1)}
          className="border-b border-hairline pb-4"
        >
          {String(at + 1).padStart(2, "0")} /{" "}
          {String(rowCount).padStart(2, "0")}
        </Control>
      )}

      {/* Keyed on the offset so the whole window re-enters on a step. The
          alternative — keying each card on its project id — would let React
          keep the row that stayed on screen, but then a step would silently
          swap one row and leave the other perfectly still, which reads as a
          glitch rather than as movement. */}
      <ul
        key={at}
        className="grid grid-cols-1 gap-x-(--grid-gap) gap-y-10 py-8 animate-[uds-rise_400ms_ease-out] motion-reduce:animate-none md:grid-cols-2"
      >
        {shown.map(({ project, index }) => (
          <li key={project.id}>
            <WorkCard
              project={project}
              index={index}
              priority={at === 0 && index <= 2}
            />
          </li>
        ))}
      </ul>

      {looping && (
        <>
          <Control
            direction="down"
            label="Show the next row of projects"
            onClick={() => step(1)}
            className="border-t border-hairline pt-4"
          />
          {/* Announced on step, so the change is not visual-only.
              Phrased as a row position, not as a range of projects: on the
              last window the visible rows straddle the seam, so the first and
              last cards were announcing as "projects 5 to 2 of 6" — a range
              that runs backwards and describes nothing. */}
          <p aria-live="polite" className="sr-only">
            Row {at + 1} of {rowCount}
          </p>
        </>
      )}
    </div>
  );
}

/**
 * One stepper row: a hairline, the caller's label on the left, and the chevron
 * on the centre axis.
 *
 * The control started right-aligned, on the reasoning that everything else on
 * this site sits on the grid rather than on the axis. That was the wrong call
 * here and the studio said so: a bare 20px chevron in mute grey, pushed to the
 * far edge, read as a margin mark rather than as the thing that drives the
 * band. A centred control is not arbitrary centring — it is on the axis of the
 * grid it steps, directly above and below the two columns it moves, which is
 * the one place a reader's eye already is.
 *
 * Three columns rather than flex, so the chevron is centred on the row itself
 * and does not drift with the width of the counter beside it.
 *
 * Noticeable now comes from size and contrast rather than colour: a 48px
 * hairline square with a 24px chevron at full paper contrast, going to the
 * accent on hover and focus. The resting state stays monochrome — per
 * design.md the accent marks the single most important thing in view, and a
 * pair of steppers is not that until someone reaches for one.
 */
function Control({
  direction,
  label,
  onClick,
  className,
  children,
}: {
  direction: "up" | "down";
  label: string;
  onClick: () => void;
  className: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`grid grid-cols-3 items-center gap-4 ${className}`}>
      <span data-numeric className="text-meta uppercase text-secondary">
        {children}
      </span>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="group/step mx-auto flex size-12 items-center justify-center border border-hairline transition-colors duration-[var(--dur-fast)] hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent"
      >
        <Chevron
          direction={direction}
          className={`size-6 transition-transform duration-[var(--dur-base)] ease-out-soft motion-reduce:transition-none ${
            direction === "up"
              ? "group-hover/step:-translate-y-0.5"
              : "group-hover/step:translate-y-0.5"
          }`}
        />
      </button>
    </div>
  );
}
