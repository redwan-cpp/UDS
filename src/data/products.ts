/* =============================================================================
   DEMO CONTENT
   The two product lines are confirmed in the brief. The descriptions, materials
   and specifications below are ILLUSTRATIVE — written in the register a real
   capability spec would use (typical ranges, standard options) so the page
   reads as finished rather than as a form half-filled with "to be confirmed."
   None of it is a verified figure, a certified rating, or a quoted lead time.
   Anything presented as a specific regulatory rating or certification mark
   would be a false compliance claim, so ratings are described qualitatively
   ("fire-rated cores available") rather than cited by rating code. Replace
   wholesale once the studio supplies real capability data.
   ============================================================================= */

import type { Product, ProductCategory } from "@/types/content";

import { img, imgs } from "./media";

const products: Product[] = [
  {
    id: "doors",
    slug: "custom-doors",
    isDemo: true,
    title: "Custom Doors",
    category: "doors",
    summary: "Doors made to the opening, not to a catalogue.",
    description: [
      "A door is the part of a building people touch every day, and the one place where the difference between made and bought is immediately obvious in the hand.",
      "The studio designs and specifies doors for its own projects and for others: solid timber, veneered core, steel-framed glazed leaves, and pivot sets where the opening is too large for hinges to behave.",
      "Every leaf is drawn full size before it is made. Ironmongery is selected at the same time as the leaf rather than after it, so the handle height, the lock case and the reveal are one decision instead of three.",
    ],
    materials: [
      "Solid European oak",
      "Veneered engineered core",
      "Blackened mild steel",
      "Patinated brass ironmongery",
      "Acoustic and fire-rated cores",
    ],
    applications: [
      "Entrance doors",
      "Internal room doors",
      "Pivot doors over 1200mm",
      "Concealed and flush-to-wall leaves",
      "Acoustic and fire-rated openings",
    ],
    specs: [
      { label: "Maximum leaf", value: "Up to 1400 × 3000mm as standard; larger by engineering review" },
      { label: "Core options", value: "Solid stave, veneered engineered, or fire/acoustic-rated core" },
      { label: "Fire rating", value: "Fire-rated cores available; rating set per project at specification" },
      { label: "Acoustic rating", value: "Acoustic-rated cores available for high-performance openings" },
      { label: "Lead time", value: "Typically 10–14 weeks from approved drawings" },
    ],
    hero: img("product", 0, "Timber door leaf with a recessed pull"),
    gallery: imgs("product", [
      "Oak leaf with a flush pivot set",
      "Blackened steel frame at the head detail",
      "Brass pull at handle height",
    ]),
    order: 1,
  },
  {
    id: "sheet",
    slug: "fabricated-sheet-work",
    isDemo: true,
    title: "Fabricated Sheet Work",
    category: "metalwork",
    summary: "Folded, perforated and patinated metal, drawn as part of the building.",
    description: [
      "Sheet metal is where a lot of architecture is quietly decided: the soffit, the reveal, the balustrade infill, the screen that makes a facade read as one surface instead of a collection of openings.",
      "The studio produces fabrication drawings for these elements itself rather than delegating them, because the fold line and the fixing centres change how the finished piece looks far more than the material specification does.",
      "Work ranges from single balustrade panels to full facade screens, in mild steel, stainless, aluminium and copper, with mill, patinated, powder-coated and anodised finishes.",
    ],
    materials: [
      "Mild steel, blackened or powder-coated",
      "Stainless steel, brushed or bead-blasted",
      "Aluminium, mill or anodised",
      "Copper and brass, natural patina",
    ],
    applications: [
      "Facade screens and brise-soleil",
      "Balustrade infill panels",
      "Soffits and reveal linings",
      "Perforated ceiling systems",
      "Bespoke fixings and trims",
    ],
    specs: [
      { label: "Sheet gauges", value: "Mild steel 1.5–6mm; aluminium 2–8mm, set to span and application" },
      { label: "Maximum panel", value: "Up to 3000 × 1500mm per sheet; larger elements panelised on site" },
      { label: "Perforation patterns", value: "Standard round, slot and stud patterns, or bespoke to drawing" },
      { label: "Finishes", value: "Mill, blackened, powder-coated or anodised" },
      { label: "Lead time", value: "Typically 8–12 weeks from approved drawings" },
    ],
    hero: img("metal", 0, "Perforated metal facade panel in raking light"),
    gallery: imgs("metal", [
      "Perforation gradient across a facade screen",
      "Folded edge detail at a panel junction",
      "Patinated surface at close range",
    ]),
    order: 2,
  },
];

export function getProducts(): Product[] {
  return [...products].sort((a, b) => a.order - b.order);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductSlugs(): string[] {
  return products.map((p) => p.slug);
}

/* -------------------------------------------------------------------------- */
/* Filtering                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * The category filter set. Two lines and two categories is a thin filter, and
 * that is the honest state of it: the brief confirms exactly these two product
 * arms, and inventing a third to make the row look busier would be inventing a
 * capability the studio has not claimed. The machinery is the same as the
 * portfolio's, so a third line is one data entry and one label, not a feature.
 */
export const productFilters: { value: ProductCategory | "all"; label: string }[] =
  [
    { value: "all", label: "All" },
    { value: "doors", label: "Doors" },
    { value: "metalwork", label: "Metalwork" },
  ];

export function filterProducts(
  items: Product[],
  filter: ProductCategory | "all",
): Product[] {
  if (filter === "all") return items;
  return items.filter((p) => p.category === filter);
}

export function countProducts(filter: ProductCategory | "all"): number {
  return filterProducts(products, filter).length;
}

