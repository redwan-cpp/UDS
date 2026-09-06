import type { CollectionConfig } from "payload";

import {
  revalidateCollection,
  revalidateCollectionDelete,
} from "./hooks/revalidate";

import { publishedOnlyAccess, isDemoField, orderField } from "./fields";

/**
 * The figures band.
 *
 * `value` is a number, not a string, because the site animates it — a counter
 * cannot count to "140+". The trailing "+" is a separate `suffix` field for
 * exactly that reason, and splitting them is what lets the numeral animate
 * while the sign stays put.
 */
export const Statistics: CollectionConfig = {
  slug: "statistics",
  // Autosave, because losing typing is the complaint that makes people stop
  // trusting a CMS. Payload only offers autosave on a drafts-enabled
  // collection, so drafts are on everywhere rather than on the four that
  // happened to have them — a consistent rule beats a remembered exception.
  // The interval is short: it is saving a row of a form, not a document.
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateCollection("statistics")],
    afterDelete: [revalidateCollectionDelete("statistics")],
  },
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "value", "order"],
    group: "Studio",
  },
  access: publishedOnlyAccess,
  defaultSort: "order",
  fields: [
    {
      type: "row",
      fields: [
        { name: "label", type: "text", required: true },
        {
          name: "value",
          type: "number",
          required: true,
          admin: { description: "The number alone. The counter animates to it." },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "prefix",
          type: "text",
          admin: { description: 'Before the numeral, e.g. "$".' },
        },
        {
          name: "suffix",
          type: "text",
          admin: { description: 'After the numeral, e.g. "+" or "%".' },
        },
      ],
    },
    { type: "row", fields: [orderField, isDemoField] },
  ],
};
