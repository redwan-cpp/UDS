import type { CollectionConfig } from "payload";

import {
  revalidateCollection,
  revalidateCollectionDelete,
} from "./hooks/revalidate";

import { editorAccess, indexField, isDemoField, stringList } from "./fields";

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
  hooks: {
    afterChange: [revalidateCollection("sustainability")],
    afterDelete: [revalidateCollectionDelete("sustainability")],
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["index", "title"],
    group: "Studio",
  },
  access: editorAccess,
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
