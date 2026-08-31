"use client";

import { useEffect } from "react";

/**
 * The guarantee behind the whole reveal system.
 *
 * `ruler.md` requires that the page is complete and readable even when an
 * animation does not run. The CSS-armed pattern already covers the two
 * predictable cases — no JavaScript, and reduced motion — because the boot
 * script never arms anything in either. This covers the unpredictable ones:
 * a script error, a dead GSAP ticker, a bfcache restore, or a tab throttled so
 * hard mid-tween that it never finishes.
 *
 * Implementation note: this used to poll on a 1s interval, calling
 * `getBoundingClientRect()` on every armed element on the page. That forced a
 * synchronous layout every second, on every route, for the life of the session —
 * a permanent tax to catch a failure that almost never happens. It is now an
 * IntersectionObserver: elements are only timed while they are actually on
 * screen, and a healthy reveal unobserves itself the moment it completes, so
 * steady-state cost is zero.
 */
const ARMED = [
  "[data-reveal]:not([data-revealed])",
  "[data-reveal-children]:not([data-revealed])",
  "[data-reveal-curtain]:not([data-revealed])",
  "[data-reveal-rule]:not([data-revealed])",
  "[data-reveal-words]:not([data-revealed])",
].join(",");

/** Long enough that no healthy animation is ever cut short. */
const GRACE_MS = 4000;

export function MotionFailsafe() {
  useEffect(() => {
    if (!document.documentElement.classList.contains("js-motion")) return;

    const timers = new Map<Element, number>();

    const rescue = (el: Element) => {
      el.setAttribute("data-revealed", "");
      // Clear whatever a stalled tween left inline, so the CSS rules win.
      el.querySelectorAll<HTMLElement>(
        "[data-word], [data-reveal-media], [data-curtain-inner], [data-curtain-inner] > *",
      ).forEach((child) => child.removeAttribute("style"));
      if (el instanceof HTMLElement) el.removeAttribute("style");
      Array.from(el.children).forEach((child) => {
        if (child instanceof HTMLElement) child.removeAttribute("style");
      });
    };

    const clear = (el: Element) => {
      const id = timers.get(el);
      if (id !== undefined) {
        window.clearTimeout(id);
        timers.delete(el);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target;
          if (!entry.isIntersecting) {
            clear(el);
            continue;
          }
          // Already finished on its own between observation and callback.
          if (el.hasAttribute("data-revealed")) {
            observer.unobserve(el);
            clear(el);
            continue;
          }
          if (timers.has(el)) continue;
          timers.set(
            el,
            window.setTimeout(() => {
              timers.delete(el);
              if (!el.hasAttribute("data-revealed")) rescue(el);
              observer.unobserve(el);
            }, GRACE_MS),
          );
        }
      },
      { threshold: 0.01 },
    );

    document.querySelectorAll(ARMED).forEach((el) => observer.observe(el));

    // A tab returning to the foreground is the most likely moment to find a
    // stalled tween. This is the only sweep, and it runs on an event rather
    // than on a clock.
    const onVisible = () => {
      if (document.hidden) return;
      document.querySelectorAll(ARMED).forEach((el) => observer.observe(el));
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", onVisible);

    return () => {
      observer.disconnect();
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", onVisible);
    };
  }, []);

  return null;
}
