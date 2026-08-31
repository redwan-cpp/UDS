/* =============================================================================
   DEMO CONTENT
   These nine categories are PLACEHOLDERS. Uthan Design Studio has not confirmed
   which disciplines it offers. Do not present this list as the studio's actual
   service range — see memory.md, Outstanding decisions.
   ============================================================================= */

import type { ExpertiseArea } from "@/types/content";

import { img } from "./media";

export const expertise: ExpertiseArea[] = [
  {
    id: "architecture",
    index: "01",
    title: "Architecture",
    description:
      "New-build and adaptive projects developed from site, structure and light — carried from first sketch through to construction.",
    image: img("expertise", 0, "White modernist elevation against an overcast sky"),
    isDemo: true,
  },
  {
    id: "interior",
    index: "02",
    title: "Interior Design",
    description:
      "Interiors treated as architecture at close range: joinery, surface, acoustics and the way a room is entered.",
    image: img("expertise", 1, "Glazed atrium with planting under a steel roof"),
    isDemo: true,
  },
  {
    id: "urban",
    index: "03",
    title: "Urban Design",
    description:
      "Masterplanning and public-realm work concerned with movement, threshold and the space between buildings.",
    image: img("expertise", 2, "Glass entrance hall opening onto a public forecourt"),
    isDemo: true,
  },
  {
    id: "landscape",
    index: "04",
    title: "Landscape",
    description:
      "Ground, planting and water designed with the building rather than around it, and detailed to age well.",
    image: img("expertise", 3, "Long low building reflected in still water at dusk"),
    isDemo: true,
  },
  {
    id: "commercial",
    index: "05",
    title: "Commercial",
    description:
      "Workplace, retail and mixed-use projects where operational logic and architectural intent have to hold together.",
    image: img("expertise", 4, "Spiralling gallery ramp seen from the ground floor"),
    isDemo: true,
  },
  {
    id: "residential",
    index: "06",
    title: "Residential",
    description:
      "Houses and apartments planned around daily use — where light falls at breakfast, where a door swings, what you see on arrival.",
    image: img("expertise", 5, "Cut-stone gateway with a deep arched opening"),
    isDemo: true,
  },
  {
    id: "hospitality",
    index: "07",
    title: "Hospitality",
    description:
      "Hotels, restaurants and cultural venues designed as sequences: arrival, threshold, room, return.",
    image: img("expertise", 6, "Rubble stone wall with a timber lintel"),
    isDemo: true,
  },
  {
    id: "institutional",
    index: "08",
    title: "Institutional",
    description:
      "Civic, educational and cultural buildings, developed with the longer maintenance and adaptation horizon such work demands.",
    image: img("expertise", 7, "Rock-cut station concourse with exposed strata"),
    isDemo: true,
  },
  {
    id: "consultancy",
    index: "09",
    title: "Design Consultancy",
    description:
      "Feasibility, design review, and technical support for teams who need a second set of eyes before committing.",
    image: img("expertise", 8, "Public foyer with an open stair rising through it"),
    isDemo: true,
  },
];
