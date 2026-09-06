import type { CollectionConfig } from "payload";

import {
  revalidateCollection,
  revalidateCollectionDelete,
} from "./hooks/revalidate";

import { publishedOnlyAccess, indexField, isDemoField, stringList } from "./fields";

/**
 * Sustainability principles.
 *
 * `measures` is deliberately allowed to be empty. `memory.md` records that
 * every business fact about this studio is unsupplied, and a sustainability
 * page is the easiest place on a practice's site to drift into claims nobody
 * verified. An empty measures list renders as a principle without evidence,
 * which is honest; an invented one is the kind of fabrication ruler.md forbids
 * outright.
 */
export const Sustainability: CollectionConfig = {
  slug: "sustainability",
  // Autosave, because losing typing is the complaint that makes people stop
  // trusting a CMS. Payload only offers autosave on a drafts-enabled
  // collection, so drafts are on everywhere rather than on the four that
  // happened to have them — a consistent rule beats a remembered exception.
  // The interval is short: it is saving a row of a form, not a document.
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateCollection("sustainability")],
    afterDelete: [revalidateCollectionDelete("sustainability")],
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["index", "title"],
    group: "Studio",
  },
  access: publishedOnlyAccess,
  defaultSort: "index",
  fields: [
    {
      type: "row",
      fields: [indexField, { name: "title", type: "text", required: true }],
    },
    { name: "description", type: "textarea", required: true },
    stringList("measures", {
      singular: "Measure",
      plural: "Measures",
      description:
        "Concrete, verifiable practice. Leave empty rather than writing something the studio cannot stand behind.",
    }),
    { name: "image", type: "upload", relationTo: "media" },
    isDemoField,
  ],
};
