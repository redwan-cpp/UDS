"use client";

import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/lib/gsap";

/**
 * Elements the pickbox "snaps" to.
 *
 * This is now the only definition of "interactive" the cursor has. It used to
 * be paired with a `cursor: pointer` list in the CSS that had to be kept
 * identical; that list is gone, because the system cursor is hidden
 * everywhere, so there is nothing left for this to drift against.
 */
const SNAP_SELECTOR =
  'a[href], button, input, select, textarea, summary, [role="button"], [tabindex]:not([tabindex="-1"])';

/**
 * The drawing-board cursor.
 *
 * A CAD crosshair: two short hairlines and a small centre pickbox, the
 * reticle you stand in front of all day in AutoCAD — sized to read as an
 * instrument near the pointer, not a pair of lines drawn across whatever the
 * visitor is trying to look at — carrying two more pieces of that reference,
 * both real conventions from that software rather than invented decoration:
 *
 * - **A coordinate readout.** AutoCAD's dynamic input shows the cursor's
 *   position in drawing units as it moves; this shows it in screen pixels,
 *   zero-padded to read as data rather than as prose, in the same tabular
 *   numeral register the site's indices and statistics already use.
 * - **A snap state.** Passing over anything interactive fills the pickbox
 *   solid and swaps the readout for a short label — the same "object snap
 *   acquired" feedback CAD gives when the cursor finds an endpoint or a
 *   midpoint to lock onto, repurposed here for "there is something to click."
 *
 * **It is monochrome, and flips with the surface it is over.** A
 * `data-surface` attribute, set from a hit-test against the nearest
 * `.surface-dark` / `.surface-light` ancestor of whatever is under the
 * pointer, paints it paper on ink and ink on paper — 17.5:1 either way. It
 * was pistachio and olive; an instrument is not an accent, and the accent has
 * one job on this site that a reticle following the pointer can never be.
 *
 * `memory.md` previously rejected cursor followers outright; this reverses
 * that, at the studio's request, with the objections it raised still
 * answered: position, the readout's text and the surface hit-test are all
 * written directly to the DOM inside a single rAF-throttled handler — never
 * through React state, so none of this costs a re-render. Never mounted for
 * coarse pointers or reduced motion.
 *
 * The system cursor is hidden everywhere rather than over the page surface
 * only. Leaving it on interactive elements stacked the OS arrow on top of the
 * reticle over every link and field; the snap state is what carries the
 * affordance instead.
 */
export function CrosshairCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches || prefersReducedMotion()) return;

    const coords = el.querySelector<HTMLElement>("[data-crosshair-coords]");

    let frame = 0;
    let x = 0;
    let y = 0;
    let snapped = false;
    let surface: "dark" | "light" | null = null;

    const apply = () => {
      frame = 0;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (coords && !snapped) {
        // Zero-padded to a fixed width, the way the site's own numeric
        // registers (project years, statistics) never reflow as digits
        // change — a readout that jitters sideways defeats the purpose of it
        // reading as an instrument rather than as passing commentary.
        coords.textContent = `X ${String(Math.round(x)).padStart(4, "0")}  Y ${String(Math.round(y)).padStart(4, "0")}`;
      }

      // The cursor is `pointer-events: none` (inherited by every child), so
      // this hit-test lands on whatever is actually underneath it, never on
      // the crosshair itself. Walking to the nearest `.surface-dark` /
      // `.surface-light` ancestor reuses the exact rule every section on the
      // page already follows for its own accent — the cursor gets the same
      // pistachio-on-dark / olive-on-light flip everything else does,
      // instead of a colour blend standing in for it.
      const under = document.elementFromPoint(x, y);
      const surfaceEl = under?.closest(".surface-dark, .surface-light");
      const next = surfaceEl?.classList.contains("surface-light") ? "light" : "dark";
      if (next !== surface) {
        surface = next;
        el.setAttribute("data-surface", surface);
      }
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!el.hasAttribute("data-active")) el.setAttribute("data-active", "");
      if (!frame) frame = window.requestAnimationFrame(apply);
    };

    // Snap state: real hit-testing on the element underneath, driven by
    // native bubbling `pointerover`/`pointerout` rather than a second
    // per-frame poll — this only runs when the hovered element actually
    // changes, not sixty times a second.
    const onOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest(SNAP_SELECTOR)) return;
      snapped = true;
      el.setAttribute("data-snap", "");
      if (coords) coords.textContent = "SELECT";
    };

    const onOut = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest(SNAP_SELECTOR)) return;
      // `relatedTarget` is where the pointer is going — if it is still inside
      // the same interactive element (moving between its own children), this
      // is not a real exit and must not drop the snap state.
      const related = event.relatedTarget as Element | null;
      if (related?.closest(SNAP_SELECTOR) === target.closest(SNAP_SELECTOR)) {
        return;
      }
      snapped = false;
      el.removeAttribute("data-snap");
    };

    const onLeave = () => el.removeAttribute("data-active");
    const onEnter = () => el.setAttribute("data-active", "");

    document.documentElement.setAttribute("data-crosshair", "");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      document.documentElement.removeAttribute("data-crosshair");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="uds-crosshair">
      <span className="uds-crosshair__h" />
      <span className="uds-crosshair__v" />
      <span className="uds-crosshair__box" />
      <span
        data-crosshair-coords
        data-numeric
        className="uds-crosshair__coords"
      />
    </div>
  );
}
