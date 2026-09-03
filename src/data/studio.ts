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

  /** The four service lines, as briefed. Set along the hero's baseline rule. */
  services: ["Interior", "Exterior", "Products", "Consultancy"],

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
    /**
     * Taken from the studio's own Google Business listing, supplied via the
     * embed below — not invented, and no longer a placeholder. Worth checking
     * against the listing if that listing is ever edited, since these two now
     * state the same fact in two places.
     */
    addressLines: ["Plot 1, Road 4", "Gulshan, Dhaka 1212", "Bangladesh"],
    /** Supplied by the studio. Dhaka, Bangladesh. */
    coordinates: { lat: 23.783405, lon: 90.420582 },
    /** The studio's own Google Maps listing, supplied by the studio. */
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58412.11844851091!2d90.37955454160682!3d23.79165168216465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7246bf5b245%3A0x30fec1c7bfe52f6c!2sUthan%20Design%20Studio!5e0!3m2!1sen!2sbd!4v1788415440619!5m2!1sen!2sbd",
    hours: "Monday–Friday, 09:00–18:00", // PLACEHOLDER
  },

  // PLACEHOLDER — no profile URLs supplied. `href` is deliberately omitted
  // rather than set to "#", which would ship three dead links on every page.
  /**
   * The four channels the studio asked for. Deliberately still href-less:
   * these are real accounts on real platforms and the studio has not supplied
   * the handles — inventing plausible ones would produce links that either
   * 404 or, worse, land on somebody else's profile. The UI renders a labelled
   * entry with no link until a handle exists (see `social` handling below).
   */
  social: [
    { label: "Facebook" },
    { label: "Instagram" },
    { label: "WhatsApp" },
    { label: "LinkedIn" },
  ],

  legal: [
    { label: "Careers", href: "/careers" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

/** True while the site is running on demo content. Drives the demo notice. */
export const IS_DEMO_BUILD = true;
