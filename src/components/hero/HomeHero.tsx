"use client";

import { useEffect, useRef } from "react";

import { BackgroundVideo } from "@/components/ui/BackgroundVideo";
import { Container } from "@/components/ui/Container";
import { gsap, motionSafe } from "@/lib/gsap";
import type { MediaAsset, VideoAsset } from "@/types/content";

interface HomeHeroProps {
  poster: MediaAsset;
  video?: VideoAsset;
  disciplines: string[];
  tagline: string;
}

/**
 * The first viewport.
 *
 * Composition: the name is set at display scale on the baseline, bottom-left,
 * against full-bleed architecture. A drawn grid of hairlines sits over the
 * image — the reference is a drawing sheet laid over a photograph, which is
 * what the studio actually does. Nothing is centred; the type sits on the
 * grid's left column and the metadata answers it on the right.
 *
 * Everything here is readable before the animation runs. The intro sequence
 * signals `uds:ready`, and the hero waits for it so the two moves read as one
 * continuous sequence instead of competing.
 */
export function HomeHero({ poster, video, disciplines, tagline }: HomeHeroProps) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    let cleanup: (() => void) | undefined;

    const run = () => {
      cleanup = motionSafe(() => {
        const media = el.querySelector<HTMLElement>("[data-hero-media]");
        const tl = gsap.timeline({
          onComplete: () => gsap.set(media, { willChange: "auto" }),
        });
        gsap.set(media, { willChange: "transform" });

        tl.fromTo(
          el.querySelectorAll("[data-hero-line] > span"),
          { yPercent: 108 },
          { yPercent: 0, duration: 1.1, ease: "power3.out", stagger: 0.08 },
        )
          .fromTo(
            el.querySelectorAll("[data-hero-rule]"),
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.1,
              ease: "power2.inOut",
              stagger: 0.06,
              transformOrigin: "left center",
            },
            0.15,
          )
          .fromTo(
            el.querySelectorAll("[data-hero-meta]"),
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.06 },
            0.5,
          )
          // The image settles back from a slight push-in as the type lands.
          .fromTo(
            media,
            { scale: 1.06 },
            { scale: 1, duration: 1.6, ease: "power2.out" },
            0,
          );
      });
    };

    // If the intro is running, wait for it; otherwise start now.
    if (document.documentElement.classList.contains("js-intro")) {
      window.addEventListener("uds:ready", run, { once: true });
    } else {
      run();
    }

    return () => {
      window.removeEventListener("uds:ready", run);
      cleanup?.();
    };
  }, []);

  return (
    <div ref={root} className="surface-dark relative isolate min-h-dvh overflow-hidden bg-ink">
      <div data-hero-media className="absolute inset-0">
        <BackgroundVideo poster={poster} video={video} />
      </div>

      {/* Legibility scrims, in two bands rather than one flat wash.
          Text sits at the top and bottom of this viewport and the photograph
          is bright concrete, so each band is darkened enough to carry type
          while the middle of the image stays close to untouched. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-ink/85 via-ink/45 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/92 via-ink/55 to-transparent"
      />

      {/* The drawing grid. Purely structural, and very quiet. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden md:block"
      >
        <Container className="relative h-full">
          <div className="grid h-full grid-cols-12">
            {Array.from({ length: 11 }).map((_, i) => (
              <div key={i} className="border-r border-paper/6" />
            ))}
          </div>
        </Container>
      </div>

      <Container className="relative flex min-h-dvh flex-col justify-between pt-32 pb-10 md:pt-40 md:pb-12">
        {/* Top row: the studio's disciplines, as an index. */}
        <div className="flex flex-wrap items-start justify-between gap-6">
          <ul className="flex flex-wrap gap-x-5 gap-y-1.5 sm:gap-x-6">
            {disciplines.map((discipline, i) => (
              <li
                key={discipline}
                data-hero-meta
                className="flex items-baseline gap-2 text-meta uppercase text-paper/90"
              >
                <span data-numeric className="text-pistachio">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {discipline}
              </li>
            ))}
          </ul>
          <p
            data-hero-meta
            className="hidden max-w-[26ch] text-meta uppercase text-paper/80 lg:block"
          >
            An architecture and design practice
          </p>
        </div>

        {/* The name, on the baseline. */}
        <div className="mt-auto">
          <span
            data-hero-rule
            className="mb-8 block h-px w-full origin-left bg-paper/20"
          />

          <h1 className="text-display text-paper">
            <span className="sr-only">Uthan Design Studio</span>
            <span aria-hidden="true" className="block">
              <span data-hero-line className="block overflow-hidden">
                <span className="block">Uthan</span>
              </span>
              <span data-hero-line className="block overflow-hidden">
                <span className="block text-paper/70">Design Studio</span>
              </span>
            </span>
          </h1>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-paper/20 pt-6">
            <p data-hero-meta className="text-meta uppercase text-pistachio">
              {tagline}
            </p>

            <a
              data-hero-meta
              href="#about"
              className="group/scroll flex items-center gap-3 text-meta uppercase text-paper/90 transition-colors hover:text-pistachio"
            >
              Scroll
              <span
                aria-hidden="true"
                className="block h-8 w-px bg-current transition-transform duration-[var(--dur-base)] ease-out-soft group-hover/scroll:translate-y-1 motion-reduce:transition-none"
              />
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
