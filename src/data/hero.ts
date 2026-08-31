/* =============================================================================
   DEMO CONTENT — hero motion asset

   The hero is built to take a video, and to be complete without one. The poster
   image is always rendered as a real optimised <Image>; the video, when present,
   plays over it and is skipped entirely under reduced motion or when autoplay is
   refused. That is why this export is allowed to be `undefined` — a missing
   video degrades to a still architectural photograph rather than to a hole.

   In Phase 2 this becomes a CMS-managed field on the homepage document.
   ============================================================================= */

import type { VideoAsset } from "@/types/content";

/**
 * Set to a VideoAsset to enable the moving hero. Left undefined while no
 * openly-licensed architectural footage of sufficient quality has been sourced —
 * a poor video is worse than a good photograph in the first viewport.
 */
export const heroVideo: VideoAsset | undefined = undefined;
