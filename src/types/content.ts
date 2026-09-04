/**
 * CONTENT CONTRACT — UTHAN DESIGN STUDIO
 *
 * These types are the interface between the site and its content source.
 * In Phase 1 they are satisfied by the typed mock data in `src/data`.
 * In Phase 2 they must be satisfied by the CMS, unchanged.
 *
 * Rule: components consume these types. Components never consume `src/data`
 * directly — only routes do. See architecture.md §2.4.
 */

/* -------------------------------------------------------------------------- */
/* Media                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Mirrors the metadata the future media library will store, so no migration is
 * needed when the CMS lands. `width`/`height` are required because they are
 * what structurally prevents layout shift.
 */
export interface MediaAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  credit?: string;
  source?: string;
  licence?: string;
  /** Focal point for art-directed crops, 0–1 in each axis. Defaults to centre. */
  focal?: { x: number; y: number };
}

export interface VideoAsset {
  /**
   * Ordered by preference — the browser plays the first `type` it can decode.
   * WebM (VP9) first: smaller for the same visual quality. MP4 (H.264) as the
   * broad-compatibility fallback (older Safari in particular).
   */
  sources: { src: string; type: string }[];
  poster: MediaAsset;
  /** Described for assistive technology; decorative background video has none. */
  description?: string;
  credit?: string;
  source?: string;
  licence?: string;
}

/* -------------------------------------------------------------------------- */
/* Shared                                                                      */
/* -------------------------------------------------------------------------- */

export interface Seo {
  title?: string;
  description?: string;
  image?: MediaAsset;
  noIndex?: boolean;
}

/** Every content entity carries these. `isDemo` is how demo content is kept honest. */
export interface ContentBase {
  id: string;
  slug: string;
  isDemo: boolean;
  seo?: Seo;
}

export type ProjectCategory =
  | "residential"
  | "commercial"
  | "hospitality"
  | "interior"
  | "institutional"
  | "urban"
  | "landscape"
  | "other";

export type ProjectStatus = "completed" | "in-progress" | "concept";

/* -------------------------------------------------------------------------- */
/* Projects                                                                    */
/* -------------------------------------------------------------------------- */

/** A key/value row in the project information table. Order is meaningful. */
export interface ProjectFact {
  label: string;
  value: string;
}

/**
 * Major Projects — the publication-grade case study.
 * Optional narrative sections may be absent; the layout must not assume them.
 */
export interface Project extends ContentBase {
  title: string;
  location: string;
  category: ProjectCategory;
  year: string;
  status: ProjectStatus;
  /** One line. Used on cards and in the index. */
  summary: string;
  /** Long-form. Paragraphs, rendered as separate <p> elements. */
  description: string[];
  /** "What makes this project unique" — optional. */
  uniqueness?: string[];
  /** "Our concept" — optional. */
  concept?: string[];
  area?: string;
  client?: string;
  services?: string[];
  facts: ProjectFact[];
  /** The project's own mark, uploaded per project in the CMS. */
  symbol?: ProjectSymbol;
  hero: MediaAsset;
  gallery: MediaAsset[];
  /** Rough work / behind the scenes: sketches, drawings, site photography. */
  process?: MediaAsset[];
  featured: boolean;
  /** Controls order in the featured showcase. Lower sorts first. */
  order: number;
}

/* -------------------------------------------------------------------------- */
/* Portfolio                                                                   */
/* -------------------------------------------------------------------------- */

/** Lighter than a Project. The index of everything the studio has built. */
export interface PortfolioItem extends ContentBase {
  title: string;
  summary: string;
  location: string;
  areaSize: string;
  category: ProjectCategory;
  year: string;
  image: MediaAsset;
  /** Set when this item also exists as a full Project case study. */
  projectSlug?: string;
  /** The project's own mark. See `ProjectSymbol` below. */
  symbol?: ProjectSymbol;
}

