"use client";

import { useEffect } from "react";
import Lenis from "lenis";

import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * The single Lenis instance for the whole site, mounted once in the root layout.
 *
 * Lenis was chosen over Locomotive Scroll: smaller, actively maintained, and it
 * does not take over layout — it only changes how the scroll position is
 * interpolated. Locomotive must never be installed alongside it (ruler.md §1).
 *
 * Under `prefers-reduced-motion: reduce` Lenis is never constructed at all, so
 * the browser's own scrolling is left completely untouched.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,
      // Exponential decay: responds immediately, settles without float.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch devices keep native scrolling — smoothing it fights the platform
      // and is the usual cause of "laggy" feeling scroll on phones.
      syncTouch: false,
      touchMultiplier: 1.6,
      // GSAP's ticker drives the loop below. Letting Lenis also schedule its own
      // frame would advance it twice per tick.
      autoRaf: false,
    });

    // One source of truth for scroll position, read by every ScrollTrigger.
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    // Without this, GSAP inserts a synthetic catch-up frame after any stall,
    // which lands as a visible jump in a scrubbed timeline.
    gsap.ticker.lagSmoothing(0);

    // Measurements taken before fonts and media settle are wrong. Re-measure
    // once each is done, and coalesce the calls.
    let refreshFrame = 0;
    const refresh = () => {
      if (refreshFrame) return;
      refreshFrame = window.requestAnimationFrame(() => {
        refreshFrame = 0;
        ScrollTrigger.refresh();
      });
    };
    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      if (refreshFrame) window.cancelAnimationFrame(refreshFrame);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
