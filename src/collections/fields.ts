import type { Field } from "payload";

/**
 * Field shapes that recur across the collections.
 *
 * These exist because the same four or five structures appear in nearly every
 * content type, and hand-copying them is how two collections end up disagreeing
 * about what a paragraph is. `src/types/content.ts` is the contract; this file
 * is the single place each of its recurring shapes is expressed in Payload's
 * vocabulary.
 */

/**
 * A `string[]` of paragraphs — not rich text.
 *
 * The site renders each entry as its own `<p>` with its own scroll trigger
 * (CLAUDE.md rule 5), so paragraph boundaries carry behaviour and have to
 * survive the round trip. A rich-text blob would flatten them into one node and
 * the reveal would fire once for the whole block, which is the exact bug rule 5
 * was written after.
 */
export const paragraphs = (
  name: string,
  opts: { required?: boolean; description?: string } = {},
): Field => ({
  name,
  type: "array",
  required: opts.required,
  minRows: opts.required ? 1 : undefined,
  labels: { singular: "Paragraph", plural: "Paragraphs" },
  admin: opts.description ? { description: opts.description } : undefined,
  fields: [{ name: "text", type: "textarea", required: true }],
});

/** A `string[]` of short values — materials, services, requirements. */
export const stringList = (
  name: string,
  opts: { singular: string; plural: string; required?: boolean; description?: string },
): Field => ({
  name,
  type: "array",
  required: opts.required,
  minRows: opts.required ? 1 : undefined,
  labels: { singular: opts.singular, plural: opts.plural },
  admin: opts.description ? { description: opts.description } : undefined,
  fields: [{ name: "value", type: "text", required: true }],
});

/** A label/value table — `ProjectFact`, `ProductSpec`. Order is meaningful. */
export const labelValueRows = (
  name: string,
  opts: { singular: string; plural: string; required?: boolean; description?: string },
): Field => ({
  name,
  type: "array",
  required: opts.required,
  minRows: opts.required ? 1 : undefined,
  labels: { singular: opts.singular, plural: opts.plural },
  admin: {
    description:
      opts.description ??
      "Order is meaningful — it is the order these appear on the page.",
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "value", type: "text", required: true },
      ],
    },
  ],
});

/** The URL segment. Unique and indexed, because routes look documents up by it. */
export const slugField = (routePrefix: string): Field => ({
  name: "slug",
  type: "text",
  required: true,
  unique: true,
  index: true,
  admin: { description: `The URL segment: ${routePrefix}/<slug>.` },
});

/**
 * `isDemo` — how demo content is kept honest.
 *
 * Not scaffolding to be dropped once real content arrives: the footer notice
 * and the per-page disclaimers key off it, and `memory.md` records that
 * inventing facts about the studio is the one thing this project must never
 * do. An editor entering real content unticks it deliberately.
 */
export const isDemoField: Field = {
  name: "isDemo",
  type: "checkbox",
  defaultValue: false,
  admin: {
    description:
      "Placeholder content, not the studio's real work or details. Drives the demo notices.",
  },
};

/** Lower sorts first. */
export const orderField: Field = {
  name: "order",
  type: "number",
  required: true,
  defaultValue: 0,
  admin: { description: "Lower sorts first." },
};

/** The two-digit index the interface language uses, e.g. "01". */
export const indexField: Field = {
  name: "index",
  type: "text",
  required: true,
  admin: { description: 'Two digits, e.g. "01". Shown beside the title.' },
};

/** Per-document SEO overrides. Absent means "derive from the content". */
export const seoGroup: Field = {
  name: "seo",
  type: "group",
  admin: {
    description:
      "Leave blank to derive from the title and summary. Only fill these in to override.",
  },
  fields: [
    { name: "title", type: "text" },
    { name: "description", type: "textarea" },
    { name: "image", type: "upload", relationTo: "media" },
    {
      name: "noIndex",
      type: "checkbox",
      admin: { description: "Ask search engines not to index this page." },
    },
  ],
};

type AccessArgs = { req: { user?: { role?: string } | null } };

/** Read by anyone, written by signed-in editors, deleted only by an admin. */
export const editorAccess = {
  read: () => true,
  create: ({ req }: AccessArgs) => Boolean(req.user),
  update: ({ req }: AccessArgs) => Boolean(req.user),
  delete: ({ req }: AccessArgs) => req.user?.role === "admin",
};

/**
 * The same, for a collection with drafts — where `read: () => true` is a leak.
 *
 * Payload's draft support does not restrict reads on its own. With public read
 * access, an unpublished document is served to anyone who asks, and not only
 * when they ask for it: measured against a draft project, the title and full
 * body came back from `/api/projects` with no query parameter, no cookie and
 * no token, and again through GraphQL. For a studio drafting a case study on an
 * unannounced building, "saved but not published" has to mean private, and it
 * did not.
 *
 * A signed-in user still sees everything, which is what the admin panel needs.
 * Everyone else gets a filter rather than a boolean: only published documents
 * exist as far as the public API is concerned.
 */
export const publishedOnlyAccess = {
  ...editorAccess,
  read: ({ req }: AccessArgs) =>
    req.user ? true : { _status: { equals: "published" } },
};
