"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
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
 *
 * ## Route changes
 *
 * Lenis keeps its own scroll position — a `targetScroll` it interpolates
 * toward and writes to the window every frame. Nothing about a client-side
 * navigation tells it that the document underneath it has been replaced, so
 * without the effect below it carries the old page's position into the new
 * one and re-asserts it on its next tick, over whatever the router just set.
 *
 * The symptom that surfaces first is landing on a page already scrolled, or a
 * first scroll gesture that jumps. It is timing-dependent, which is what makes
 * it nasty: with a mouse wheel the events stop the moment you stop turning it,
 * and the race is usually won by the router. With a trackpad they do not —
 * inertial momentum keeps delivering wheel events for a second or more after
 * the click that navigated, and those land on the new page and drive it.
 *
 * `ScrollTrigger.refresh()` belongs here for the same reason: it was only ever
 * called on `fonts.ready` and window `load`, both of which fire once for the
 * page a visitor lands on. Every route reached by clicking a link afterwards
 * kept the previous page's measurements, so reveals were being triggered
 * against positions belonging to a document that no longer existed.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const poppedRef = useRef(false);
  const pathname = usePathname();

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
    lenisRef.current = lenis;

    // One source of truth for scroll position, read by every ScrollTrigger.
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    // Without this, GSAP inserts a synthetic catch-up frame after any stall,
    // which lands as a visible jump in a scrubbed timeline.
    gsap.ticker.lagSmoothing(0);

    // Which kind of navigation this is decides where the new page should sit,
    // and the two answers are different enough that guessing from the scroll
    // position afterwards is not good enough — see the effect below.
    const onPop = () => {
      poppedRef.current = true;
    };
    window.addEventListener("popstate", onPop);

    // Measurements taken before fonts and media settle are wrong. Re-measure
    // once each is done — through one debounce shared with the height watcher
    // below, so fonts, `load` and the page's own reflows during startup, which
    // all land within about a second of each other, cost as few refreshes as
    // possible rather than one each.
    let settle = 0;
    const refresh = () => {
      window.clearTimeout(settle);
      settle = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener("load", refresh);

    // …and whenever the page changes height. Fonts and `load` are not the only
    // things that move content after triggers are measured, and on a fast
    // connection `load` can fire *before* hydration, so it is not even reliable
    // for those. The case that proved it: the work grid is server-rendered with
    // every project and collapses to four cards once the browser measures its
    // columns. Every trigger below it — the figures, the closing section — was
    // created in that same render and kept positions from a page ~2,400px
    // taller than the one on screen. Measured on a production build: the
    // counters started 1,641px after they had scrolled off the top, and the
    // closing section revealed only at the very bottom of the page. The same
    // happens, smaller, whenever "show more" adds a row.
    //
    // Debounced, and only for a change in *height*. A refresh measures every
    // trigger on the page, which forces a full layout — on a throttled phone
    // CPU that measured 100–340ms each, and during load the body resizes
    // several times in a second (the grid collapsing, the serif arriving and
    // reflowing). Refreshing on each one turned 450ms of main-thread work into
    // 2.1s. Width changes and sub-pixel jitter are ignored: neither moves a
    // trigger, and viewport resizes already refresh on their own.
    //
    // The height comes from the observer's own entry, not `offsetHeight`.
    // Reading `offsetHeight` here forces a synchronous layout of the whole
    // page, and doing it during hydration measured as ~250ms of later
    // DOMContentLoaded on a throttled phone. The entry is computed by the
    // browser's own layout pass and costs nothing to read.
    let lastHeight = -1;
    const resize = new ResizeObserver(([entry]) => {
      const height = entry.contentRect.height;
      if (Math.abs(height - lastHeight) < 2) return;
      lastHeight = height;
      refresh();
    });
    resize.observe(document.body);

    return () => {
      resize.disconnect();
      window.clearTimeout(settle);
      window.removeEventListener("load", refresh);
      window.removeEventListener("popstate", onPop);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    const wasPop = poppedRef.current;
    poppedRef.current = false;
    const hasHash = Boolean(window.location.hash);

    // Back, forward, or a link carrying a fragment: something else — history
    // restoration or the anchor — owns where this page belongs, and it may not
    // have applied it yet. Take a frame, then adopt whatever it decided.
    if (wasPop || hasHash) {
      const frame = window.requestAnimationFrame(() => {
        lenis.scrollTo(window.scrollY, { immediate: true, force: true });
        ScrollTrigger.refresh();
      });
      return () => window.cancelAnimationFrame(frame);
    }

    // An ordinary link: the new page starts at the top. Set that outright
    // rather than reading `window.scrollY` and adopting it — the value there
    // is exactly what may already have been overwritten by Lenis's own
    // carried-over target, so reading it is reading the bug.
    lenis.scrollTo(0, { immediate: true, force: true });
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}
