/* =============================================================================
   DEMO CONTENT
   Placeholder collaborators. These are NOT Uthan Design Studio's clients or
   partners, and no real organisation is named — inventing a client list is the
   most damaging kind of fabrication a studio site can carry.

   The marks are demo content in the same sense the photography is. Each one is
   a drawing convention for the discipline it sits beside — a truss for
   structure, contours for landscape, a hatched ground for the contractor — not
   an invented corporate identity, because there is no real company here to
   invent one for. A mark shipped as a real firm's logo would be a fabrication;
   an abstract discipline glyph against a fictional name is a placeholder doing
   the job of one, and it lets the row be designed before real assets exist.

   Replacing them is a one-line edit per entry: point `logo.src` at the supplied
   artwork. Marks are painted through a CSS mask (`.uds-mark`) so they take the
   surface's own colour, which means supplied artwork should be a monochrome SVG
   with the shape carried in its alpha — a full-colour logo will be flattened.

   One consumer: the homepage strip (`LogoStrip`, via `Numbers`).
   ============================================================================= */

import type { Brand } from "@/types/content";

/** Every mark is drawn on the same 48×40 field, so the row keeps one baseline. */
const mark = (file: string, alt: string) => ({
  src: `/brand/collaborators/${file}.svg`,
  alt,
  width: 48,
  height: 40,
});

export const brands: Brand[] = [
  {
    id: "b1",
    name: "Structural Engineering Partner",
    relationship: "Structure",
    logo: mark("structure", "Truss"),
    isDemo: true,
  },
  {
    id: "b2",
    name: "Environmental Consultant",
    relationship: "Services & energy",
    logo: mark("environment", "Air movement through an opening"),
    isDemo: true,
  },
  {
    id: "b3",
    name: "Landscape Practice",
    relationship: "Landscape",
    logo: mark("landscape", "Contour lines"),
    isDemo: true,
  },
  {
    id: "b4",
    name: "Lighting Designer",
    relationship: "Lighting",
    logo: mark("lighting", "A source and its throw"),
    isDemo: true,
  },
  {
    id: "b5",
    name: "Metal Fabricator",
    relationship: "Fabrication",
    logo: mark("fabrication", "Folded sheet"),
    isDemo: true,
  },
  {
    id: "b6",
    name: "Joinery Workshop",
    relationship: "Joinery",
    logo: mark("joinery", "Dovetail joint"),
    isDemo: true,
  },
  {
    id: "b7",
    name: "Quantity Surveyor",
    relationship: "Cost",
    logo: mark("cost", "Scale bar"),
    isDemo: true,
  },
  {
    id: "b8",
    name: "Principal Contractor",
    relationship: "Construction",
    logo: mark("construction", "Hatched ground"),
    isDemo: true,
  },
];
