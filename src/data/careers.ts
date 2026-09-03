/* =============================================================================
   DEMO CONTENT
   The roles below are placeholder listings written to exercise the layout.
   They are not real vacancies. No salary, no closing date and no location
   beyond the studio's own is stated, because inventing any of those would be
   inventing a hiring commitment on the studio's behalf — see memory.md.
   ============================================================================= */

import type { JobOpening } from "@/types/content";

export const careersIntro =
  "We hire slowly and keep teams small. Most people here work across a project from first sketch to site, rather than being handed a stage of it.";

export const openings: JobOpening[] = [
  {
    index: "01",
    title: "Architect",
    discipline: "Architecture",
    commitment: "Full time",
    summary:
      "Running projects from concept through construction, with direct client and consultant contact from the first meeting.",
    requirements: [
      "Part 3 or equivalent, with built work you can talk through in detail",
      "Comfortable holding a drawing set together across a full technical package",
      "On site often enough to know what the details actually did",
    ],
  },
  {
    index: "02",
    title: "Interior Designer",
    discipline: "Interior Design",
    commitment: "Full time",
    summary:
      "Interiors, joinery and the objects that finish a space — worked up alongside the architecture rather than after it.",
    requirements: [
      "A portfolio with resolved joinery and material detail, not only moodboards",
      "Fluent in the studio's drawing standards or quick to adopt them",
      "Experience specifying and chasing bespoke fabrication",
    ],
  },
  {
    index: "03",
    title: "Architectural Assistant",
    discipline: "Architecture",
    commitment: "Full time / Placement",
    summary:
      "A studio-wide role: modelling, drawings, mock-ups, and enough site time to see how the two relate.",
    requirements: [
      "Part 1 or equivalent, or graduating within the year",
      "Physical model-making as a working method, not a final deliverable",
      "Curiosity about how things are actually put together",
    ],
  },
];
