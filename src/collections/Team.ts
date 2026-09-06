import type { CollectionConfig } from "payload";

import { editorAccess, isDemoField, orderField, seoGroup, slugField } from "./fields";

/**
 * The people.
 *
 * `bio` and `detail` are kept apart on purpose, and the reason is a layout
 * decision rather than a data one: the card is meant to stay scannable in a
 * grid of four, and the expanded view is meant to be worth opening. The same
 * paragraph in both places makes clicking through pointless, so `bio` is one
 * sentence for the card and `detail` is the longer read behind it.
 *
 * `linkedin` is optional and stays empty for demo people. A guessed profile URL
 * either 404s or lands on a real stranger who happens to share an invented
 * name — `ruler.md` forbids dead links, and this is the case where the honest
 * move is no link at all. The "View profile" overlay renders only when it is
 * set.
 */
export const Team: CollectionConfig = {
  slug: "team",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "order"],
    group: "Studio",
  },
  access: editorAccess,
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "role", type: "text", required: true },
      ],
    },
    slugField("/about"),
    {
      name: "bio",
      type: "textarea",
      admin: { description: "One sentence. Shown on the card at rest." },
    },
    {
      name: "detail",
      type: "textarea",
      admin: {
        description:
          "The longer read, shown only when the card is opened. Do not repeat the bio here — if both say the same thing, opening the card gains nothing.",
      },
    },
    { name: "portrait", type: "upload", relationTo: "media", required: true },
    {
      name: "linkedin",
      type: "text",
      admin: {
        description:
          "Full profile URL. Leave empty rather than guessing — an unsupplied link renders as plain text, never as a link that goes nowhere.",
      },
    },
    { type: "row", fields: [orderField, isDemoField] },
    seoGroup,
  ],
};
