/* =============================================================================
   DEMO CONTENT
   Fictional placeholder entries. No collaboration, event, MoU or award below is
   real, and no named organisation appears — inventing an institutional
   relationship is among the most damaging things a studio site can publish.
   Organisations are described by type only, and every entry is flagged demo.
   ============================================================================= */

import type { NewsItem } from "@/types/content";

import { img, imgs } from "./media";

export const news: NewsItem[] = [
  {
    id: "n1",
    slug: "memorandum-with-a-regional-university",
    isDemo: true,
    title: "Memorandum of understanding with a regional university",
    kind: "mou",
    date: "2026-06-18",
    organisation: "Regional university, school of architecture",
    location: "University campus",
    summary:
      "A two-year agreement covering studio teaching, a research placement, and shared access to the workshop.",
    body: [
      "The studio has signed a two-year memorandum of understanding with a regional university's school of architecture, covering three areas of work.",
      "The first is teaching: two members of the studio will run a design unit each spring, working on live sites within an hour of the school. The second is a research placement — one graduate each year, funded, working on material reuse in the studio's own projects rather than on a separate academic exercise.",
      "The third is workshop access. The school's fabrication facility and the studio's metal shop will be open to both parties, which should mean more full-size mock-ups and fewer decisions made from renders.",
    ],
    image: img("news", 1, "University architecture studio with student work on the walls"),
    documents: [
      { label: "Memorandum of understanding (PDF)", href: "#", kind: "pdf" },
    ],
    featured: true,
  },
  {
    id: "n2",
    slug: "material-reuse-exhibition",
    isDemo: true,
    title: "Material reuse: an exhibition of salvaged components",
    kind: "event",
    date: "2026-04-09",
    organisation: "Independent gallery",
    location: "City centre",
    summary:
      "Three weeks of salvaged structural components shown at full size, with the drawings that found a second use for each one.",
    body: [
      "The studio contributed six salvaged components to a group exhibition on material reuse: two steel beams, a run of hardwood flooring, a cast-iron column, and two sets of nineteenth-century window ironmongery.",
      "Each was shown at full size alongside the drawing that found it a second use. The point of the show was that reuse is a design problem before it is a sustainability one — a beam is only reusable if someone has drawn what it can become.",
    ],
    image: img("news", 2, "Exhibition space with structural components on display"),
    gallery: imgs("news", [
      "Salvaged steel beam shown at full size",
      "Drawings displayed beside each component",
    ]),
    featured: true,
  },
  {
    id: "n3",
    slug: "hillside-pavilions-reaches-structural-completion",
    isDemo: true,
    title: "Hillside Pavilions reaches structural completion",
    kind: "announcement",
    date: "2026-02-27",
    location: "Upland valley",
    summary:
      "All nine timber frames are up, and the first standing-seam roof is complete.",
    body: [
      "The last of the nine pavilion frames was raised in February, eleven weeks after the first. Because the buildings are identical in construction, the crew got faster with each one — the ninth frame took two days against the first one's five.",
      "The first standing-seam roof is complete and weathertight. Fit-out begins in spring, with the first three pavilions due to open later in the year.",
    ],
    image: img("sustain", 0, "Timber pavilion frame under construction"),
    featured: false,
  },
  {
    id: "n4",
    slug: "collaboration-with-a-metal-fabricator",
    isDemo: true,
    title: "Ongoing collaboration with a metal fabrication workshop",
    kind: "collaboration",
    date: "2025-11-14",
    organisation: "Independent metal fabrication workshop",
    summary:
      "A standing arrangement that puts the studio's drawings and the fabricator's tooling in the same room early.",
    body: [
      "The studio has worked with the same metal fabrication workshop on every project involving sheet work since 2022. The arrangement is now formalised: the fabricator joins design meetings from concept stage rather than being handed a finished drawing to price.",
      "In practice this means fold lines get set by what the brake press can actually do, and panel sizes get set by what fits on a lorry — both of which are cheaper to discover in a meeting than on site.",
    ],
    image: img("metal", 0, "Metal workshop with folded sheet components"),
    featured: false,
  },
  {
    id: "n5",
    slug: "civic-reading-rooms-opens",
    isDemo: true,
    title: "Civic Reading Rooms opens to the public",
    kind: "announcement",
    date: "2025-09-05",
    location: "City centre",
    summary:
      "The library opened in September with all five reading rooms in use.",
    body: [
      "The building opened to the public in September. Early observation suggests the acoustic gradient is working as intended: the street-level room fills first and stays busiest, and the top-floor silent room is consistently occupied without any signage asking for quiet.",
      "Post-occupancy review is scheduled for twelve months after opening.",
    ],
    image: img("news", 0, "Library reading room with people at tables"),
    featured: false,
  },
  {
    id: "n6",
    slug: "studio-publishes-detail-library",
    isDemo: true,
    title: "The studio publishes its construction detail library",
    kind: "publication",
    date: "2025-05-21",
    summary:
      "Forty-two tested construction details, released openly for other practices to use and improve.",
    body: [
      "The studio has published forty-two of its construction details openly, with the drawings, the specification notes, and — where it matters — a short account of what went wrong the first time.",
      "Details are only worth having if they have been built. Each one in the library has been constructed at least twice, and the notes record what changed between the first and second time.",
    ],
    image: img("process", 0, "Construction detail drawings laid out"),
    documents: [{ label: "Detail library (PDF)", href: "#", kind: "pdf" }],
    featured: false,
  },
];

export function getNews(): NewsItem[] {
  return [...news].sort((a, b) => b.date.localeCompare(a.date));
}

export function getFeaturedNews(limit = 3): NewsItem[] {
  const sorted = getNews();
  const featured = sorted.filter((n) => n.featured);
  // Top up from the rest, so the homepage band never renders short.
  return [...featured, ...sorted.filter((n) => !n.featured)].slice(0, limit);
}

export function getNewsBySlug(slug: string): NewsItem | undefined {
  return news.find((n) => n.slug === slug);
}

export function getNewsSlugs(): string[] {
  return news.map((n) => n.slug);
}

export const newsKindLabels: Record<NewsItem["kind"], string> = {
  collaboration: "Collaboration",
  event: "Event",
  mou: "Memorandum",
  announcement: "Announcement",
  award: "Recognition",
  publication: "Publication",
};
