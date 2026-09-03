"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import { Media } from "@/components/ui/Media";
import type { MediaAsset } from "@/types/content";

/**
 * The project slideshow.
 *
 * Deliberately minimal: one plate at a time in a fixed frame, an index, and
 * two controls on a hairline. No dots, no thumbnails, no autoplay — the site's
 * language is rules and interval, and a row of dots is a different language.
 * Autoplay in particular is out: it takes the pace of looking away from the
 * person doing the looking.
 *
 * How the transition works, and why it is built this way:
 *
 * - Every slide is rendered and stacked; only `opacity` and a small
 *   `translate` change. Nothing is added to or removed from the DOM as you
 *   move, so there is no layout work per slide and the crossfade composites.
 * - The frame keeps one ratio and crops to it. A slideshow that resizes to
 *   each image's own proportion makes the whole page jump on every press,
 *   which is the usual reason these feel cheap.
 * - Inactive slides are `inert` and `aria-hidden`, so a keyboard user cannot
 *   tab into a picture they cannot see, and a screen reader is not read six
 *   captions at once.
 *
 * Under reduced motion the transition is dropped — the slide simply changes.
 */
export function ProjectSlideshow({
  images,
  title,
}: {
  images: MediaAsset[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const headingId = useId();
  const rootRef = useRef<HTMLElement>(null);

  const count = images.length;

  const go = useCallback(
    (next: number) => {
      // Wraps in both directions: at the last plate "next" returns to the
      // first rather than presenting a dead control.
      setActive((current) => {
        const target = (next + count) % count;
        return target === current ? current : target;
      });
    },
    [count],
  );

  // Arrow keys, but only while the slideshow itself holds focus — binding them
  // to the window would hijack arrow keys for the whole page.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(active - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        go(active + 1);
      }
    };

    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [active, go]);

  if (count === 0) return null;

  return (
    <section
      ref={rootRef}
      aria-labelledby={headingId}
      aria-roledescription="carousel"
      className="group/slides"
    >
      <h2 id={headingId} className="sr-only">
        {title}
      </h2>

      <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink-soft">
        {images.map((image, i) => {
          const isActive = i === active;
          return (
            <div
              key={image.src + i}
              inert={!isActive || undefined}
              aria-hidden={!isActive || undefined}
              className={[
                "absolute inset-0 transition-[opacity,transform] duration-[var(--dur-cinematic)] ease-out-soft motion-reduce:transition-none",
                isActive
                  ? "opacity-100 translate-x-0"
                  : "pointer-events-none opacity-0",
                // The outgoing plate drifts a little the way the incoming one
                // arrives, so the pair reads as one move rather than a blink.
                !isActive && i < active ? "-translate-x-3" : "",
                !isActive && i > active ? "translate-x-3" : "",
              ].join(" ")}
            >
              <Media
                asset={image}
                ratio="wide"
                priority={i === 0}
                sizes="(min-width: 1024px) 90vw, 100vw"
              />
            </div>
          );
        })}
      </div>

      {/* The rule: index left, caption centre, controls right. */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-hairline pt-4">
        <p className="flex items-baseline gap-2 text-meta uppercase text-secondary">
          <span data-numeric className="text-accent">
            {String(active + 1).padStart(2, "0")}
          </span>
          <span aria-hidden="true">/</span>
          <span data-numeric>{String(count).padStart(2, "0")}</span>
          {/* Announced on change, so a screen reader hears the position
              without the caption being re-read as a live region. */}
          <span aria-live="polite" className="sr-only">
            Image {active + 1} of {count}
          </span>
        </p>

        {images[active].credit && (
          <p className="order-3 w-full text-caption text-secondary md:order-none md:w-auto">
            {images[active].credit}
            {images[active].licence ? ` · ${images[active].licence}` : ""}
          </p>
        )}

        <div className="flex items-center gap-2">
          <SlideButton
            label="Previous image"
            onClick={() => go(active - 1)}
            direction="prev"
          />
          <SlideButton
            label="Next image"
            onClick={() => go(active + 1)}
            direction="next"
          />
        </div>
      </div>
    </section>
  );
}

function SlideButton({
  label,
  onClick,
  direction,
}: {
  label: string;
  onClick: () => void;
  direction: "prev" | "next";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group/nav flex size-11 items-center justify-center border border-hairline transition-colors duration-[var(--dur-base)] hover:border-accent hover:text-accent"
    >
      <span className="sr-only">{label}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="none"
        className={[
          "size-4 transition-transform duration-[var(--dur-base)] ease-out-soft motion-reduce:transition-none",
          direction === "prev"
            ? "rotate-180 group-hover/nav:-translate-x-0.5"
            : "group-hover/nav:translate-x-0.5",
        ].join(" ")}
      >
        <path
          d="M3 8h10M9 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="square"
        />
      </svg>
    </button>
  );
}
