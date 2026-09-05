/* =============================================================================
   Section and page copy.

   Every heading, label and standfirst the site displays that is not part of a
   content entity (a project, a product, a news item) lives here. It used to be
   written inline in the component or route that rendered it, which broke
   ruler.md's rule that no content literal lives outside `src/data` — and, more
   practically, put a large amount of the site's visible text somewhere a CMS
   can never reach. project-requirement.md §9 lists "Homepage" among the things
   editors must be able to manage; a homepage whose every heading is compiled
   into a component does not satisfy that, however well the projects beneath it
   are modelled.

   What is deliberately NOT here: `aria-label`s and screen-reader-only
   headings, form field labels, validation messages, and button chrome
   ("Close", "Start again"). Those are interface mechanics rather than studio
   copy. A validation message in a CMS is an invitation to break a form, and an
   accessible name is a structural property of a control, not something to
   rewrite for tone.
   ============================================================================= */

import type { SectionCopy } from "@/types/content";

/**
 * The homepage, in order down the page.
 *
 * The indices are this sequence's own — 01 to 05, closing up after the
 * expertise band, team grid and collaborator index were removed. The figures
 * band sits between projects and news carrying no number, deliberately: it is
 * a held pause rather than another beat to read, and it has no section head to
 * hang one on. Keeping the numbers together in one list is the point — the
 * last two times this sequence went stale it was because the numbers lived in
 * five different files and only some of them were updated.
 */
export const homeCopy = {
  about: {
    index: "01",
    eyebrow: "The studio",
  },
  expertise: {
    index: "02",
    eyebrow: "What we do",
  },
  projects: {
    index: "03",
    eyebrow: "Selected work",
    title: "Projects",
    aside:
      "The studio’s major projects. Hover a card for the detail, or open one for the full case study.",
  },
  news: {
    index: "04",
    eyebrow: "From the studio",
    title: "Collaboration & News",
  },
  closing: {
    index: "05",
    eyebrow: "Start a project",
  },
} satisfies Record<string, SectionCopy>;

/**
 * Page heroes, keyed by route.
 *
 * No `index`: a page's number comes from `navIndex()` in `navigation.ts`, so
 * the menu remains the one place the site's numbering is decided. An `intro`
 * is omitted where the route builds it from a content entity instead — About
 * opens with the studio statement's first paragraph, Careers with its own
 * intro — because copying that text here would create a second version of it
 * to keep in step.
 */
export const heroCopy = {
  "/about": { eyebrow: "The practice", title: "About" },
  "/projects": {
    eyebrow: "Selected work",
    title: "Projects",
    intro:
      "Everything the studio has built. The projects documented at length — the thinking, the drawings, and what happened on site.",
  },
  "/products": {
    eyebrow: "Made, not bought",
    title: "Products",
    intro:
      "Two lines that come out of the studio’s own projects: the doors people touch every day, and the folded metal work behind them.",
  },
  "/sustainability": {
    eyebrow: "Position",
    title: "Sustainability",
    intro:
      "Environmental decisions are made in the drawings, early, where they are still cheap to change — not added at the end as a specification.",
  },
  "/news": {
    eyebrow: "From the studio",
    title: "Collaboration & News",
    intro:
      "Agreements, exhibitions, site milestones and things we have published.",
  },
  "/contact": {
    eyebrow: "Start a conversation",
    title: "Contact",
    intro:
      "Four fields and a message. It takes a few seconds, and it reaches the right person first.",
  },
  "/careers": { eyebrow: "Careers", title: "Work with us" },
  "/privacy": {
    eyebrow: "Legal",
    title: "Privacy",
    intro:
      "This page is a placeholder. A privacy policy has not yet been provided by the studio.",
  },
  "/terms": {
    eyebrow: "Legal",
    title: "Terms",
    intro:
      "This page is a placeholder. Terms of use have not yet been provided by the studio.",
  },
} satisfies Record<string, SectionCopy>;

/**
 * Section heads inside the routes, keyed `route.section`.
 *
 * Flat rather than nested under each page: a CMS row is flat, and a key that
 * reads as a path is the thing an editor is shown. Nesting would only add a
 * level for the code to walk back down.
 */
export const sectionCopy = {
  "about.expertise": {
    eyebrow: "Areas of work",
    title: "What the studio does",
  },
  "about.team": {
    eyebrow: "Who does the work",
    title: "Management Team",
  },
  "careers.roles": { eyebrow: "Open roles" },
  "contact.direct": { title: "Or reach us directly" },
  "contact.email": { eyebrow: "Email" },
  "contact.phone": { eyebrow: "Telephone" },
  "contact.address": { eyebrow: "Studio" },
  "contact.hours": { eyebrow: "Hours" },
  "contact.social": { eyebrow: "Social" },
  "project.facts": { title: "Project information" },
  "project.description": { eyebrow: "Description" },
  "project.uniqueness": { eyebrow: "Uniqueness" },
  "project.concept": { eyebrow: "Our concept" },
  "project.related": { eyebrow: "Continue", title: "Related projects" },
  "privacy.today": { eyebrow: "What this build does today" },
  "terms.content": { eyebrow: "Content on this build" },
} satisfies Record<string, SectionCopy>;

/**
 * The footer's column headings, and the call to action at the end of the work
 * band. Small, but the same argument: an editor renaming "Index" to "Site map"
 * should not need a deploy.
 */
export const footerCopy = {
  index: "Index",
  contact: "Contact",
  location: "Location",
  follow: "Follow",
} as const;

export const actionCopy = {
  allProjects: "Show all projects",
  allNews: "All entries",
  aboutPractice: "Read about the practice",
  startConversation: "Start a conversation",
} as const;
