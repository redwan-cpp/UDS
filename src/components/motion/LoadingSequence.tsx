"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/lib/gsap";

/**
 * First-visit reveal.
 *
 * Rules it is held to (design.md §6):
 * - Runs once per session, gated by the boot script's `js-intro` class so there
 *   is never a hydration flash of an overlay that should not be there.
 * - Never runs under `prefers-reduced-motion` or without JavaScript — the CSS
 *   keeps it hidden unless the boot script explicitly enabled it.
 * - Never exceeds 1.6s, and shortens when fonts and the hero poster are ready
 *   sooner. It covers ready content; it does not delay it.
 * - Skippable with any key or click.
 * - `aria-hidden`, so a screen reader goes straight to the page.
 *
 * On completion it dispatches `uds:ready`, which the hero waits for so the two
 * sequences read as one continuous move rather than two competing ones.
 */
export function LoadingSequence() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const doc = document.documentElement;
    if (!el || !doc.classList.contains("js-intro")) return;

    try {
      sessionStorage.setItem("uds-intro", "1");
    } catch {
      /* private mode — the intro simply runs again next visit */
    }

    document.body.style.overflow = "hidden";

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      doc.classList.remove("js-intro");
      document.body.style.overflow = "";
      window.dispatchEvent(new CustomEvent("uds:ready"));
    };

    const tl = gsap.timeline({ onComplete: finish });

    tl.to("[data-intro-word]", {
      yPercent: 0,
      duration: 0.55,
      ease: "power3.out",
      stagger: 0.04,
    })
      .fromTo(
        "[data-intro-rule]",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.5,
          ease: "power2.inOut",
          stagger: 0.08,
          transformOrigin: "left center",
        },
        0.3,
      )
      .fromTo(
        "[data-intro-accent]",
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.3,
          ease: "power2.inOut",
          transformOrigin: "top center",
        },
        0.7,
      )
      // The panel lifts while its content moves down by the same amount, so the
      // wordmark stays put as the surface leaves. Two transforms rather than a
      // clip-path repaint of the whole viewport.
      .to(
        el,
        { yPercent: -100, duration: 0.55, ease: "power3.inOut" },
        1.0,
      )
      .to(
        "[data-intro-inner]",
        { yPercent: 100, duration: 0.55, ease: "power3.inOut" },
        1.0,
      );

    // Hard ceiling. If anything stalls, the page is handed over regardless.
    const ceiling = window.setTimeout(() => {
      tl.progress(1);
      finish();
    }, 1600);

    // Skippable.
    const skip = () => {
      tl.timeScale(3.2);
    };
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });

    return () => {
      window.clearTimeout(ceiling);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      tl.kill();
      document.body.style.overflow = "";
      doc.classList.remove("js-intro");
    };
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="uds-intro surface-dark fixed inset-0 z-90 place-items-center overflow-hidden bg-ink"
    >
      <div data-intro-inner className="w-full px-(--gutter)">
        <div className="mx-auto flex w-full max-w-(--container-wide) flex-col gap-6">
          <span
            data-intro-rule
            className="block h-px w-full origin-left bg-line"
          />

          <div className="flex items-end justify-between gap-6">
            <span className="flex overflow-hidden text-h1 leading-none">
              {"UTHAN".split("").map((letter, i) => (
                <span key={i} className="overflow-hidden">
                  <span data-intro-word className="block translate-y-full">
                    {letter}
                  </span>
                </span>
              ))}
            </span>
            <span
              data-intro-accent
              className="mb-2 block h-10 w-px origin-top bg-pistachio sm:h-16"
            />
          </div>

          <span
            data-intro-rule
            className="block h-px w-full origin-left bg-line"
          />
        </div>
      </div>
    </div>
  );
}
