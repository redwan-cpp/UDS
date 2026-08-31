/* =============================================================================
   Contact flow definition — UI ONLY IN PHASE 1.
   Submission is stubbed at the boundary. No data is transmitted, stored or
   emailed. The server action, validation, rate limiting, bot protection and
   transactional email are Phase 3 — see architecture.md §3.5.
   ============================================================================= */

import type { ContactStep } from "@/types/content";

export const contactSteps: ContactStep[] = [
  {
    id: "intent",
    index: "01",
    kind: "choice",
    question: "What are you here about?",
    helper: "One answer. You can add detail later.",
    options: [
      { value: "architecture", label: "Architecture", description: "A new building, an extension, or a change of use" },
      { value: "interior", label: "Interior", description: "Reworking a space that already exists" },
      { value: "product", label: "Products", description: "Custom doors or fabricated sheet work" },
      { value: "consultation", label: "Consultation", description: "Feasibility, design review, or a second opinion" },
      { value: "collaboration", label: "Collaboration", description: "Working together on something" },
      { value: "other", label: "Something else", description: "Press, recruitment, or anything not listed" },
    ],
  },
  {
    id: "type",
    index: "02",
    kind: "choice",
    question: "What kind of project is it?",
    options: [
      { value: "residential", label: "Residential" },
      { value: "commercial", label: "Commercial" },
      { value: "hospitality", label: "Hospitality" },
      { value: "institutional", label: "Institutional" },
      { value: "urban", label: "Urban / public realm" },
      { value: "undecided", label: "Not sure yet" },
    ],
  },
  {
    id: "location",
    index: "03",
    kind: "text",
    question: "Where is it?",
    helper: "A city or region is enough at this stage.",
    placeholder: "City, region or country",
  },
  {
    id: "scale",
    index: "04",
    kind: "choice",
    question: "Roughly what scale?",
    helper: "An estimate is fine. This only helps us route your enquiry.",
    options: [
      { value: "under-100", label: "Under 100 m²" },
      { value: "100-500", label: "100 – 500 m²" },
      { value: "500-2000", label: "500 – 2,000 m²" },
      { value: "over-2000", label: "Over 2,000 m²" },
      { value: "unknown", label: "Not established yet" },
    ],
  },
  {
    id: "detail",
    index: "05",
    kind: "longtext",
    question: "Tell us about it.",
    helper: "What the site is, what you want to do, and what is driving the timing.",
    optional: true,
    placeholder: "As much or as little as you like",
  },
  {
    id: "details",
    index: "06",
    kind: "details",
    question: "How do we reach you?",
  },
  {
    id: "review",
    index: "07",
    kind: "review",
    question: "Check this over.",
    helper: "Change anything before you send it.",
  },
];

/** Step ids that only apply to a project enquiry, skipped for the rest. */
export const projectOnlySteps = ["type", "location", "scale"] as const;

/**
 * Intents that skip the project-scoping questions. Someone writing about press
 * or recruitment should not be asked for a floor area.
 */
export const nonProjectIntents = ["collaboration", "other"] as const;
