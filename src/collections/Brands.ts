import type { CollectionConfig } from "payload";

import {
  revalidateCollection,
  revalidateCollectionDelete,
} from "./hooks/revalidate";

import { publishedOnlyAccess, isDemoField, orderField } from "./fields";

/**
 * Collaborators and consultants — the moving strip beneath the figures.
 *
 * `logo` is optional and a collaborator without one shows the name alone. When
 * one is supplied it must be a **monochrome SVG**: marks are painted through a
 * CSS mask over a `currentColor` fill so they take the surface's own colour and
 * lift to the accent on hover. A full-colour logo will be flattened to one
 * tone. That is the site's rule rather than a limitation of the upload — one
 * accent, and it belongs to ink.
 *
 * `memory.md` is binding here: a real company's mark shipped as proof of a
 * relationship the studio has not documented is a fabrication. Only add a logo
 * the studio has permission to show.
 */
export const Brands: CollectionConfig = {
  slug: "brands",
  // Autosave, because losing typing is the complaint that makes people stop
  // trusting a CMS. Payload only offers autosave on a drafts-enabled
  // collection, so drafts are on everywhere rather than on the four that
  // happened to have them — a consistent rule beats a remembered exception.
  // The interval is short: it is saving a row of a form, not a document.
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateCollection("brands")],
    afterDelete: [revalidateCollectionDelete("brands")],
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "relationship", "order"],
    group: "Studio",
  },
  access: publishedOnlyAccess,
  defaultSort: "order",
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true },
        {
          name: "relationship",
          type: "text",
          required: true,
          admin: { description: 'What they did, e.g. "Structure", "Lighting".' },
        },
      ],
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Monochrome SVG. Painted through a mask so it takes the surface colour — a full-colour logo will be flattened. Leave empty to show the name alone.",
      },
    },
    { type: "row", fields: [orderField, isDemoField] },
  ],
};