/**
 * A project's own mark — the small drawn symbol that stands for the design
 * idea, in the way practices letter a scheme on a drawing sheet.
 *
 * Uploaded per project by an editor in the CMS (Phase 2), which is why it is
 * in the content contract now rather than being derived in a component: the
 * shape of this field is what the CMS has to satisfy later.
 *
 * Optional on purpose. A project that has not been given a mark yet renders a
 * drawn fallback rather than a gap, so the grid never depends on an editor
 * having got round to it.
 */
export interface ProjectSymbol {
  /** The uploaded artwork. SVG preferred so it scales and takes currentColor. */
  asset: MediaAsset;
  /** What the mark depicts, for assistive technology. */
  label: string;
}

/* -------------------------------------------------------------------------- */
/* Products                                                                    */
/* -------------------------------------------------------------------------- */

export interface ProductSpec {
  label: string;
  value: string;
}

/**
 * What kind of thing a product line is. Deliberately describes only the lines
 * that exist — a category with nothing in it is a filter that returns an
 * empty page, which is worse than not offering the filter at all. Extend this
 * when the studio adds a line, not in anticipation of one.
 */
export type ProductCategory = "doors" | "metalwork";

export interface Product extends ContentBase {
  title: string;
  category: ProductCategory;
  /** One line, sits under the title. */
  summary: string;
  description: string[];
  materials: string[];
  applications: string[];
  specs: ProductSpec[];
  hero: MediaAsset;
  gallery: MediaAsset[];
  order: number;
}

/* -------------------------------------------------------------------------- */
/* News & collaboration                                                        */
/* -------------------------------------------------------------------------- */

export type NewsKind =
  | "collaboration"
  | "event"
  | "mou"
  | "announcement"
  | "award"
  | "publication";

export interface NewsItem extends ContentBase {
  title: string;
  kind: NewsKind;
  /** ISO 8601. Rendered through <time datetime>. */
  date: string;
  organisation?: string;
  location?: string;
  summary: string;
  body: string[];
  image: MediaAsset;
  gallery?: MediaAsset[];
  /** MoU or supporting documentation. */
  documents?: { label: string; href: string; kind: "pdf" | "link" }[];
  featured: boolean;
}

/* -------------------------------------------------------------------------- */
/* Studio                                                                      */
/* -------------------------------------------------------------------------- */

export interface TeamMember extends ContentBase {
  name: string;
  role: string;
  /** Optional short biography, one sentence — shown on the card at rest. */
  bio?: string;
  /**
   * A longer paragraph, shown only in the expanded detail view. Kept separate
   * from `bio` rather than making the card's own bio longer: the card is
   * meant to stay scannable in a grid of four, and the detail view is meant
   * to be worth clicking through to — the same content in both places would
   * make opening the card pointless.
   */
  detail?: string;
  portrait: MediaAsset;
  /**
   * The member's own LinkedIn profile. Absent for demo people — these are
   * invented names, and a guessed profile URL would either 404 or land on a
   * real stranger who shares the name. The portrait's "View profile" overlay
   * renders only when this is set.
   */
  linkedin?: string;
  order: number;
}

export interface Brand {
  id: string;
  name: string;
  /** Optional — omitted where no honest logo asset exists. Name is then set in type. */
  logo?: MediaAsset;
  relationship: string;
  isDemo: boolean;
}

export interface ExpertiseArea {
  id: string;
  /** Two-digit index shown in the UI, e.g. "01". */
  index: string;
  title: string;
  description: string;
  image: MediaAsset;
  isDemo: boolean;
}

export interface Statistic {
  id: string;
  value: number;
  /** Rendered after the animated numeral, e.g. "+" or "%". */
  suffix?: string;
  prefix?: string;
  label: string;
  isDemo: boolean;
}

export interface SustainabilityPrinciple {
  id: string;
  index: string;
  title: string;
  description: string;
  /** Concrete measures. Empty until the studio supplies verified practice. */
  measures: string[];
  image?: MediaAsset;
  isDemo: boolean;
}

