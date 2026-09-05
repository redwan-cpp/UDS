"use client";

import { useId, useRef, useState } from "react";

import { Media } from "@/components/ui/Media";
import { Eyebrow } from "@/components/typography";
import type { ExpertiseArea } from "@/types/content";

/**
 * The expertise browser — the nine areas as an index, one of them open.
 *
 * This replaces a full-width band that listed all nine as rows with their
 * descriptions and a sticky companion image. That band worked, but it said
 * the same thing as the studio statement beside it at four times the height:
 * nine paragraphs is a lot of page to spend establishing that a practice does
 * architecture and interiors. Here it is a column sharing a spread with the
 * statement — the index stays whole, and only the open area's photograph and
 * description are spent on.
 *
 * **The rail carries titles, not just numbers.** A rail of nine bare numerals
 * was the first attempt and it was wrong twice over: it hid what the areas
 * actually are behind a hover, and a two-digit numeral is a 16×25px target,
 * under both the WCAG 2.2 floor and this site's own 44px rule. Full-width
 * rows fix both without a padding trick — the set is readable at a glance and
 * every row is a real target.
 *
 * **A tablist, and a real one.** The old rows were deliberately not focusable,
 * on the reasoning that a tab stop which only swaps a decorative image is a
 * trap with no payoff. That does not survive this layout: the image is no
 * longer decorative, because the description travels with it, so a keyboard
 * user who cannot reach the rail cannot reach eight ninths of the content.
 * Up/Down move between areas (the rail is vertical), Home and End jump to the
 * ends, and only the open row holds a tab stop, so the index costs one stop
 * rather than nine.
 *
 * Hover also opens a row, on a fine pointer — the same gesture the site index
 * already uses to preview a route, and what keeps this feeling like something
 * to run down rather than nine buttons to click.
 */
export function ExpertiseBrowser({
  areas,
  eyebrow,
  index,
}: {
  areas: ExpertiseArea[];
  /** Sits opposite the statement's own label, so the two panels read as a pair. */
  eyebrow: string;
  /** Two-digit index, continuing the page's numbering. */
  index: string;
}) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  if (areas.length === 0) return null;

  const area = areas[active];
  const tabId = (i: number) => `${baseId}-tab-${i}`;
  const panelId = `${baseId}-panel`;

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = areas.length - 1;
    let next: number | null = null;

    // Both axes accepted: the rail is vertical, but left/right is a reflex on
    // anything that behaves like a set, and refusing it only puzzles people.
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      next = active === last ? 0 : active + 1;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      next = active === 0 ? last : active - 1;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = last;
    }

    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div>
      <div className="flex items-baseline gap-4 pb-4">
        <span className="text-meta uppercase text-accent" data-numeric>
          {index}
        </span>
        <Eyebrow>{eyebrow}</Eyebrow>
      </div>
      <div className="h-px w-full bg-hairline" />

      <h2 id={`${baseId}-heading`} className="sr-only">
        Areas of work
      </h2>

      {/* Every frame is rendered and stacked; only the open one is painted.
          `.fade-layer` toggles `visibility` alongside `opacity`, so the eight
          closed photographs leave the paint tree instead of compositing a
          layer each — which matters at nine. */}
      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={tabId(active)}
        className="pt-8"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink-soft">
          {areas.map((item, i) => (
            <div
              key={item.id}
              data-active={i === active || undefined}
              className="fade-layer absolute inset-0"
            >
              <Media
                asset={item.image}
                ratio="wide"
                priority={i === 0}
                sizes="(min-width: 1024px) 32vw, 100vw"
              />
            </div>
          ))}
        </div>

        <p className="mt-5 max-w-[46ch] text-small text-secondary text-pretty">
          {area.description}
        </p>
      </div>

      {/* The index. Full-width rows separated by hairlines — the same shape a
          drawing set's contents page uses, and the shape this list had before
          it was folded into a column. */}
      <div
        role="tablist"
        aria-labelledby={`${baseId}-heading`}
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="mt-8 flex flex-col"
      >
        {areas.map((item, i) => {
          const current = i === active;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={tabId(i)}
              aria-controls={panelId}
              aria-selected={current}
              tabIndex={current ? 0 : -1}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group/area grid w-full grid-cols-[auto_1fr] items-baseline gap-x-4 border-t border-hairline py-2.5 text-left last:border-b"
            >
              <span
                data-numeric
                className={[
                  "text-meta uppercase transition-colors duration-[var(--dur-fast)]",
                  current ? "text-accent" : "text-secondary group-hover/area:text-accent",
                ].join(" ")}
              >
                {item.index}
              </span>
              <span
                className={[
                  // Only the transition drops under reduced motion, not the
                  // indent itself: the offset marks which row is open, so
                  // removing it would take away state, not decoration.
                  // (Tailwind v4 drives this through the `translate`
                  // property, so a `transform-none` guard here would be a
                  // no-op as well as wrong.)
                  "text-small transition-transform duration-[var(--dur-base)] ease-out-soft motion-reduce:transition-none",
                  current
                    ? "translate-x-1.5 text-current"
                    : "text-secondary group-hover/area:translate-x-1.5 group-hover/area:text-current",
                ].join(" ")}
              >
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
