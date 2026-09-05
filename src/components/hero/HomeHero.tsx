"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

import { BackgroundVideo } from "@/components/ui/BackgroundVideo";
import { Container } from "@/components/ui/Container";
import { gsap, motionSafe } from "@/lib/gsap";
import type { MediaAsset, VideoAsset } from "@/types/content";

interface HomeHeroProps {
  poster: MediaAsset;
  video?: VideoAsset;
  services: { label: string; href: string }[];
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

      <Container className="relative flex min-h-dvh flex-col justify-end pt-32 pb-10 md:pt-40 md:pb-12">
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

          {/* The baseline rule carries the service lines. It also held a scroll
              arrow on the right, which is gone at the studio's request — and it
              was doing less than it looked like it was: the hero is under a
              full viewport tall, so the next section is already cresting the
              fold on most screens, and an arrow telling someone to scroll a
              page they are visibly already able to scroll is decoration with an
              instruction painted on it. The row is the services' now. */}
          <div className="mt-8 flex flex-wrap items-end gap-x-6 gap-y-4 border-t border-paper/20 pt-6">
            {/* Each service line goes to the work that shows it — the
                destinations live in `studio.services`, since which work
                stands for which service is a content decision. They were
                plain text until the studio asked for them to be links, and
                they were the only thing in the hero naming what the studio
                does with no way to act on it. Styled as index links, not
                buttons: the rule wipes in from the left on hover, the same
                gesture the nav and the project index already use. */}
            <ul className="flex flex-wrap gap-x-5 gap-y-1.5 sm:gap-x-8">
              {services.map((service) => (
                <li key={service.href} data-hero-meta>
                  <Link
                    href={service.href}
                    className="group/service relative inline-flex py-1 text-meta uppercase text-paper/90 transition-colors duration-[var(--dur-fast)] hover:text-accent"
                  >
                    {service.label}
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-0.5 left-0 block h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-[var(--dur-base)] ease-out-soft group-hover/service:scale-x-100 group-focus-visible/service:scale-x-100 motion-reduce:transition-none"
                    />
                  </Link>
                </li>
              ))}
            </ul>

          </div>
        </div>
      </Container>
    </div>
  );
}
