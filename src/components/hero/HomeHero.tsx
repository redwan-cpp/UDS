"use client";

import { useEffect, useRef } from "react";

import { BackgroundVideo } from "@/components/ui/BackgroundVideo";
import { Container } from "@/components/ui/Container";
import { gsap, motionSafe } from "@/lib/gsap";
import type { MediaAsset, VideoAsset } from "@/types/content";

interface HomeHeroProps {
  poster: MediaAsset;
  video?: VideoAsset;
  services: string[];
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
export function HomeHero({ poster, video, services }: HomeHeroProps) {
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
          Text sits at the top and bottom of this viewport; the middle of the
          image stays close to untouched so the video still reads as the
          subject, not as a backdrop drowned in a flat wash.

          The bottom band was originally h-1/2 fading to fully transparent at
          its own top edge — but the heading sits in the UPPER half of that
          band, exactly where the fade was weakest, and this video's bright
          window fills a large fraction of the frame right behind it. The band
          is now taller and holds real darkness (82%) through most of its own
          height rather than fading out early, via explicit stop positions
          (from-0%/via-60%) rather than Tailwind's default 50% via-stop. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-ink/90 from-0% via-ink/60 via-60% to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-ink/95 from-0% via-ink/82 via-60% to-transparent"
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
        {/* Top row. The numbered discipline index that used to sit here is
            gone: it said the same thing as the service list on the baseline
            rule below, twice, and it crowded the top of the frame the video
            is the subject of. */}
        <div className="flex flex-wrap items-start justify-end gap-6">
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
                {/* Was text-paper/70 — fragile against a video backdrop whose
                    brightness varies as it loops, unlike the single still photo
                    this was originally tuned against. Full opacity is what
                    actually holds up; the hierarchy against "Uthan" now comes
                    from position and the rule above it, not from transparency. */}
                <span className="block text-paper">Design Studio</span>
              </span>
            </span>
          </h1>

          {/* The baseline rule carries the service lines on the left and the
              scroll affordance on the right. The word "Scroll" is now the
              arrow itself — at this size the glyph is the clearer instruction
              of the two, and it leaves the row to the services. */}
          <div className="mt-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-t border-paper/20 pt-6">
            <ul className="flex flex-wrap gap-x-5 gap-y-1.5 sm:gap-x-8">
              {services.map((service) => (
                <li
                  key={service}
                  data-hero-meta
                  className="text-meta uppercase text-paper/90"
                >
                  {service}
                </li>
              ))}
            </ul>

            <a
              data-hero-meta
              href="#about"
              aria-label="Scroll to the next section"
              className="group/scroll -m-2 flex min-h-11 min-w-11 items-center justify-center p-2 text-paper/90 transition-colors hover:text-pistachio"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 34"
                fill="none"
                className="h-[34px] w-6 overflow-visible"
              >
                <path
                  d="M12 0V32"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  className="origin-top transition-transform duration-[var(--dur-slow)] ease-out-soft group-hover/scroll:scale-y-110 motion-reduce:transition-none"
                />
                <path
                  d="M3.5 23.5L12 32.5L20.5 23.5"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  className="transition-transform duration-[var(--dur-slow)] ease-out-soft group-hover/scroll:translate-y-1 motion-reduce:transition-none"
                />
              </svg>
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
