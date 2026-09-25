import type { CollectionConfig } from "payload";

import {
  revalidateCollection,
  revalidateCollectionDelete,
} from "./hooks/revalidate";

import {
  documentLinks,
  linkedVideos,
  isDemoField,
  richParagraphs,
  seoGroup,
  slugField,
} from "./fields";
import { authoredByField, authoredContentAccess, stampAuthor } from "./access";

/**
 * Collaboration and news.
 *
 * `date` is a real date field rather than the ISO string the type carries,
 * because an editor typing "2026-03-14" by hand will eventually type
 * "14/03/2026" and the `<time datetime>` will be invalid without anything
 * visibly breaking. Payload stores it as ISO, which is what the site reads.
 *
 * `documents` covers the MoUs and supporting files these entries often carry.
 * A document is either an uploaded PDF or an external link — never both — so
 * the public page can label the action honestly rather than guessing from a
 * filename or URL.
 */
export const News: CollectionConfig = {
  slug: "news",
  hooks: {
    beforeChange: [stampAuthor],
    afterChange: [revalidateCollection("news")],
    afterDelete: [revalidateCollectionDelete("news")],
  },
  // Autosave, because losing typing is the complaint that makes people stop
  // trusting a CMS. Payload only offers autosave on a drafts-enabled
  // collection, so drafts are on everywhere rather than on the four that
  // happened to have them — a consistent rule beats a remembered exception.
  // The interval is short: it is saving a row of a form, not a document.
  versions: { drafts: { autosave: { interval: 800 } } },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "kind", "date", "featured"],
    group: "Studio",
  },
  access: authoredContentAccess,
  fields: [
    {
      type: "row",
      fields: [{ name: "title", type: "text", required: true }, slugField("/news")],
    },
    {
      type: "row",
      fields: [
        {
          name: "kind",
          type: "select",
          required: true,
          options: [
            "collaboration",
            "event",
            "mou",
            "announcement",
            "award",
            "publication",
          ].map((v) => ({ label: v, value: v })),
        },
        {
          name: "date",
          type: "date",
          required: true,
          admin: { date: { pickerAppearance: "dayOnly" } },
        },
      ],
    },
    authoredByField(),
    {
      type: "row",
      fields: [
        {
          name: "organisation",
          type: "text",
          admin: { description: "The other party, where there is one." },
        },
        { name: "location", type: "text" },
      ],
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
      admin: { description: "One line. Used on cards and in the index." },
    },
    richParagraphs("body", { required: true }),
    { name: "image", type: "upload", relationTo: "media", required: true },
    { name: "gallery", type: "upload", relationTo: "media", hasMany: true },
    {
      name: "videos",
      type: "upload",
      relationTo: "videos",
      hasMany: true,
      admin: {
        description:
          "Optional short video sequence. Upload web-ready videos in Library → Videos first.",
      },
    },
    linkedVideos,
    documentLinks,
    {
      type: "row",
      fields: [
        {
          name: "featured",
          type: "checkbox",
          defaultValue: false,
          admin: { description: "Show on the homepage news band." },
        },
        isDemoField,
      ],
    },
    seoGroup,
  ],
};
