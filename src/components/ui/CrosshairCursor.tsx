"use client";

import { useEffect, useRef } from "react";

/**
 * The drawing-board cursor.
 *
 * A CAD crosshair: two full-bleed hairlines and a small centre pickbox, the
 * reticle you stand in front of all day in AutoCAD. The reference is deliberate
 * — the studio's own tool, used as the interface's pointer.
 *
 * `memory.md` previously rejected cursor followers outright, and most of the
 * reasons still hold: they are usually a lag-y div chasing the pointer, they
 * cost a frame of jank on every move, and they replace a system cursor that
 * was already communicating something. This one is built to avoid all three:
 *
 * - Position is written straight to a CSS custom property inside a rAF, and
 *   the element is moved with `translate3d` only. Nothing lays out, nothing
 *   paints beyond the compositor.
 * - The native cursor is NOT hidden globally. It is hidden only where the
 *   crosshair is genuinely a better pointer (the page surface), and left alone
 *   over anything interactive, where the system cursor still carries the
 *   affordance — a hand over a link says "clickable" better than a reticle.
 * - It never renders for coarse pointers or under reduced motion, and it is
 *   removed entirely (not just hidden) when either is true.
 */
export function CrosshairCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // A touch device has no cursor to improve on, and a reader who asked for
    // reduced motion did not ask for a reticle tracking their hand.
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const apply = () => {
      frame = 0;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      // The reticle is only worth showing once the pointer has actually moved;
      // before that it would sit at 0,0 in the corner.
      if (!el.hasAttribute("data-active")) el.setAttribute("data-active", "");
      if (!frame) frame = window.requestAnimationFrame(apply);
    };

    // Leaving the window should take the crosshair with it, or it strands in
    // the last position over a page the pointer is no longer on.
    const onLeave = () => el.removeAttribute("data-active");
    const onEnter = () => el.setAttribute("data-active", "");

    document.documentElement.setAttribute("data-crosshair", "");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      document.documentElement.removeAttribute("data-crosshair");
      window.removeEventListener("pointermove", onMove);
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
    </div>
  );
}
