/* =============================================================================
   DEMO CONTENT — media accessor

   Content files never hard-code an image path. They ask for a curated SET and
   an index, and get a typed MediaAsset back with real dimensions and provenance.

   Why the indirection: alt text stays authored per USE (the same photograph
   needs different alt text in a gallery than on a card), the assignment of
   asset-to-role stays reviewable in one file, and when the CMS lands in Phase 2
   these call sites swap to real assets without any content file changing shape.
   ============================================================================= */

import type { MediaAsset } from "@/types/content";

import { LIBRARY, type RawAsset } from "./media.generated";
import { SETS, type MediaSet } from "./media.curation";

/** Rendered when a set is empty — visible, so a missing asset is never silent. */
const MISSING: RawAsset = {
  src: "/media/placeholder.svg",
  width: 1600,
  height: 1200,
  credit: null,
  licence: null,
  source: null,
};

interface ImgOptions {
  caption?: string;
  focal?: { x: number; y: number };
}

function resolve(set: MediaSet, index: number): RawAsset {
  const ids = SETS[set];
  if (!ids?.length) return MISSING;
  // The index wraps, so a layout asking for six frames from a set holding four
  // renders six images rather than four images and two holes. Demo libraries
  // change size; layouts must not break when they do.
  const id = ids[((index % ids.length) + ids.length) % ids.length];
  return LIBRARY[id] ?? MISSING;
}

/** Fetch the nth asset from a curated set. */
export function img(
  set: MediaSet,
  index: number,
  alt: string,
  options: ImgOptions = {},
): MediaAsset {
  const raw = resolve(set, index);

  return {
    src: raw.src,
    alt,
    width: raw.width,
    height: raw.height,
    caption: options.caption,
    credit: raw.credit ?? undefined,
    source: raw.source ?? undefined,
    licence: raw.licence ?? undefined,
    focal: options.focal,
  };
}

/**
 * A run of assets from a set, each with its own alt text.
 * `alts.length` decides the count, so the caller controls the gallery length.
 */
export function imgs(set: MediaSet, alts: string[], offset = 0): MediaAsset[] {
  return alts.map((alt, i) => img(set, offset + i, alt));
}
