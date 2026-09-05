/* =============================================================================
   DEMO CONTENT
   Placeholder collaborators. These are NOT Uthan Design Studio's clients or
   partners, and no real organisation is named — inventing a client list is the
   most damaging kind of fabrication a studio site can carry.

   Logos are deliberately absent: shipping a real company's mark as false proof
   of a relationship is misleading, and a made-up mark is worthless. Each name
   is therefore set in type, which is how architecture practices usually list
   collaborators anyway.

   One consumer remains: the homepage marquee (`LogoMarquee`, via `Numbers`).
   The `BrandIndex` list and the Collaborators section that held it are gone.
   ============================================================================= */

import type { Brand } from "@/types/content";

export const brands: Brand[] = [
  { id: "b1", name: "Structural Engineering Partner", relationship: "Structure", isDemo: true },
  { id: "b2", name: "Environmental Consultant", relationship: "Services & energy", isDemo: true },
  { id: "b3", name: "Landscape Practice", relationship: "Landscape", isDemo: true },
  { id: "b4", name: "Lighting Designer", relationship: "Lighting", isDemo: true },
  { id: "b5", name: "Metal Fabricator", relationship: "Fabrication", isDemo: true },
  { id: "b6", name: "Joinery Workshop", relationship: "Joinery", isDemo: true },
  { id: "b7", name: "Quantity Surveyor", relationship: "Cost", isDemo: true },
  { id: "b8", name: "Principal Contractor", relationship: "Construction", isDemo: true },
];
