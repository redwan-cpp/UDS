/* =============================================================================
   DEMO CONTENT — hero motion asset

   The hero is built to take a video, and to be complete without one. The poster
   image is always rendered as a real optimised <Image>; the video, when present,
   plays over it and is skipped entirely under reduced motion or when autoplay is
   refused. That is why this export is allowed to be `undefined` — a missing
   video degrades to a still architectural photograph rather than to a hole.

   This clip was supplied directly rather than sourced from Wikimedia Commons, so
   it carries no `credit`/`source`/`licence` — those fields are for the Commons
   provenance chain (see public/media/CREDITS.json), not a catch-all attribution
   slot. It is a static-camera loop (the light moves, the camera does not), which
   made it straightforward to re-encode without losing anything the eye would
   notice: original was 16s at 4110×2160, HEVC, ~17.4 Mbps, with an unused audio
   track — 33MB. Re-encoded at 1920px wide, muted (the hero is always muted; see
   ruler.md), no benefit to carrying audio that never plays:
     - hero-loop.webm  (VP9)   ~1.9MB  — primary source
     - hero-loop.mp4   (H.264) ~2.2MB  — fallback for browsers without VP9
   Regenerate from the source with scripts/transcode-hero.mjs if the source clip
   changes.

   In Phase 2 this becomes a CMS-managed field on the homepage document.
   ============================================================================= */

import type { VideoAsset } from "@/types/content";

export const heroVideo: VideoAsset = {
  sources: [
    { src: "/media/hero-loop.webm", type: "video/webm" },
    { src: "/media/hero-loop.mp4", type: "video/mp4" },
  ],
  poster: {
    src: "/media/hero-loop-poster.jpg",
    alt: "Raking sunlight through a gridded window inside a concrete architectural interior",
    width: 2400,
    height: 1261,
    focal: { x: 0.62, y: 0.42 },
  },
};
