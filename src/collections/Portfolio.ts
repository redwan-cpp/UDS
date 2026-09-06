import type { CollectionConfig } from "payload";

import { editorAccess, isDemoField, seoGroup, slugField } from "./fields";

/**
 * The portfolio index — the broader body of work.
 *
 * Lighter than `Projects` on purpose. A project is a case study with drawings
 * and a narrative; a portfolio entry is a card. `projectSlug` links the two
 * where an entry has grown into a full case study, which is what keeps every
 * project within two clicks of every other one.
 *
 * `category` mirrors `ProjectCategory` — the same options as Projects, because
 * both feed the same filter.
 */
export const Portfolio: CollectionConfig = {
  slug: "portfolio",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "year", "location"],
    group: "Work",
  },
  access: editorAccess,
  fields: [
    {
      type: "row",
      fields: [
        { name: "title", type: "text", required: true },
        slugField("/portfolio"),
      ],
    },
    {
      type: "row",
      fields: [
        { name: "location", type: "text", required: true },
        { name: "year", type: "text", required: true },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "category",
          type: "select",
          required: true,
          options: [
            "residential",
            "commercial",
            "hospitality",
            "interior",
            "institutional",
            "urban",
            "landscape",
            "other",
          ].map((v) => ({ label: v, value: v })),
        },
        {
          name: "areaSize",
          type: "text",
          required: true,
          admin: { description: "As written, including the unit." },
        },
      ],
    },
    { name: "summary", type: "textarea", required: true },
    { name: "image", type: "upload", relationTo: "media", required: true },
    {
      name: "projectSlug",
      type: "text",
      admin: {
        description:
          "Set when this also exists as a full case study, so the card links to it.",
      },
    },
    {
      name: "symbol",
      type: "group",
      admin: {
        description:
          "The entry's own mark. Leave empty and the card draws a section mark instead. Monochrome SVG — marks are masked to the surface colour.",
      },
      fields: [
        { name: "asset", type: "upload", relationTo: "media" },
        {
          name: "label",
          type: "text",
          admin: { description: "What the mark depicts." },
        },
      ],
    },
    isDemoField,
    seoGroup,
  ],
};
