/* =============================================================================
   DEMO CONTENT
   Editorial copy below is placeholder written to exercise the layout. It makes
   no factual claim about Uthan Design Studio. Every contact detail is an
   explicit PLACEHOLDER using the reserved `.example` domain, and must be
   replaced with real studio information before production.
   ============================================================================= */

import type { StudioProfile } from "@/types/content";

export const studio: StudioProfile = {
  name: "Uthan Design Studio",
  tagline: "Architecture / Design / Space",

  disciplines: ["Architecture", "Interior Design", "Spatial Strategy"],

  /**
   * The About statement. Set in the serif at statement scale, so it is short by
   * construction — three sentences, not three paragraphs.
   */
  statement: [
    "We work in plan, section and light.",
    "Every project begins with the same question: what does this place already know how to do? The answer sets the structure, the material, and the pace of everything that follows.",
  ],

  approach: [
    "The studio works across architecture, interiors and the objects that finish them — doors, screens, fabricated metalwork — because the decisions that matter rarely stop at the boundary of a drawing set.",
    "We build slowly and detail closely. Projects are developed through physical models and full-size mock-ups as much as through drawings, and we stay on site through construction.",
  ],

  contact: {
    email: "studio@uthan.example", // PLACEHOLDER — .example is IANA-reserved for exactly this
    // PLACEHOLDER — the 555-0100–555-0199 range is reserved by the North
    // American Numbering Plan for fiction and demonstration use and is never
    // assigned to a real subscriber, the same safety convention as the
    // .example email domain above. Chosen over an obviously-broken string
    // like "+00 0000 000 000" so the field reads as a real phone number
    // rather than a template variable, without risking a real line.
    phone: "+1 (555) 010-0142",
    addressLines: [
      "Studio address to be confirmed", // PLACEHOLDER
      "Full details available on request", // PLACEHOLDER
    ],
    hours: "Monday–Friday, 09:00–18:00", // PLACEHOLDER
  },

  // PLACEHOLDER — no profile URLs supplied. `href` is deliberately omitted
  // rather than set to "#", which would ship three dead links on every page.
  social: [
    { label: "Instagram" },
    { label: "LinkedIn" },
    { label: "Behance" },
  ],

  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

/** True while the site is running on demo content. Drives the demo notice. */
export const IS_DEMO_BUILD = true;
