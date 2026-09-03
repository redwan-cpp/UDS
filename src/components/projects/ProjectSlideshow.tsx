"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import { Media } from "@/components/ui/Media";
import type { MediaAsset } from "@/types/content";

/** Past this much horizontal travel, a drag counts as a change of slide. */
const COMMIT_PX = 60;
/** Drag follows the pointer at this fraction, so the plate resists a little. */
const DRAG_DAMPING = 0.35;

/**
 * The project slideshow.
 *
 * Four ways to drive it, because different people reach for different ones:
 * the arrows, the thumbnails, a drag or swipe across the image, and the
 * keyboard. All four move the same state.
 *
 * Deliberately still not here: dots (a different visual language to this
 * site's rules and intervals — the thumbnails do that job and say more), and
 * autoplay (it takes the pace of looking away from the person looking).
 *
 * Performance notes, since this is the most interactive thing on the site:
 *
 * - Every slide is rendered and stacked. Only `opacity` and `transform`
 *   change, so a slide change composites and nothing re-lays-out.
 * - The drag writes its transform straight to the DOM inside a rAF, never
 *   through React state. Dragging is a per-frame event; routing it through
 *   the reconciler would re-render the whole slideshow on every pointer move.
 * - Inactive slides are `inert` and `aria-hidden`, so a keyboard user cannot
 *   tab into a picture they cannot see and a screen reader is not read every
 *   caption at once.
 *
 * Under reduced motion the transitions drop out and slides simply change.
 */
export function ProjectSlideshow({
  images,
  title,
}: {
  images: MediaAsset[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const headingId = useId();
  const rootRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const activeSlideRef = useRef<HTMLDivElement>(null);

  const drag = useRef({ startX: 0, dx: 0, active: false, frame: 0 });
  const count = images.length;

  const go = useCallback(
    (next: number) => {
      setActive((current) => {
        const target = (next + count) % count;
        return target === current ? current : target;
      });
    },
    [count],
  );

  // Arrow keys, but only while the slideshow holds focus — binding them to the
  // window would hijack arrow keys for the whole page.
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

  // Any committed change clears the inline transform the drag was writing, so
  // the CSS transition owns the plate again.
  useEffect(() => {
    const el = activeSlideRef.current;
    if (el) el.style.transform = "";
  }, [active]);

  const paint = useCallback(() => {
    drag.current.frame = 0;
    const el = activeSlideRef.current;
    if (el) {
      el.style.transform = `translate3d(${drag.current.dx * DRAG_DAMPING}px, 0, 0)`;
    }
  }, []);

  const onPointerDown = (event: React.PointerEvent) => {
    // Ignore secondary buttons, and let a real click on a control through.
    if (event.button !== 0) return;
    drag.current.startX = event.clientX;
    drag.current.dx = 0;
    drag.current.active = true;
    setDragging(true);
    frameRef.current?.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!drag.current.active) return;
    drag.current.dx = event.clientX - drag.current.startX;
    if (!drag.current.frame) {
      drag.current.frame = window.requestAnimationFrame(paint);
    }
  };

  const endDrag = (event: React.PointerEvent) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setDragging(false);
    frameRef.current?.releasePointerCapture?.(event.pointerId);

    if (drag.current.frame) {
      window.cancelAnimationFrame(drag.current.frame);
      drag.current.frame = 0;
    }

    const { dx } = drag.current;
    const el = activeSlideRef.current;
    if (el) el.style.transform = "";

    if (Math.abs(dx) > COMMIT_PX) {
      go(dx < 0 ? active + 1 : active - 1);
    }
    drag.current.dx = 0;
  };

  if (count === 0) return null;

  return (
    <section
      ref={rootRef}
      aria-labelledby={headingId}
      aria-roledescription="carousel"
    >
      <h2 id={headingId} className="sr-only">
        {title}
      </h2>

      <div
        ref={frameRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={[
          "relative aspect-[16/9] w-full touch-pan-y overflow-hidden bg-ink-soft select-none",
          dragging ? "cursor-grabbing" : "cursor-grab",
        ].join(" ")}
      >
        {images.map((image, i) => {
          const isActive = i === active;
          return (
            <div
              key={image.src + i}
              ref={isActive ? activeSlideRef : undefined}
              inert={!isActive || undefined}
              aria-hidden={!isActive || undefined}
              className={[
                "absolute inset-0",
                // No transition while the finger is down: the plate has to
                // track the pointer exactly, or the drag feels like lag.
                dragging
                  ? ""
                  : "transition-[opacity,transform] duration-[var(--dur-cinematic)] ease-out-soft motion-reduce:transition-none",
                isActive
                  ? "opacity-100 translate-x-0 scale-100"
                  : "pointer-events-none opacity-0",
                // The outgoing plate drifts and sits back a touch, so the pair
                // reads as one move with depth rather than a blink.
                !isActive && i < active ? "-translate-x-4 scale-[1.03]" : "",
                !isActive && i > active ? "translate-x-4 scale-[1.03]" : "",
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

        {/* Progress. Sits on the frame's own bottom edge and measures how far
            through the set you are — the same job a row of dots does, in the
            language the rest of the site already uses. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-paper/20"
        >
          <div
            className="h-full origin-left bg-accent transition-transform duration-[var(--dur-cinematic)] ease-out-soft motion-reduce:transition-none"
            style={{ transform: `scaleX(${(active + 1) / count})` }}
          />
        </div>
      </div>

      {/* The rule: index left, credit centre, controls right. */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p className="flex items-baseline gap-2 text-meta uppercase text-secondary">
          <span data-numeric className="text-accent">
            {String(active + 1).padStart(2, "0")}
          </span>
          <span aria-hidden="true">/</span>
          <span data-numeric>{String(count).padStart(2, "0")}</span>
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

      {/* Thumbnails. Every plate reachable in one action rather than by
          pressing "next" four times. */}
      {count > 1 && (
        <ul className="mt-6 flex flex-wrap gap-3">
          {images.map((image, i) => {
            const isActive = i === active;
            return (
              <li key={"thumb" + image.src + i}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-current={isActive ? "true" : undefined}
                  className={[
                    "group/thumb relative block w-20 overflow-hidden transition-opacity duration-[var(--dur-base)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:w-24",
                    isActive
                      ? "opacity-100"
                      : "opacity-45 hover:opacity-80",
                  ].join(" ")}
                >
                  <span className="sr-only">
                    Show image {i + 1} of {count}
                  </span>
                  <Media
                    asset={image}
                    ratio="landscape"
                    sizes="96px"
                    className="pointer-events-none"
                  />
                  <span
                    aria-hidden="true"
                    className={[
                      "absolute inset-x-0 bottom-0 block h-0.5 origin-left bg-accent transition-transform duration-[var(--dur-base)] ease-out-soft motion-reduce:transition-none",
                      isActive ? "scale-x-100" : "scale-x-0",
                    ].join(" ")}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
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
