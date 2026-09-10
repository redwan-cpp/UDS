"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

import { gsap } from "@/lib/gsap";

/**
 * First-visit reveal.
 *
 * **The mark holds still and a measure fills.** This used to animate the mark
 * itself — a neon fill, then the letters of UTHAN staggering up out of a mask,
 * then an accent rule dropping in. Four things moving, none of them telling the
 * reader anything. The studio asked for the opposite and the opposite is
 * better: the logo is the one element that should not be performing, and a bar
 * running 0 to 100 is the only part of a preloader that carries information.
 *
 * So: the studio's own lockup, static, above a hairline that fills left to
 * right with a percentage counted alongside it. The numerals are the site's
 * tabular register, zero-padded, so the count does not reflow as digits change
 * — the same reason the crosshair's coordinate readout is padded.
 *
 * **The percentage is honest about what it measures.** It is the intro's own
 * progress, not the page's, and it is not pretending to track downloads. Nobody
 * is misled by that — a preloader bar is a convention for "wait a moment" — but
 * it is worth not claiming otherwise in the code.
 *
 * Rules it is held to (design.md §6), all unchanged:
 * - Runs once per session, gated by the boot script's `js-intro` class, so
 *   there is never a hydration flash of an overlay that should not be there.
 * - Never under `prefers-reduced-motion` or without JavaScript.
 * - Never exceeds 2.4s, and hands over early if anything stalls.
 * - Skippable with any key or click.
 * - `aria-hidden`, so a screen reader goes straight to the page.
 *
 * On completion it dispatches `uds:ready`, which the hero waits for so the two
 * sequences read as one move rather than two competing ones.
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

    const bar = el.querySelector<HTMLElement>("[data-intro-bar]");
    const count = el.querySelector<HTMLElement>("[data-intro-count]");

    const tl = gsap.timeline({ onComplete: finish });

    // One tween drives both the bar and the number, so they cannot disagree.
    // `power1.inOut` rather than a linear ramp: a bar that starts and stops
    // dead reads as a progress report, and this is a curtain.
    const progress = { value: 0 };
    tl.to(progress, {
      value: 1,
      duration: 1.25,
      ease: "power1.inOut",
      onUpdate: () => {
        if (bar) bar.style.transform = `scaleX(${progress.value})`;
        if (count) {
          count.textContent = String(Math.round(progress.value * 100)).padStart(
            3,
            "0",
          );
        }
      },
    })
      // A beat at full before the panel leaves, so 100 is actually seen rather
      // than glimpsed on the way out.
      .to({}, { duration: 0.18 })
      // The panel lifts while its content moves down by the same amount, so
      // the lockup stays put as the surface leaves. Two transforms rather than
      // a clip-path repaint of the whole viewport — this is the one place a
      // viewport-sized element is in motion, which is exactly the case the
      // reveal contract avoids clip-path for.
      .to(el, { yPercent: -100, duration: 0.7, ease: "power3.inOut" })
      .to(
        "[data-intro-inner]",
        { yPercent: 100, duration: 0.7, ease: "power3.inOut" },
        "<",
      );

    // Hard ceiling. If anything stalls, the page is handed over regardless.
    const ceiling = window.setTimeout(() => {
      tl.progress(1);
      finish();
    }, 2400);

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
        <div className="mx-auto flex w-full max-w-(--container-wide) flex-col gap-8">
          {/* The studio's own lockup, on the ink derivative because this panel
              is always ink. Static — it is the fixed point the measure runs
              under. `priority` so it is not the thing being waited for. */}
          <Image
            src="/brand/uthan-lockup-on-ink.svg"
            alt=""
            width={917}
            height={300}
            priority
            unoptimized
            className="h-auto w-full max-w-[min(13rem,50%)]"
          />

          <div className="flex items-center gap-5">
            {/* The track and its fill. `scaleX` from a left origin, so the
                growth composites on the GPU rather than relaying out a width
                sixty times a second. */}
            <span className="relative block h-px flex-1 bg-line">
              <span
                data-intro-bar
                className="absolute inset-0 block origin-left scale-x-0 bg-paper"
              />
            </span>

            <span
              data-intro-count
              data-numeric
              className="shrink-0 text-meta uppercase text-secondary"
            >
              000
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
