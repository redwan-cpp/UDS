/* =============================================================================
   DEMO CONTENT
   Every project below is fictional placeholder content, written to exercise the
   project layouts at realistic lengths. None of it is Uthan Design Studio's
   work, and no client, site or commission described here is real. The projects
   index and each project page carry a visible demo notice for this reason.
   Replace wholesale in Phase 2.
   ============================================================================= */

import type { Project } from "@/types/content";

import { img, imgs } from "./media";

const projects: Project[] = [
  {
    id: "p1",
    slug: "courtyard-house",
    isDemo: true,
    title: "Courtyard House",
    location: "Coastal escarpment",
    category: "residential",
    year: "2024",
    status: "completed",
    area: "410 m²",
    client: "Private",
    services: ["Architecture", "Interior Design", "Landscape"],
    summary:
      "A house organised around a single open room of air, cut through the plan to bring the sky down to ground level.",
    description: [
      "The site is a narrow plot on an exposed escarpment, with a strong prevailing wind from the sea and a single good view to the south-west. A conventional plan would have faced everything at that view and turned its back on the rest.",
      "Instead the house is arranged as a closed perimeter with a courtyard cut through its centre. The rooms look inward, into still air and reflected light, and the view is released only twice: once on arrival, and once from the long room at the western end.",
      "Walls are in-situ concrete cast against sawn boards, left as struck. Floors are the same concrete, ground and sealed. The only other materials are oak, for everything that is touched, and blackened steel for the openings.",
    ],
    uniqueness: [
      "The courtyard is not a garden. It is a room without a roof — the same floor level, the same wall finish, the same detail at the base. Crossing into it is a change of light, not a change of building.",
      "Every opening in the perimeter wall is the same width. The variation in the house comes from what those openings frame, not from the openings themselves.",
    ],
    concept: [
      "The starting drawing was a section, not a plan: a solid mass with a void cut vertically through it, and the question of what happens at the four edges of that void.",
      "The plan followed from the section. Rooms are ranged around the courtyard in a single loop, so the house is walked as a circuit rather than as a corridor with doors off it.",
    ],
    facts: [
      { label: "Location", value: "Coastal escarpment" },
      { label: "Year", value: "2024" },
      { label: "Area", value: "410 m²" },
      { label: "Status", value: "Completed" },
      { label: "Client", value: "Private" },
      { label: "Services", value: "Architecture, Interiors, Landscape" },
    ],
    hero: img("project", 0, "Board-marked concrete mass seen from below, deep shadow in the reveal"),
    gallery: imgs("interior", [
      "The courtyard seen from the entrance hall",
      "Living room with a full-height opening to the south-west",
      "Board-marked concrete wall meeting the ground floor slab",
      "The circuit corridor looking back toward the entrance",
    ]),
    process: imgs("process", [
      "Early section studies through the courtyard void",
      "Site plan showing the closed perimeter",
      "Concrete formwork mock-up on site",
    ]),
    featured: true,
    order: 1,
  },
  {
    id: "p2",
    slug: "warehouse-conversion",
    isDemo: true,
    title: "Warehouse Conversion",
    location: "Former dock district",
    category: "commercial",
    year: "2023",
    status: "completed",
    area: "2,840 m²",
    client: "Commercial developer",
    services: ["Architecture", "Adaptive Reuse", "Interior Design"],
    summary:
      "A brick and timber goods store adapted into workspace, with the new structure kept legible against the old.",
    description: [
      "The building was a four-storey goods store with a heavy timber frame, brick perimeter walls, and almost no daylight past the first six metres of floor plate.",
      "The intervention is a single move: two vertical slots cut through all four floors, one for a stair and one purely for light. Everything else — floors, columns, brickwork, the marks of a century of loading — was retained and left visible.",
      "New elements are in blackened steel and pale birch ply, detailed to sit clear of the existing fabric with a shadow gap at every junction. Nothing new touches anything old without declaring it.",
    ],
    uniqueness: [
      "The light slot has no function other than light. It was the hardest element to protect through cost review, and it is the reason the deep plan works.",
      "Original timber columns were retained even where structurally redundant, because their rhythm is the building's most valuable inheritance.",
    ],
    concept: [
      "Adaptive reuse fails when the new work apologises for itself. The concept here was to keep the two eras distinct and let the gap between them be the architecture.",
    ],
    facts: [
      { label: "Location", value: "Former dock district" },
      { label: "Year", value: "2023" },
      { label: "Area", value: "2,840 m²" },
      { label: "Status", value: "Completed" },
      { label: "Original building", value: "Four-storey timber-framed goods store" },
      { label: "Services", value: "Architecture, Adaptive Reuse, Interiors" },
    ],
    hero: img("project", 1, "Raking light striping a concrete stair and its landing"),
    gallery: imgs("interior", [
      "The new stair cut through four floors",
      "Light slot seen from the third floor",
      "Blackened steel landing against original brick",
    ], 1),
    process: imgs("process", [
      "Survey drawing of the existing timber frame",
      "Section study through the two vertical cuts",
      "Steel connection detail at first floor",
    ], 3),
    featured: true,
    order: 2,
  },
  {
    id: "p3",
    slug: "hillside-pavilions",
    isDemo: true,
    title: "Hillside Pavilions",
    location: "Upland valley",
    category: "hospitality",
    year: "2025",
    status: "in-progress",
    area: "1,120 m²",
    client: "Hospitality operator",
    services: ["Architecture", "Landscape", "Interior Design"],
    summary:
      "Nine guest pavilions set along a contour, each one turned a few degrees from the last so no two share a view.",
    description: [
      "The brief asked for twenty-four rooms. The site could carry nine buildings without terracing, and the studio recommended the smaller number.",
      "Each pavilion sits on a minimal pad foundation with the ground running under it. Timber frame, standing-seam metal roof, and a single deep loggia facing across the valley.",
      "The pavilions are identical in construction and different in orientation. Rotating each one along the contour means no pavilion looks into another, and the walk between them is never straight.",
    ],
    uniqueness: [
      "The decision to build nine instead of twenty-four is the project. Everything else follows from having enough room between buildings.",
    ],
    concept: [
      "A single repeated section, rotated. The variation is in the site, not the building — which is also what made the project affordable to build at this level of finish.",
    ],
    facts: [
      { label: "Location", value: "Upland valley" },
      { label: "Year", value: "2025" },
      { label: "Area", value: "1,120 m² across nine buildings" },
      { label: "Status", value: "In progress" },
      { label: "Client", value: "Hospitality operator" },
      { label: "Services", value: "Architecture, Landscape, Interiors" },
    ],
    hero: img("project", 2, "A low pavilion mirrored in still water"),
    gallery: imgs("sustain", [
      "Pavilion loggia facing the valley",
      "Standing-seam roof meeting the timber wall plate",
      "Interior with the loggia opening beyond",
    ]),
    process: imgs("process", ["Contour study with pavilion positions", "Typical pavilion section"], 5),
    featured: true,
    order: 3,
  },
  {
    id: "p4",
    slug: "civic-reading-rooms",
    isDemo: true,
    title: "Civic Reading Rooms",
    location: "City centre",
    category: "institutional",
    year: "2023",
    status: "completed",
    area: "1,760 m²",
    client: "Municipal authority",
    services: ["Architecture", "Interior Design", "Furniture"],
    summary:
      "A public library planned as five rooms of different acoustic character, from fully silent to openly social.",
    description: [
      "Libraries are usually planned as one large room with rules about noise. This one is planned as five rooms with different acoustic conditions, and no rules at all.",
      "The quietest room is at the top, small, top-lit, and lined in cork. The most social is at street level, opens directly onto the pavement, and is finished in hard plaster and terrazzo so it sounds like a public building.",
      "Between them the character shifts gradually. Visitors sort themselves by how much noise they want to be near, which turns out to work better than signage.",
    ],
    uniqueness: [
      "Acoustic performance is used as a planning tool rather than a technical afterthought. The specification of each room's reverberation time came before its dimensions were fixed.",
    ],
    concept: [
      "A gradient, not a hierarchy. Nobody is sent to the quiet room; they arrive at it by walking up through progressively quieter conditions.",
    ],
    facts: [
      { label: "Location", value: "City centre" },
      { label: "Year", value: "2023" },
      { label: "Area", value: "1,760 m²" },
      { label: "Status", value: "Completed" },
      { label: "Client", value: "Municipal authority" },
      { label: "Services", value: "Architecture, Interiors, Furniture" },
    ],
    hero: img("project", 3, "A tall civic hall enclosed in a glass and steel lattice"),
    gallery: imgs("interior", [
      "The street-level reading room",
      "Stair between the second and third rooms",
      "The top-lit silent room",
    ], 3),
    process: imgs("process", ["Acoustic gradient diagram", "Section through all five rooms"], 1),
    featured: true,
    order: 4,
  },
  {
    id: "p5",
    slug: "market-canopy",
    isDemo: true,
    title: "Market Canopy",
    location: "Riverside quarter",
    category: "urban",
    year: "2022",
    status: "completed",
    area: "2,200 m² covered",
    client: "City authority",
    services: ["Architecture", "Urban Design"],
    summary:
      "A single roof over an existing open-air market, designed to cast a specific quality of shade rather than to enclose.",
    description: [
      "The market had operated on this ground for decades without a roof. The brief was shelter; the risk was that a roof would turn an open public place into a building with opening hours.",
      "The canopy is therefore a roof and nothing else — no walls, no doors, no perimeter. It sits on twelve slender columns and floats clear of every existing structure.",
      "The soffit is perforated in a gradient, denser at the edges and more open at the centre, so the shade under it moves through the day rather than sitting flat.",
    ],
    concept: [
      "Shade as the subject. The project was designed from studies of what the ground looks like under it, not from what the roof looks like from outside.",
    ],
    facts: [
      { label: "Location", value: "Riverside quarter" },
      { label: "Year", value: "2022" },
      { label: "Area", value: "2,200 m² covered" },
      { label: "Status", value: "Completed" },
      { label: "Client", value: "City authority" },
      { label: "Services", value: "Architecture, Urban Design" },
    ],
    hero: img("project", 4, "A white lattice canopy spanning an open public floor"),
    gallery: imgs("detail", [
      "Shade pattern on the market floor at midday",
      "Column base detail at ground level",
      "The canopy edge against the existing terrace",
    ]),
    process: imgs("process", ["Perforation gradient study", "Shade analysis through the day"], 2),
    featured: false,
    order: 5,
  },
  {
    id: "p6",
    slug: "apartment-in-section",
    isDemo: true,
    title: "Apartment in Section",
    location: "Nineteenth-century terrace",
    category: "interior",
    year: "2024",
    status: "completed",
    area: "168 m²",
    client: "Private",
    services: ["Interior Design", "Furniture"],
    summary:
      "A tall, narrow apartment reorganised vertically, with one new opening in the floor doing the work of a whole plan.",
    description: [
      "The apartment occupied two floors of a nineteenth-century terrace: generous ceiling heights, poor daylight at the rear, and a plan that had been subdivided three times.",
      "The intervention removes a single rectangle of the upper floor. The resulting double-height space connects the two levels visually, carries light from the front windows to the back of the lower floor, and makes the apartment legible in one look.",
      "Everything else is restraint: partitions removed, original cornices repaired rather than replaced, and new joinery kept below the line of the existing mouldings so the two never argue.",
    ],
    uniqueness: [
      "One structural opening replaced what would otherwise have been a complete replan. The cheapest interventions are usually the ones that take the longest to find.",
    ],
    facts: [
      { label: "Location", value: "Nineteenth-century terrace" },
      { label: "Year", value: "2024" },
      { label: "Area", value: "168 m²" },
      { label: "Status", value: "Completed" },
      { label: "Client", value: "Private" },
      { label: "Services", value: "Interiors, Furniture" },
    ],
    hero: img("project", 5, "A stone spiral stair seen straight down through the full height of its void"),
    gallery: imgs("interior", [
      "The new opening seen from the lower floor",
      "Joinery kept below the original cornice line",
      "Upper floor looking down into the double-height space",
    ], 2),
    featured: false,
    order: 6,
  },
];

/* -------------------------------------------------------------------------- */
/* Accessors — routes call these, never the array.                            */
/* In Phase 2 these bodies become CMS fetches. The signatures do not move.     */
/* -------------------------------------------------------------------------- */

export function getProjects(): Project[] {
  return [...projects].sort((a, b) => a.order - b.order);
}


export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}

/**
 * Related work: same category first, then anything else, so a project page
 * always closes with somewhere to go even in a thin category.
 */
export function getRelatedProjects(slug: string, limit = 3): Project[] {
  const current = getProjectBySlug(slug);
  if (!current) return getProjects().slice(0, limit);

  const others = getProjects().filter((p) => p.slug !== slug);
  const sameCategory = others.filter((p) => p.category === current.category);
  const rest = others.filter((p) => p.category !== current.category);

  return [...sameCategory, ...rest].slice(0, limit);
}
