"use client";

import { Fragment, useEffect, useRef, type ElementType } from "react";

import { gsap, motionSafe } from "@/lib/gsap";

interface RevealTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
  delay?: number;
  stagger?: number;
  start?: string;
  /** Skip ScrollTrigger and play immediately — for above-the-fold headings. */
  immediate?: boolean;
}

/**
 * Word-by-word heading reveal.
 *
 * Accessibility contract: the unsplit string is exposed as the accessible name
 * through a visually-hidden span, and the split fragments are `aria-hidden`. A
 * screen reader hears one heading, not a stack of words. The split markup is
 * server-rendered, so the heading is present and readable with no JavaScript —
 * the animation only changes how it arrives.
 */
export function RevealText({
  text,
  as: Tag = "h2",
  className,
  id,
  delay = 0,
  stagger = 0.05,
  start = "top 88%",
  immediate = false,
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(" ").filter(Boolean);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return motionSafe(() => {
      const targets = el.querySelectorAll("[data-word]");
      if (!targets.length) return;

      gsap.fromTo(
        targets,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1,
          ease: "power3.out",
          stagger,
          delay,
          overwrite: "auto",
          onComplete: () => el.setAttribute("data-revealed", ""),
          ...(immediate
            ? {}
            : { scrollTrigger: { trigger: el, start, once: true } }),
        },
      );
    });
  }, [delay, stagger, start, immediate]);

  return (
    <Tag ref={ref} id={id} className={className} data-reveal-words>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            <span className="word-mask">
              <span data-word>{word}</span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
