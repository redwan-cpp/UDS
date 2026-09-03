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

  /**
   * The About band — an interior with depth and a strong curve or rise.
   *
   * Index 1 (the homepage About image) was a bright white museum ramp that
   * read as a mismatch against the hero's raw concrete — swapped for a stone
   * spiral stair, shot straight down its own void. CC BY 3.0, credit rendered
   * on-page via <Figure> rather than the bare <Media> the rest of this set
   * uses, since attribution is a term of the licence, not optional decoration
   * — see AboutStatement.tsx.
   *
   * Index 0 (the sustainability plate) was the Guggenheim, which was both a
   * recognisable landmark and a poor match for the alt text describing it.
   */
  about: ["pool/int-17", "about-stair", "about-03"],

  /** Nine expertise areas. Deliberately varied so the hover panel changes
   *  materially between rows rather than shuffling near-identical frames. */
  expertise: [
    "hero-02",
    "pool/elem-02",
    "expertise-04",
    "pool/arch-01",
    "pool/int-12",
    "pool/elem-08",
    "detail-01",
    "pool/int-03",
    "about-03",
  ],

  /**
   * Project heroes, ordered to match the six case studies rather than simply
   * being the six most distinct frames. A card that shows a lattice canopy
   * above a project called Market Canopy is doing work; a card that shows a
   * zoo house above it is noise the reader has to ignore.
   *
   * The HABS zoo series (`project-01/02/04`) is gone from every slot a reader
   * meets first. Those frames carry visible building signage and an archive
   * stamp — both of which read, correctly, as "this is not your building".
   * The Guggenheim (`interior-02`) is out of this set for the same reason it
   * left the About band: it is a landmark people recognise, so it reads as a
   * borrowed credential.
   */
  project: [
    "hero-01", // Courtyard House — board-marked concrete mass
    "pool/elem-08", // Warehouse Conversion — a stair, and raking light
    "pool/int-13", // Hillside Pavilions — a low pavilion against water
    "pool/int-12", // Civic Reading Rooms — a civic hall under glass
    "pool/elem-06", // Market Canopy — a lattice canopy over open floor
    // Apartment in Section — an opening cut straight down through the floors,
    // which is the project. `pool/int-02` sat here first and was wrong: a
    // gilded palace stair hall under a project about one cut in a floor of a
    // terraced house. It reads as somebody else's building, which is exactly
    // the failure this whole set was re-curated to fix. Shared with the About
    // band; the library is thin enough that one reuse beats one mismatch.
    "about-stair",
  ],

  /**
   * Interior plates for project galleries.
   *
   * `interior-02` and `interior-03` are both the Guggenheim. They were pulled
   * from the project cards for being a landmark people recognise — which makes
   * them read as a borrowed credential — and the same objection applies here:
   * a case-study gallery is exactly where a reader is looking closely enough
   * to notice whose building it is.
   */
  interior: [
    "pool/int-02",
    "pool/int-13",
    "about-03",
    "pool/int-03",
    "pool/int-17",
    "pool/int-12",
  ],

  /** Material and texture at close range. */
  detail: ["detail-01", "detail-02", "pool/int-17", "pool/elem-08"],

  /** Exterior and context. */
  urban: ["pool/arch-18", "pool/arch-05", "pool/arch-19"],

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
  metal: ["detail-02", "pool/elem-06", "detail-01"],

  /** Collaboration and news. */
  news: [
    "pool/elem-02",
    "pool/arch-01",
    "pool/int-17",
    "expertise-04",
    "pool/int-03",
    "about-03",
  ],

  /** Sustainability — material, planting, daylight. */
  sustain: ["pool/elem-02", "pool/int-03", "detail-01"],
} as const satisfies Record<string, readonly AssetId[]>;

export type MediaSet = keyof typeof SETS;
