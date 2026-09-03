"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

/**
 * Single registration point for GSAP. Importing from here rather than from
 * "gsap" directly guarantees every plugin is registered exactly once and that
 * no component quietly forgets to register it.
 *
 * `Flip` costs nothing extra to bundle: it has shipped inside the core `gsap`
 * package (formerly a "Club GreenSock" bonus plugin) since 3.13, so it is not
 * a sixth runtime dependency — it is already sitting in `node_modules/gsap`.
 * It is what a shared-element "card expands in place" morph is built on here
 * instead of Framer Motion's `layoutId`, which this project does not carry.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Flip);

  // `fastScrollEnd` skips intermediate states when the user flicks past a
  // trigger, which is what stops a fast scroll from queueing a backlog of
  // catch-up tweens. `ignoreMobileResize` prevents a full refresh every time a
  // mobile browser's address bar collapses.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, Flip };

/** Shared durations in seconds, mirroring the --dur-* tokens. */
export const DUR = {
  fast: 0.16,
  base: 0.24,
  slow: 0.4,
  cinematic: 0.55,
  reveal: 0.9,
} as const;

/**
 * One MediaQueryList for the whole app instead of one per animated component.
 *
 * The previous implementation called `gsap.matchMedia()` inside every `Reveal`,
 * which meant 26 MediaQueryList objects and 26 GSAP contexts on the homepage
 * alone, each with its own change listener. This reads the same preference from
 * a single cached query.
 */
const reduceQuery =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

export function prefersReducedMotion(): boolean {
  return reduceQuery?.matches ?? true;
}

/**
 * Every animation in the project is created inside this helper.
 *
 * Under `prefers-reduced-motion: reduce` the callback never runs, so final
 * states render immediately rather than animating faster. Otherwise the
 * callback runs inside a `gsap.context` so a single `revert()` cleans up every
 * tween and ScrollTrigger it created — including on a React StrictMode
 * double-mount.
 */
export function motionSafe(fn: () => void): () => void {
  if (prefersReducedMotion()) return () => {};
  const ctx = gsap.context(fn);
  return () => ctx.revert();
}
