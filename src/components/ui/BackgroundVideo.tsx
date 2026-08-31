"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

import type { MediaAsset, VideoAsset } from "@/types/content";

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

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.pause();
      return;
    }

    const play = () => {
      // Autoplay can be refused; the poster underneath is the fallback.
      el.play().catch(() => {});
    };

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? play() : el.pause()),
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
        <video
          ref={ref}
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster.src}
          aria-label={video.description}
          className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
        >
          <source src={video.src} type="video/webm" />
        </video>
      )}
    </div>
  );
}
