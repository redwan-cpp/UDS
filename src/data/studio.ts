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
   * The four service lines, as briefed, each pointing at the work that shows
   * it. Interior has a real category filter behind it; Exterior is the project
   * index unfiltered, since exterior work is most of it and a filter that
   * excluded nothing would be a filter pretending to do something. Consultancy
   * points at the areas-of-work list rather than at the contact form — a
   * service line should show the work first and ask second.
   */
  services: [
    { label: "Interior", href: "/projects?category=interior" },
    { label: "Exterior", href: "/projects" },
    { label: "Products", href: "/products" },
    { label: "Consultancy", href: "/about#expertise" },
  ],

  /**
   * The About statement. Set in the serif at statement scale, so it is short by
   * construction — three sentences, not three paragraphs.
   */
  /**
   * Supplied by the studio on 2026-09-10, replacing the copy written to hold
   * the layout. Set as two paragraphs because the first is display type and
   * the second is the read beneath it — see AboutStatement.
   */
  statement: [
    "Holistic approach for architectural projects.",
    "Unlike traditional firms, we differentiate ourselves through our attention to detail and mindfulness when it comes to thinking about and planning a project. We are considerate of all the stakeholders when designing a solution for our clients.",
  ],

  approach: [
    "The studio works across multiple areas as we intend to provide a one-stop and hassle-free solution. From designing the broader architectural elements to taking care of tiny details like fabricating a countertop or door, we make sure that every detail is noticed.",
    "Decisions rarely stop at drawing, and through an iterative process, we try to achieve perfection. We build slowly and detail closely. Projects are developed through digital models and through drawings, and we stay on site through construction.",
  ],

  /**
   * The closing beat. The studio's own line, and it does more work than the
   * previous one: it names what the first meeting actually is and offers it
   * for free, which is a reason to click rather than a statement of taste.
   */
  closing:
    "Every project starts with a conversation about the site over a fresh cup of coffee. Book your first free consultancy session with us.",

  /**
   * Supplied by the studio on 2026-09-10.
   *
   * Set in sentence case. The studio sent it in Title Case, which reads as a
   * heading and is hard work across a full paragraph; the wording is theirs,
   * untouched, and only the capitalisation follows the site. One apostrophe
   * added — "stakeholders needs" to "stakeholder's needs".
   *
   * Split display line from prose because the layout has both: the first line
   * is set large, the rest is the read beneath it.
   */
  about: {
    statement: ["Every project starts with a conversation."],
    body: [
      "A conversation about site, its history, the site's connection to its people, dwellers, and environment. Gradually, we figure out practical aspects of project — from material selection to the pace of construction.",
      "Your project is our canvas. The studio works across multiple areas to deliver a project which can become a legacy. From designing the interior and exterior to supplying the highest quality of materials and furniture to match the details level that we imagine on our drawings, the studio handles it all. We make sure every stakeholder's needs are addressed even before the pencils touch the drawing papers.",
    ],
  },

  contact: {
    /** Supplied by the studio, 2026-09-10. No longer a placeholder. */
    email: "info@uthandesignstudio.com",
    /**
     * The studio gave two numbers. `phone` is the one the site prints and
     * links with `tel:`; the second lives in `phoneAlt` rather than being
     * jammed into the same string, because a `tel:` href carrying two numbers
     * dials neither.
     */
    phone: "+880 1557 122818",
    phoneAlt: "+880 19 2998 8139",
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
    /** Supplied by the studio, 2026-09-10. Sunday to Thursday is the
     *  Bangladeshi working week. */
    hours: "Sunday–Thursday, 9:00 AM – 5:00 PM",
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

/**
 * True while the site is running on demo content. Drives the demo notices.
 *
 * Off since 2026-09-10, at the studio's request. The details, figures and copy
 * are theirs now. Worth being straight about what is still placeholder: the
 * projects, the portfolio, the products, the team and all the photography.
 * None of that is claimed as real by the site any more — but nor is it flagged
 * — so replacing it before launch is now a thing to remember rather than a
 * thing the page says out loud.
 */
export const IS_DEMO_BUILD = false;

/**
 * Who built it. Printed in the footer beside the copyright.
 *
 * A credit, not a link — ruler.md forbids an href that goes nowhere, and no
 * URL was supplied. Give me one and it becomes a link.
 */
export const DEVELOPER_CREDIT = "Website developed by Redova Studios (2026)";
