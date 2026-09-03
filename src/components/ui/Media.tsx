"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import type { MediaAsset } from "@/types/content";

type Ratio =
  | "square"
  | "portrait"
  | "tall"
  | "landscape"
  | "wide"
  | "cinema"
  | "banner"
  | "auto";

const RATIOS: Record<Ratio, string> = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  tall: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/9]",
  cinema: "aspect-[2/1]",
  // The project banner. The only ratio that changes across breakpoints, and
  // for a reason: a fixed 3:1 is a banner on a laptop and a letterbox slot on
  // a phone, where it would be about 125px tall. It widens as the viewport
  // does, so the image stays a picture at every size while still leaving the
  // title and the facts visible beneath it on a desktop without scrolling.
  banner: "aspect-[4/3] sm:aspect-[16/9] lg:aspect-[5/2] 2xl:aspect-[3/1]",
  auto: "",
};

interface MediaProps {
  asset: MediaAsset;
  ratio?: Ratio;
  /** Only the hero and the first in-view image should be priority. */
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** Scale the image slightly on hover of the nearest `.group` ancestor. */
  hoverScale?: boolean;
  /** Marks the inner image for the curtain reveal's counter-scale. */
  revealMedia?: boolean;
}

/**
 * Every image on the site goes through here.
 *
 * Dimensions come from the asset, so aspect ratio is reserved before load and
 * layout shift is structurally prevented rather than tuned. The focal point is
 * honoured so art-directed crops do not slice the subject.
 */
export function Media({
  asset,
  ratio = "auto",
  priority = false,
  sizes = "(min-width: 1280px) 50vw, (min-width: 768px) 70vw, 100vw",
  className = "",
  hoverScale = false,
  revealMedia = false,
}: MediaProps) {
  const focal = asset.focal
    ? `${asset.focal.x * 100}% ${asset.focal.y * 100}%`
    : "center";

  // A scroll-triggered reveal fires on viewport position; a lazy image loads
  // on network time. Those two clocks have nothing to do with each other, so
  // without this an image can pop into an already-open, already-settled
  // frame well after its surrounding text has finished animating in — the
  // "images look slower than the text" bug. A `priority` image is exempt: it
  // is fetched eagerly specifically so it is ready before it needs to be
  // seen, and gating it behind post-hydration state would only risk hiding
  // it during that critical first paint for nothing.
  const [loaded, setLoaded] = useState(priority);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (priority) return;
    const img = imgRef.current;
    if (!img) return;

    let settled = false;
    const markLoaded = () => {
      if (settled) return;
      settled = true;
      setLoaded(true);
    };

    if (img.complete) {
      markLoaded();
      return;
    }

    // A native listener, not the `onLoad` prop: a cache-warm image can finish
    // decoding before React has attached anything, and by observation the
    // `load` event doesn't reliably reach a handler added after the fact
    // either. An image must never be able to stay invisible forever — the
    // same guarantee MotionFailsafe makes for the scroll-reveal system — so
    // this also polls `.complete` directly and gives up waiting outright
    // after a few seconds.
    img.addEventListener("load", markLoaded);
    img.addEventListener("error", markLoaded);
    const poll = window.setInterval(() => {
      if (img.complete) markLoaded();
    }, 150);
    const giveUp = window.setTimeout(markLoaded, 4000);

    return () => {
      img.removeEventListener("load", markLoaded);
      img.removeEventListener("error", markLoaded);
      window.clearInterval(poll);
      window.clearTimeout(giveUp);
    };
  }, [priority]);

  return (
    <div className={`relative overflow-hidden bg-ink-soft ${RATIOS[ratio]} ${className}`}>
      <Image
        ref={imgRef}
        src={asset.src}
        alt={asset.alt}
        width={asset.width}
        height={asset.height}
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        style={{ objectPosition: focal }}
        {...(revealMedia ? { "data-reveal-media": "" } : {})}
        {...(!priority && !loaded ? { "data-media-loading": "" } : {})}
        className={[
          "h-full w-full object-cover transition-opacity duration-[var(--dur-slow)] ease-out-soft motion-reduce:transition-none",
          // `.hover-zoom` gates the effect behind a fine pointer, promotes the
          // layer only while hovering, and drops back to `will-change: auto`
          // the moment the pointer leaves.
          hoverScale ? "hover-zoom" : "",
        ].join(" ")}
      />
    </div>
  );
}

/**
 * Image with its caption and credit. Used in project galleries and anywhere the
 * provenance of a photograph should be visible rather than buried in source.
 */
export function Figure({
  asset,
  ratio = "auto",
  priority,
  sizes,
  className = "",
  hoverScale,
  revealMedia,
}: MediaProps) {
  return (
    <figure className={className}>
      <Media
        asset={asset}
        ratio={ratio}
        priority={priority}
        sizes={sizes}
        hoverScale={hoverScale}
        revealMedia={revealMedia}
      />
      {(asset.caption || asset.credit) && (
        <figcaption className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-caption text-secondary">
          {asset.caption && <span>{asset.caption}</span>}
          {asset.credit && (
            <span className="opacity-70">
              {asset.credit}
              {asset.licence ? ` · ${asset.licence}` : ""}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
