import type { CollectionConfig } from "payload";

import {
  revalidateCollection,
  revalidateCollectionDelete,
} from "./hooks/revalidate";

import { editorAccess, indexField, isDemoField } from "./fields";

/**
 * The areas of work — the nine that fill the homepage expertise browser.
 *
 * The browser renders whatever it is handed, but the layout was tuned so all
 * of them sit on one screen without scrolling: the photograph gives up height
 * on a short viewport rather than pushing the last row below the fold. Adding
 * a tenth is allowed and will still work; it is worth knowing that the fit was
 * designed around nine.
 */
export const Expertise: CollectionConfig = {
  slug: "expertise",
  hooks: {
    afterChange: [revalidateCollection("expertise")],
    afterDelete: [revalidateCollectionDelete("expertise")],
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["index", "title"],
    group: "Studio",
    description: "Ordered by index. Shown on the homepage and on /about.",
  },
  access: editorAccess,
  defaultSort: "index",
  fields: [
    { type: "row", fields: [indexField, { name: "title", type: "text", required: true }] },
    { name: "description", type: "textarea", required: true },
    { name: "image", type: "upload", relationTo: "media", required: true },
    isDemoField,
  ],
};
