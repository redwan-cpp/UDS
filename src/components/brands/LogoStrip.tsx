"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

import { prefersReducedMotion } from "@/lib/gsap";
import type { Brand } from "@/types/content";

/** Pixels per second. Slow enough to read a name without waiting for it. */
const SPEED = 26;

/**
 * The collaborator strip: a roll-call that moves until someone reaches for it.
 *
 * **It animates `scrollLeft`, not a transform, and that is the whole design.**
 * The first version of this was a CSS marquee translating a duplicated track,
 * which is cheaper — but a translated track and a scrollbar cannot both be
 * telling the truth. The bar reports `scrollLeft`, which stays at zero while
 * the transform slides the content past it, so grabbing the bar would jump the
 * row to a position unrelated to what was on screen a moment earlier. Driving
 * the real scroll position instead means the bar is always accurate, pausing
 * is just declining to add the next increment, and a reader who then drags it
 * continues from exactly where the motion stopped.
 *
 * The cost is one property write per frame, where the CSS version ran nothing.
 * That is the price of the scrollbar working, and it is paid only while the
 * strip is actually on screen — an `IntersectionObserver` stops the loop
 * otherwise, so a band four screens down is not animating at the reader.
 *
 * **The seam.** The list is rendered twice and the position wraps by exactly
 * half the track, so the jump lands on identical content and cannot be seen.
 * The second pass is `aria-hidden`, so the names are not announced twice.
 *
 * **Pausing.** Hover or focus stops it, and the scrollbar takes colour at the
 * same moment — the row says "you have control now" with the same gesture that
 * gives it. Touch does not hover, so a `touchstart` pause is wired too;
 * otherwise the first drag on a phone would be a tug of war with the loop.
 *
 * Under reduced motion nothing moves at all and the bar is always visible: the
 * strip degrades to the plain scroller it was, which is a complete way to read
 * the list rather than a lesser one.
 *
 * `Brand.logo` is the CMS field. A collaborator without one shows the name
 * alone — no invented mark, and no placeholder box either. The struck-through
 * plate that used to hold the slot was the least minimal thing in the row and
 * it repeated eight times; a name set on its own is how architecture practices
 * list consultants anyway, and the mark simply joins it when there is one.
 */
export function LogoStrip({ brands }: { brands: Brand[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let frame = 0;
    let last = 0;
    let paused = false;
    let visible = false;

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const delta = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      if (paused) return;

      // Half the track is one full pass of the list. Wrapping there lands on
      // the identical second copy, so there is nothing to see.
      const half = el.scrollWidth / 2;
      let next = el.scrollLeft + SPEED * delta;
      if (half > 0 && next >= half) next -= half;
      el.scrollLeft = next;
    };

    const start = () => {
      if (frame) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (!frame) return;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const pause = () => {
      paused = true;
    };
    const resume = () => {
      paused = false;
      last = 0; // don't credit the paused time as a jump
    };

    // Only run while the row is actually on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(el);

    el.addEventListener("pointerenter", pause);
    el.addEventListener("pointerleave", resume);
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", resume);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume, { passive: true });

    return () => {
      io.disconnect();
      stop();
      el.removeEventListener("pointerenter", pause);
      el.removeEventListener("pointerleave", resume);
      el.removeEventListener("focusin", pause);
      el.removeEventListener("focusout", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
    };
  }, []);

  if (brands.length === 0) return null;

  const passes = [
    { items: brands, hidden: false },
    { items: brands, hidden: true },
  ];

  return (
    <div
      ref={ref}
      tabIndex={0}
      role="group"
      aria-label="Collaborators and consultants"
      className="uds-strip -mx-(--gutter) flex px-(--gutter) pb-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      {passes.map((pass, i) => (
        <ul
          key={i}
          aria-hidden={pass.hidden || undefined}
          className="flex shrink-0 items-center"
        >
          {pass.items.map((brand) => (
            <li
              key={`${i}-${brand.id}`}
              className="flex shrink-0 items-center gap-4 pr-12 lg:pr-16"
            >
              {brand.logo && (
                <Image
                  src={brand.logo.src}
                  alt=""
                  width={brand.logo.width}
                  height={brand.logo.height}
                  className="h-7 w-auto max-w-[7rem] object-contain"
                />
              )}
              <span className="text-h3 whitespace-nowrap text-secondary">
                {brand.name}
              </span>
              {/* The interval mark. A hairline rule rather than a filled dot:
                  structure on this site is carried by rules, and a row of dots
                  travelling past reads as punctuation nobody wrote. */}
              <span
                aria-hidden="true"
                className="ml-12 block h-px w-8 shrink-0 bg-hairline lg:ml-16"
              />
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
