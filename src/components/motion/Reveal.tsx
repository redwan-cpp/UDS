"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

import { gsap, motionSafe, DUR } from "@/lib/gsap";

type RevealVariant = "rise" | "fade" | "curtain" | "rule";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  /** Stagger children instead of animating the wrapper. Use for lists. */
  stagger?: number;
  /** Viewport position that triggers the reveal. */
  start?: string;
  className?: string;
}

/**
 * Declarative ScrollTrigger reveal.
 *
 * The contract (design.md §6): markup renders in its FINAL state. The hidden
 * start is applied by CSS only under `html.js-motion`, a class the boot script
 * adds solely when JavaScript runs and reduced motion is off. So a JS failure or
 * a reduced-motion preference leaves the page complete and readable, rather than
 * blank — the common failure mode of scroll-reveal libraries.
 *
 * Every variant animates `transform` and `opacity` only, so the whole system
 * stays on the compositor. The `curtain` variant in particular used to animate
 * `clip-path`, which is a paint-level property: on full-bleed photography that
 * meant repainting a viewport-sized image every frame. It is now a mask made of
 * two counter-moving transforms, which looks identical and composites.
 *
 * - `rise`    text and blocks lifting into place
 * - `fade`    opacity only, for elements whose position already reads
 * - `curtain` a frame opening upward over a photograph that lags behind it
 * - `rule`    a hairline drawing from the left
 */
export function Reveal({
  children,
  as: Tag = "div",
  variant = "rise",
  delay = 0,
  duration,
  stagger,
  start = "top 85%",
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return motionSafe(() => {
      // Stamping `data-revealed` tells MotionFailsafe this one finished on its
      // own, and lets the armed CSS release the element. Promotion is only
      // worth its memory while the element is actually moving, so anything this
      // reveal promoted is handed back at the same moment.
      const done = (promoted: Element[] = []) => {
        el.setAttribute("data-revealed", "");
        if (promoted.length) gsap.set(promoted, { willChange: "auto" });
      };

      const trigger = { trigger: el, start, once: true } as const;

      if (variant === "curtain") {
        const inner = el.querySelector<HTMLElement>("[data-curtain-inner]");
        const held = inner?.firstElementChild as HTMLElement | null;
        const media = el.querySelector<HTMLElement>("[data-reveal-media]");
        if (!inner || !held) return;

        const d = duration ?? DUR.reveal;
        const tl = gsap.timeline({
          scrollTrigger: trigger,
          delay,
          // Promote when the reveal actually starts, not at mount. Setting it
          // up front left every curtain on the page holding its own compositor
          // layer from first paint until the moment it scrolled into view.
          onStart: () => gsap.set([inner, held], { willChange: "transform" }),
          onComplete: () => done([inner, held]),
        });

        // Frame and content move at different rates. Their offsets net to a
        // full 100% at the start — the content sits entirely below the clip
        // window — and to 0 at the end. The 20% difference is the parallax.
        // Equal-and-opposite offsets would cancel and reveal nothing.
        tl.fromTo(
          inner,
          { yPercent: 120 },
          { yPercent: 0, duration: d, ease: "power3.out" },
          0,
        )
          .fromTo(
            held,
            { yPercent: -20 },
            { yPercent: 0, duration: d, ease: "power3.out" },
            0,
          )
          .fromTo(
            media ?? held,
            { scale: 1.06 },
            { scale: 1, duration: d * 1.25, ease: "power2.out" },
            0,
          );
        return;
      }

      const targets: Element[] = stagger ? Array.from(el.children) : [el];
      if (targets.length === 0) return;

      if (variant === "rule") {
        gsap.fromTo(
          targets,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left center",
            duration: duration ?? DUR.cinematic,
            ease: "power3.out",
            scrollTrigger: trigger,
            delay,
            stagger: stagger ?? 0,
            overwrite: "auto",
            onComplete: () => done(),
          },
        );
        return;
      }

      gsap.fromTo(
        targets,
        { opacity: 0, y: variant === "rise" ? 24 : 0 },
        {
          opacity: 1,
          y: 0,
          duration: duration ?? 0.7,
          ease: "power3.out",
          scrollTrigger: trigger,
          delay,
          stagger: stagger ?? 0,
          overwrite: "auto",
          onComplete: () => done(),
        },
      );
    });
  }, [variant, delay, duration, stagger, start]);

  if (variant === "curtain") {
    return (
      <Tag ref={ref} className={className} data-reveal-curtain>
        <div data-curtain-inner>{children}</div>
      </Tag>
    );
  }

  // When staggering, the wrapper itself must NEVER be marked `data-reveal` —
  // only `data-reveal-children`. Marking both (the previous behaviour) held
  // the wrapper at `opacity:0` via CSS for the entire staggered animation,
  // since nothing ever set the wrapper's own inline opacity; only its children
  // were tweened. The whole group was invisible until `data-revealed` landed
  // on completion, at which point the wrapper's CSS-driven opacity snapped
  // from 0 to 1 in a single frame — every child appearing at once, already
  // fully in place. That is the "pops from nothing" bug: it looked identical
  // whether the stagger was 50ms or 2s, because none of it was ever visible.
  const dataAttr = stagger
    ? { "data-reveal-children": "" }
    : variant === "rule"
      ? { "data-reveal-rule": "" }
      : { "data-reveal": "" };

  return (
    <Tag ref={ref} className={className} {...dataAttr}>
      {children}
    </Tag>
  );
}
