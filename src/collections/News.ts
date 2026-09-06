import type { CollectionConfig } from "payload";

import {
  editorAccess,
  isDemoField,
  paragraphs,
  seoGroup,
  slugField,
} from "./fields";

/**
 * Collaboration and news.
 *
 * `date` is a real date field rather than the ISO string the type carries,
 * because an editor typing "2026-03-14" by hand will eventually type
 * "14/03/2026" and the `<time datetime>` will be invalid without anything
 * visibly breaking. Payload stores it as ISO, which is what the site reads.
 *
 * `documents` covers the MoUs and supporting files these entries often carry.
 * A document is either an uploaded PDF or an external link — never both, and
 * `kind` says which, so the card can label it honestly rather than guessing
 * from the file extension.
 */
export const News: CollectionConfig = {
  slug: "news",
  versions: { drafts: true },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "kind", "date", "featured"],
    group: "Studio",
  },
  access: editorAccess,
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
    paragraphs("body", { required: true }),
    { name: "image", type: "upload", relationTo: "media", required: true },
    { name: "gallery", type: "upload", relationTo: "media", hasMany: true },
    {
      name: "documents",
      type: "array",
      labels: { singular: "Document", plural: "Documents" },
      admin: { description: "MoUs and supporting documentation." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "label", type: "text", required: true },
            {
              name: "kind",
              type: "select",
              required: true,
              defaultValue: "pdf",
              options: [
                { label: "PDF", value: "pdf" },
                { label: "Link", value: "link" },
              ],
            },
          ],
        },
        {
          name: "href",
          type: "text",
          required: true,
          admin: {
            description:
              "A URL, or the path to an uploaded file. Never leave this empty — ruler.md forbids a link that goes nowhere; an unsupplied destination is set as text instead.",
          },
        },
      ],
    },
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
