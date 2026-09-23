import type { Field } from "payload";
import {
  BoldFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  ParagraphFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  UnderlineFeature,
} from "@payloadcms/richtext-lexical";

import { isLinkedVideoProvider, isSupportedLinkedVideo } from "@/lib/video-links";

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

/**
 * The editor for rich paragraphs — Word-style character formatting only.
 *
 * Bold, italic, underline, strikethrough, sub/superscript (m², CO₂) and links,
 * from the toolbar that appears over selected text or the usual Ctrl+B / I / U.
 * No headings, lists, quotes, colours or font sizes: the type scale in
 * `design.md` is closed, and a paragraph set in 32px red is exactly what it
 * exists to prevent. Enter still starts a new paragraph — `toRichParagraphs`
 * gives each one its own `<p>` and scroll trigger (CLAUDE.md rule 5).
 *
 * Links are to URLs only. An internal link to a document needs a resolver for
 * every collection's route, and pasting the page's address does the same job.
 */
const inlineEditor = lexicalEditor({
  features: () => [
    ParagraphFeature(),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    SubscriptFeature(),
    SuperscriptFeature(),
    LinkFeature({ enabledCollections: [] }),
    InlineToolbarFeature(),
  ],
});

/**
 * A `Paragraph[]` whose rows are rich text — `paragraphs()` with formatting.
 *
 * The rich text lives in `content`, a new column, rather than replacing
 * `text`. Changing `text` from a text column to JSON is a type change Postgres
 * will not cast, so the schema push offers to drop the column — the paragraphs
 * editors had already published. `text` stays as a hidden legacy column:
 * `scripts/migrate-rich-text.ts` moves each value into `content`, and the site
 * reads `text` for any row that has not moved yet, including old versions
 * restored from history.
 */
export const richParagraphs = (
  name: string,
  opts: { required?: boolean; description?: string } = {},
): Field => ({
  name,
  type: "array",
  required: opts.required,
  minRows: opts.required ? 1 : undefined,
  labels: { singular: "Paragraph", plural: "Paragraphs" },
  admin: opts.description ? { description: opts.description } : undefined,
  fields: [
    { name: "content", label: "Text", type: "richText", editor: inlineEditor },
    // ponytail: legacy plain text, kept so the push never drops a column. Remove once
    // every environment has run migrate-rich-text.ts (accepting the drop prompt).
    { name: "text", type: "textarea", admin: { hidden: true } },
  ],
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

/** Supporting material for News and Knowledge: a managed PDF or external URL. */
export const documentLinks: Field = {
  name: "documents",
  type: "array",
  labels: { singular: "Document", plural: "Documents" },
  admin: {
    description:
      "Add an uploaded PDF or an external link. Select one destination for each document.",
  },
  fields: [
    {
      name: "label",
      type: "text",
      required: true,
    },
    {
      name: "kind",
      type: "select",
      required: true,
      defaultValue: "pdf",
      options: [
        { label: "Uploaded PDF", value: "pdf" },
        { label: "External link", value: "link" },
      ],
    },
    {
      name: "file",
      type: "upload",
      relationTo: "documents",
      admin: {
        condition: (_, siblingData) => siblingData?.kind === "pdf",
        description: "Upload the PDF in Library → Documents first.",
      },
    },
    {
      name: "href",
      type: "text",
      admin: {
        condition: (_, siblingData) => siblingData?.kind === "link",
        description: "Use a full https:// URL for an external document.",
      },
    },
  ],
};

/** Public video links that have a safe, known player implementation. */
export const linkedVideos: Field = {
  name: "linkedVideos",
  type: "array",
  labels: { singular: "Linked video", plural: "Linked videos" },
  admin: {
    description:
      "Public YouTube, Facebook, or direct HTTPS MP4/WebM links. They play on this page; YouTube and Facebook also show a Full video button.",
  },
  fields: [
    {
      name: "label",
      type: "text",
      required: true,
      admin: { description: "What the video shows, for visitors using a screen reader." },
    },
    {
      name: "provider",
      type: "select",
      required: true,
      defaultValue: "youtube",
      options: [
        { label: "YouTube", value: "youtube" },
        { label: "Facebook", value: "facebook" },
        { label: "Direct MP4 or WebM file", value: "file" },
      ],
    },
    {
      name: "url",
      type: "text",
      required: true,
      validate: (value: unknown, { siblingData }: { siblingData: unknown }) => {
        const row =
          siblingData && typeof siblingData === "object"
            ? (siblingData as Record<string, unknown>)
            : undefined;
        const provider = row && isLinkedVideoProvider(row.provider) ? row.provider : undefined;

        if (typeof value !== "string" || !provider || !isSupportedLinkedVideo(value, provider)) {
          return "Use a public HTTPS URL matching the selected video source.";
        }

        return true;
      },
      admin: {
        description:
          "Paste the public video URL. YouTube and Facebook videos must allow embedding.",
      },
    },
  ],
};

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
