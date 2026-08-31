"use client";

import { useEffect, useRef } from "react";

import { gsap, motionSafe } from "@/lib/gsap";

interface CounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** Locale-aware grouping for values in the thousands. */
  locale?: string;
}

/**
 * Counts a numeral up once, on entry.
 *
 * The number is the content, so it is exposed to assistive technology as its
 * final value immediately — the intermediate frames are decorative and hidden.
 * Numerals are tabular so the layout never reflows mid-count.
 */
export function Counter({
  value,
  prefix = "",
  suffix = "",
  className,
  locale = "en-GB",
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const formatted = new Intl.NumberFormat(locale).format(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return motionSafe(() => {
      const state = { n: 0 };
      const format = new Intl.NumberFormat(locale);

      // Server-rendered content is the final value, which is what a
      // reduced-motion or no-JS visitor keeps. Once we know we are going to
      // animate, reset to zero straight away so the count never jumps back.
      el.textContent = format.format(0);

      gsap.to(state, {
        n: value,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = format.format(Math.round(state.n));
        },
      });
    });
  }, [value, locale]);

  return (
    <span className={className} data-numeric>
      <span className="sr-only">{`${prefix}${formatted}${suffix}`}</span>
      <span aria-hidden="true">
        {prefix}
        <span ref={ref}>{formatted}</span>
        {suffix}
      </span>
    </span>
  );
}