/* -------------------------------------------------------------------------- */
/* Studio profile                                                              */
/* -------------------------------------------------------------------------- */

export interface StudioProfile {
  name: string;
  /** The hero setting. Kept short — it is display type, not a paragraph. */
  tagline: string;
  disciplines: string[];
  /**
   * Service lines, set along the hero's baseline rule. Each carries where it
   * goes: the hero states what the studio does, and a visitor who reads
   * "Interior" and wants to see interiors should not have to go and find the
   * filter themselves. `href` lives here rather than in the component because
   * it is a content decision — which work stands for which service — not a
   * layout one.
   */
  services: { label: string; href: string }[];
  /** The editorial About statement. Set in the serif. */
  statement: string[];
  /** Supporting paragraphs below the statement. */
  approach: string[];
  /**
   * The homepage's closing line, immediately before the footer — the one
   * beat that asks for something after everything before it has made the
   * case. Kept separate from `statement`/`approach` because it belongs to a
   * different section with a different job: those introduce the studio,
   * this closes the page.
   */
  closing: string;
  contact: {
    email: string;
    phone: string;
    addressLines: string[];
    hours?: string;
    /**
     * The canonical location record, supplied by the studio. Kept alongside
     * `mapEmbedUrl` because the embed URL is an opaque Google string that
     * cannot be read back for anything else (a directions link, structured
     * data in a later phase).
     */
    coordinates?: { lat: number; lon: number };
    /**
     * Google Maps embed URL for the studio's own listing. Absent until the
     * studio supplies one, in which case the map renders a stated "location
     * pending" panel rather than dropping a pin somewhere plausible — a map
     * is a factual claim about where a business is.
     *
     * NOTE: this loads Google content and sets Google cookies. The privacy
     * page documents it; if this field is ever cleared, that page needs
     * revisiting too.
     */
    mapEmbedUrl?: string;
  };
  /** `href` is absent until the studio supplies a real profile URL.
   *  Components render an unlinked label rather than a dead `#` anchor. */
  social: { label: string; href?: string }[];
  legal: { label: string; href: string }[];
}

/* -------------------------------------------------------------------------- */
/* Navigation                                                                  */
/* -------------------------------------------------------------------------- */

export interface NavItem {
  index: string;
  label: string;
  href: string;
  /** Shown in the desktop menu overlay on hover. */
  image?: MediaAsset;
}

/* -------------------------------------------------------------------------- */
/* Contact flow (UI only in Phase 1)                                           */
/* -------------------------------------------------------------------------- */

export interface ContactOption {
  value: string;
  label: string;
  description?: string;
}

export type ContactStepKind = "choice" | "text" | "longtext" | "details" | "review";

export interface ContactStep {
  id: string;
  index: string;
  kind: ContactStepKind;
  question: string;
  helper?: string;
  optional?: boolean;
  options?: ContactOption[];
  placeholder?: string;
}

/* -------------------------------------------------------------------------- */

/** A role on the careers page. */
export interface JobOpening {
  index: string;
  title: string;
  discipline: string;
  /** e.g. "Full time" — deliberately not a salary or a closing date. */
  commitment: string;
  summary: string;
  requirements: string[];
}

/* -------------------------------------------------------------------------- */

/** What kind of thing a search result points at. Drives the label on the row. */
export type SearchKind =
  | "page"
  | "project"
  | "product"
  | "news"
  | "expertise"
  | "role";

/**
 * One searchable thing.
 *
 * Flattened from the typed content at build time rather than fetched: this
 * site's whole corpus is a few dozen entries, so the "index" is an array and
 * the "engine" is a substring match. Anything more (a search service, an
 * inverted index, fuzzy scoring) would be more machinery than the content
 * justifies, and it would need a backend this phase does not have.
 */
export interface SearchEntry {
  id: string;
  title: string;
  kind: SearchKind;
  href: string;
  /** One line shown under the title in the results. */
  summary?: string;
  /** Extra matchable text that is not displayed — location, category, tags. */
  keywords?: string[];
}
