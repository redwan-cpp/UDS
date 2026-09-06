import type { CollectionConfig } from "payload";

import { editorAccess, isDemoField, orderField } from "./fields";

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
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "value", "order"],
    group: "Studio",
  },
  access: editorAccess,
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
