"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

import type { MediaAsset, VideoAsset } from "@/types/content";
import { prefersReducedMotion } from "@/lib/gsap";

/**
 * Full-bleed background video with a real static fallback.
 *
 * The poster image is rendered as an actual `<Image>` underneath rather than
 * relying on the `poster` attribute alone, so the first frame is a responsive,
 * correctly-sized, optimised image that is present with no JavaScript, no
 * video support, and under reduced motion — where the video never plays at all.
 *
 * Playback is suspended whenever the element leaves the viewport or the tab is
 * hidden, so a looping video never burns battery off-screen.
 */
/**
 * A visitor who has asked to save data, or whose connection the browser rates
 * as 2G, keeps the poster. The video is atmosphere, not content, and spending
 * two megabytes of someone's constrained connection on atmosphere is the wrong
 * trade. `navigator.connection` is Chromium-only; elsewhere this reads as
 * "no preference" and the video plays as before.
 */
function prefersLessData() {
  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  return Boolean(
    connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? ""),
  );
}

export function BackgroundVideo({
  poster,
  video,
  className = "",
}: {
  /** Always rendered. The video, when present, plays on top of it. */
  poster: MediaAsset;
  video?: VideoAsset;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion() || prefersLessData()) {
      el.pause();
      return;
    }

    // The video waits for the page, not the other way round. Starting playback
    // at mount began a ~2 MB download in the same breath as the fonts and the
    // first screen's images, on a server with no CDN in front of it. The poster
    // is already painted and is the video's own first frame, so waiting costs
    // nothing a visitor can see — `load`, or three seconds, whichever is first.
    let ready = document.readyState === "complete";
    let wanted = false;
    const play = () => {
      wanted = true;
      // Autoplay can be refused; the poster underneath is the fallback.
      if (ready) el.play().catch(() => {});
    };
    const release = () => {
      if (ready) return;
      ready = true;
      if (wanted) play();
    };
    window.addEventListener("load", release, { once: true });
    const cap = window.setTimeout(release, 3000);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else {
          wanted = false;
          el.pause();
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(el);

    const onVisibility = () => {
      if (document.hidden) el.pause();
      else if (el.getBoundingClientRect().bottom > 0) play();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      window.removeEventListener("load", release);
      window.clearTimeout(cap);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden bg-ink ${className}`}>
      <Image
        src={poster.src}
        alt={poster.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={
          poster.focal
            ? { objectPosition: `${poster.focal.x * 100}% ${poster.focal.y * 100}%` }
            : undefined
        }
      />

      {video && (
        // No `poster` attribute. The `<Image>` above already paints this exact
        // frame, optimised and sized; the attribute made the browser fetch the
        // raw 189 KB source file as well — measured on the live site as the
        // largest single request of the first load, and never cached.
        //
        // Transparent until the first frame is actually playing, so there is
        // no moment where an undecoded video box covers the poster. The poster
        // is the clip's own first frame, so the fade itself is invisible; it
        // only absorbs whatever flicker a decoder produces on its first frame.
        <video
          ref={ref}
          muted
          loop
          playsInline
          preload="metadata"
          onPlaying={(event) => {
            event.currentTarget.dataset.playing = "";
          }}
          aria-label={video.description}
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 data-[playing]:opacity-100 motion-reduce:hidden"
        >
          {video.sources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>
      )}
    </div>
  );
}
