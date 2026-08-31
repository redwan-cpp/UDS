/* =============================================================================
   DEMO CONTENT
   The themes below are PLACEHOLDERS. Uthan Design Studio has not supplied its
   sustainability practice.

   Note on wording: the `measures` arrays are deliberately empty. A specific
   claim — a percentage, a certification, an embodied-carbon figure — is exactly
   the kind of statement that must never be invented, and an empty list renders
   as an honest "to be confirmed" rather than as plausible greenwashing.
   ============================================================================= */

import type { SustainabilityPrinciple } from "@/types/content";

import { img } from "./media";

export const sustainability: SustainabilityPrinciple[] = [
  {
    id: "material",
    index: "01",
    title: "Material responsibility",
    description:
      "What a building is made of is decided early and is expensive to revisit. Material choices are set against embodied impact, provenance and repairability at concept stage, not at specification stage.",
    measures: [],
    image: img("detail", 0, "Close view of a raw concrete and timber junction"),
    isDemo: true,
  },
  {
    id: "passive",
    index: "02",
    title: "Passive design",
    description:
      "Orientation, mass, aperture and shading do most of the work before any system is specified. A building that stays comfortable without help is the cheapest one to run and the easiest one to maintain.",
    measures: [],
    image: img("sustain", 0, "Deep window reveal shading an interior"),
    isDemo: true,
  },
  {
    id: "context",
    index: "03",
    title: "Local context",
    description:
      "Climate, labour, supply chain and building culture differ by region, and a detail that performs in one place can fail in another. Specification follows what can actually be built and maintained locally.",
    measures: [],
    isDemo: true,
  },
  {
    id: "energy",
    index: "04",
    title: "Energy",
    description:
      "Demand is reduced before supply is designed. Fabric performance, airtightness and thermal bridging are resolved in the drawings rather than corrected by plant.",
    measures: [],
    isDemo: true,
  },
  {
    id: "water",
    index: "05",
    title: "Water",
    description:
      "Rainwater, greywater and surface run-off are treated as part of the landscape design rather than as a drainage afterthought.",
    measures: [],
    isDemo: true,
  },
  {
    id: "reuse",
    index: "06",
    title: "Adaptive reuse",
    description:
      "The most sustainable structure is usually the one already standing. Existing fabric is surveyed and tested for reuse before demolition is considered.",
    measures: [],
    image: img("about", 0, "Retained industrial structure inside a converted building"),
    isDemo: true,
  },
  {
    id: "construction",
    index: "07",
    title: "Responsible construction",
    description:
      "Waste, noise, dust and site working conditions are a design responsibility. Prefabrication and dry construction are used where they measurably reduce site impact.",
    measures: [],
    isDemo: true,
  },
  {
    id: "longevity",
    index: "08",
    title: "Long-term thinking",
    description:
      "Buildings outlive their briefs. Structure, servicing and finishes are separated so that each can be changed on its own timescale without dismantling the others.",
    measures: [],
    isDemo: true,
  },
];

export function getSustainabilityPrinciples(): SustainabilityPrinciple[] {
  return sustainability;
}
