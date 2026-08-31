/* =============================================================================
   MEDIA CURATION — hand-authored, reviewed on a contact sheet.

   Sourcing is automated (scripts/fetch-*.mjs). Curation is not. Every asset in
   the library was looked at before it was assigned, and roughly two-thirds of
   what was downloaded was deleted rather than used — a search API returns what
   matches the words, not what suits the work.

   Each set below is an ordered list of asset ids. `img(set, index, alt)`
   resolves against these, so content files ask for a *role* ("a project hero",
   "a drawing") and get the right frame, rather than indexing blindly into
   whatever a filename prefix happened to contain.

   ALL OF IT IS DEMO CONTENT and will be replaced by the studio's own
   photography. The known limitation of the current library is its size: 26
   assets is not enough to give forty slots a distinct image, so the strongest
   frames are assigned to the most prominent positions and repetition is
   accepted further down. That is a deliberate ordering of quality, not an
   oversight — see the Phase 1 report.
   ============================================================================= */

import type { AssetId } from "./media.generated";

export const SETS = {
  /** The homepage hero. One frame, and it has to carry the whole first
   *  viewport: raking light, strong geometry, near-monochrome. */
  hero: ["hero-01"],

  /** The About band — an interior with depth and a strong curve or rise.
   *  Index 1 (the homepage About image) was a bright white museum ramp that
   *  read as a mismatch against the hero's raw concrete — swapped for a
   *  stone spiral stair, shot straight down its own void. CC BY 3.0, credit
   *  rendered on-page via <Figure> rather than the bare <Media> the rest of
   *  this set uses, since attribution is a term of the licence, not optional
   *  decoration — see AboutStatement.tsx. */
  about: ["interior-03", "about-stair", "about-03"],

  /** Nine expertise areas. Deliberately varied so the hover panel changes
   *  materially between rows rather than shuffling near-identical frames. */
  expertise: [
    "hero-02",
    "pool/elem-02",
    "expertise-04",
    "pool/arch-01",
    "interior-02",
    "project-01",
    "detail-01",
    "pool/int-03",
    "about-03",
  ],

  /** Project heroes. The six most distinct frames in the library, because a
   *  project page opens on one of these at full bleed. */
  project: [
    "hero-01",
    "hero-02",
    "pool/arch-01",
    "pool/elem-02",
    "project-01",
    "interior-02",
  ],

  /** Interior plates for project galleries. */
  interior: [
    "interior-02",
    "interior-03",
    "about-03",
    "pool/int-03",
    "pool/elem-02",
    "expertise-04",
  ],

  /** Material and texture at close range. */
  detail: ["detail-01", "detail-02", "project-01", "project-02"],

  /** Exterior and context. */
  urban: ["pool/arch-01", "hero-02", "expertise-04"],

  /** Drawings. The most coherent set in the library, and the right register for
   *  the rough-work sections — these are working documents, not finished
   *  plates, and they are presented at a smaller scale to say so. */
  process: [
    "process-02",
    "process-05",
    "process-06",
    "process-07",
    "process-04",
    "project-09",
    "process-01",
    "process-03",
    "project-06",
    "sustain-01",
  ],

  /** Custom doors. */
  product: ["pool/door-01", "pool/door-02", "detail-02"],

  /** Fabricated sheet work — weathered metal and folded plate. */
  metal: ["detail-02", "project-04", "detail-01"],

  /** Collaboration and news. */
  news: [
    "pool/elem-02",
    "pool/arch-01",
    "interior-02",
    "expertise-04",
    "pool/int-03",
    "about-03",
  ],

  /** Sustainability — material, planting, daylight. */
  sustain: ["pool/elem-02", "pool/int-03", "detail-01"],
} as const satisfies Record<string, readonly AssetId[]>;

export type MediaSet = keyof typeof SETS;
