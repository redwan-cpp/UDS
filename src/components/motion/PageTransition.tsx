"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { NeonMark } from "@/components/motion/NeonMark";

/** How long the panel holds, fully covering, before wiping away. */
const COVER_MS = 420;
/** Must match `--dur-cinematic` in globals.css — the wipe-away transition. */
const WIPE_MS = 550;

type Phase = "idle" | "covering" | "wiping";

function reducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Route change reveal.
 *
 * Deliberately one-way: the new route is already rendered when this runs, and
 * the panel wipes off it. Nothing intercepts or delays navigation, so a
 * failure here can never leave a visitor stuck behind a stuck overlay.
 *
 * Driven by plain React state and CSS transitions, not a GSAP timeline —
 * on purpose, and not merely for parity with the rest of the motion system.
 * This fires on every navigation rather than once per session, which is a lot
 * more exposure than the first-visit intro gets, and a multi-step GSAP
 * timeline with a `setTimeout` rescue turned out not to be reliable enough
 * for that frequency: testing surfaced it getting stuck fully covering the
 * page — first from a React Strict Mode double-invoked effect firing the
 * transition on the very first paint, and separately from the rescue timeout
 * itself not reliably landing on a second navigation. A `data-phase`
 * attribute plus CSS transitions removes the failure mode outright: the
 * panel's position is a pure function of `phase`, which is ordinary React
 * state entered via React's own documented "adjusting state when a prop
 * changes" pattern — a second `useState` holding the last-seen pathname,
 * compared and updated during render, not a ref (this project's lint rules
 * forbid reading or writing `ref.current` during render outright, and the
 * pattern react.dev itself demonstrates for this exact case uses state, not a
 * ref, for that reason). Not inside an effect, so there is no cascading-
 * render lint issue and no window for a scheduled effect to silently fail to
 * fire, and the
 * transform itself is driven by the compositor, not by a JavaScript frame
 * callback.
 *
 * The mark's fill uses `NeonMark`'s CSS-transition path (`lit`) for the same
 * reason: an attribute flip a browser can animate on its own, not a value
 * something has to keep re-asserting every frame.
 *
 * Skipped on first paint; the loading sequence owns that moment.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // Seeded from the render itself. On the very first render (server or
  // client) this equals `pathname`, so the block below never fires for the
  // page a visitor actually landed on — only for a route that follows.
  const [previousPathname, setPreviousPathname] = useState(pathname);
  const [phase, setPhase] = useState<Phase>("idle");

  if (previousPathname !== pathname) {
    setPreviousPathname(pathname);
    if (!reducedMotion()) setPhase("covering");
  }

  // The *next* step after entering a phase is a genuine side effect (a timer),
  // so it belongs in an effect — just not the state entry itself above.
  useEffect(() => {
    if (phase === "covering") {
      const t = window.setTimeout(() => setPhase("wiping"), COVER_MS);
      return () => window.clearTimeout(t);
    }
    if (phase === "wiping") {
      const t = window.setTimeout(() => setPhase("idle"), WIPE_MS);
      return () => window.clearTimeout(t);
    }
  }, [phase]);

  return (
    <>
      <div
        aria-hidden="true"
        data-phase={phase}
        className="uds-transition-panel pointer-events-none fixed inset-0 z-80 grid place-items-center bg-ink"
      >
        <NeonMark lit={phase === "covering"} className="h-12 w-auto sm:h-16" />
      </div>
      {children}
    </>
  );
}
