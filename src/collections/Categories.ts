import type { CollectionConfig } from "payload";

import {
  revalidateCollection,
  revalidateCollectionDelete,
} from "./hooks/revalidate";
import { publishedOnlyAccess, orderField } from "./fields";

/**
 * Categories, owned by the studio rather than by the code.
 *
 * Project and product categories were a fixed `select` whose options lived in
 * three collection files and a union in `src/types/content.ts`. Adding one
 * meant a developer editing four places and a deploy — which is precisely the
 * kind of thing a CMS exists to stop, and the studio asked for it directly.
 *
 * **`scope` is what keeps a doors category out of the projects filter.** One
 * collection rather than two, because a category is the same shape either way
 * and two collections would duplicate the model to encode a single field.
 *
 * **`slug` is the query value, and changing it changes URLs.** `/projects?
 * category=residential` is a real address people link to; the field warns about
 * that rather than leaving an editor to find out from a support email.
 *
 * `inFilter` exists because `memory.md` records a real decision: categories
 * outside the visible filter set are collected under "Other" so no item is ever
 * unreachable, and the studio decides which are prominent enough to earn their
 * own button. A filter row with fourteen entries is not a filter.
 */
export const Categories: CollectionConfig = {
  slug: "categories",
  // Autosave, because losing typing is the complaint that makes people stop
  // trusting a CMS. Payload only offers autosave on a drafts-enabled
  // collection, so drafts are on everywhere rather than on the four that
  // happened to have them — a consistent rule beats a remembered exception.
  // The interval is short: it is saving a row of a form, not a document.
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateCollection("categories")],
    afterDelete: [revalidateCollectionDelete("categories")],
  },
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "scope", "inFilter", "order"],
    group: "Settings",
    description:
      "The categories projects and products can be filed under. Used by the filter rows on /projects and /products.",
  },
  access: publishedOnlyAccess,
  defaultSort: "order",
  fields: [
    {
      type: "row",
      fields: [
        { name: "label", type: "text", required: true },
        {
          name: "slug",
          type: "text",
          required: true,
          index: true,
          admin: {
            description:
              "The value used in the URL, e.g. ?category=residential. Changing it breaks any link already shared with that address.",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "scope",
          type: "select",
          required: true,
          defaultValue: "project",
          options: [
            { label: "Projects and portfolio", value: "project" },
            { label: "Products", value: "product" },
          ],
          admin: {
            description: "Which filter row this appears in.",
          },
        },
        {
          name: "inFilter",
          type: "checkbox",
          defaultValue: true,
          admin: {
            description:
              "Show as its own button in the filter row. Unticked, items in this category are still reachable — they fall under Other.",
          },
        },
        orderField,
      ],
    },
  ],
};
