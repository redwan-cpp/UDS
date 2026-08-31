import Image from "next/image";

import type { MediaAsset } from "@/types/content";

type Ratio = "square" | "portrait" | "tall" | "landscape" | "wide" | "cinema" | "auto";

const RATIOS: Record<Ratio, string> = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  tall: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/9]",
  cinema: "aspect-[2/1]",
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

  return (
    <div className={`relative overflow-hidden bg-ink-soft ${RATIOS[ratio]} ${className}`}>
      <Image
        src={asset.src}
        alt={asset.alt}
        width={asset.width}
        height={asset.height}
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        style={{ objectPosition: focal }}
        {...(revealMedia ? { "data-reveal-media": "" } : {})}
        className={[
          "h-full w-full object-cover",
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
}: MediaProps) {
  return (
    <figure className={className}>
      <Media asset={asset} ratio={ratio} priority={priority} sizes={sizes} />
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
