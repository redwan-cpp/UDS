import type { CollectionConfig } from "payload";

import {
  revalidateCollection,
  revalidateCollectionDelete,
} from "./hooks/revalidate";

import {
  publishedOnlyAccess,
  isDemoField,
  labelValueRows,
  orderField,
  paragraphs,
  seoGroup,
  slugField,
  stringList,
} from "./fields";

/**
 * The products arm — custom doors and fabricated sheet work.
 *
 * Two categories, and `memory.md` is explicit that two is the honest number:
 * inventing a third to make the filter row look busier would be claiming a
 * capability the studio does not have. So the options here are closed rather
 * than free text, and widening them is a decision someone has to make on
 * purpose in this file and in `ProductCategory`.
 */
export const Products: CollectionConfig = {
  slug: "products",
  hooks: {
    afterChange: [revalidateCollection("products")],
    afterDelete: [revalidateCollectionDelete("products")],
  },
  // Autosave, because losing typing is the complaint that makes people stop
  // trusting a CMS. Payload only offers autosave on a drafts-enabled
  // collection, so drafts are on everywhere rather than on the four that
  // happened to have them — a consistent rule beats a remembered exception.
  // The interval is short: it is saving a row of a form, not a document.
  versions: { drafts: { autosave: { interval: 800 } } },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "order"],
    group: "Work",
  },
  access: publishedOnlyAccess,
  fields: [
    {
      type: "row",
      fields: [
        { name: "title", type: "text", required: true },
        slugField("/products"),
      ],
    },
    {
        name: "category",
        type: "relationship",
        relationTo: "categories",
        hasMany: true,
        required: true,
        // Only the categories scoped to this side of the site. Without the
        // filter an editor picking a project category is offered "Custom
        // doors", which is how a project ends up in a filter row that does
        // not render it.
        filterOptions: { scope: { equals: "product" } },
      },
    {
      name: "summary",
      type: "textarea",
      required: true,
      admin: { description: "One line, sits under the title." },
    },
    paragraphs("description", { required: true }),
    stringList("materials", {
      singular: "Material",
      plural: "Materials",
      required: true,
    }),
    stringList("applications", {
      singular: "Application",
      plural: "Applications",
      required: true,
    }),
    labelValueRows("specs", {
      singular: "Specification",
      plural: "Specifications",
      required: true,
    }),
    { name: "hero", type: "upload", relationTo: "media", required: true },
    {
      name: "gallery",
      type: "upload",
      relationTo: "media",
      hasMany: true,
      required: true,
    },
    { type: "row", fields: [orderField, isDemoField] },
    seoGroup,
  ],
};
