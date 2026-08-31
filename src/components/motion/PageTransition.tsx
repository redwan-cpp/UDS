"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { gsap } from "@/lib/gsap";

/**
 * Route change reveal.
 *
 * Deliberately one-way: the new route is already rendered when this runs, and
 * the panel wipes off it. Nothing intercepts or delays navigation, so a failure
 * here can never leave a visitor stuck behind a stuck overlay — the worst case
 * is no transition at all.
 *
 * Skipped on first paint; the loading sequence owns that moment.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    const el = panel.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // The panel is a flat fill, so translating it off the top reads exactly as
    // the clip wipe did while staying on the compositor.
    const tl = gsap.timeline({
      onComplete: () => gsap.set(el, { willChange: "auto", yPercent: 100 }),
    });

    tl.set(el, { yPercent: 0, willChange: "transform" }).to(el, {
      yPercent: -100,
      duration: 0.55,
      ease: "power3.inOut",
    });

    return () => {
      tl.kill();
      gsap.set(el, { willChange: "auto" });
    };
  }, [pathname]);

  return (
    <>
      <div
        ref={panel}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-80 bg-ink"
        style={{ transform: "translate3d(0, 100%, 0)" }}
      />
      {children}
    </>
  );
}
