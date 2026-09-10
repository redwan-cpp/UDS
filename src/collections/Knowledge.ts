import type { CollectionConfig } from "payload";

import {
  revalidateCollection,
  revalidateCollectionDelete,
} from "./hooks/revalidate";
import {
  publishedOnlyAccess,
  isDemoField,
  paragraphs,
  seoGroup,
  slugField,
} from "./fields";

/**
 * Knowledge — the studio's own writing.
 *
 * Its own collection rather than a `kind` on News, and that is a content
 * decision rather than a modelling convenience. They are different things with
 * different pages: News is what happened, Knowledge is what the studio thinks,
 * and the studio asked for both in the index as separate entries. Folding them
 * into one collection would mean every list on the site filtering by a field,
 * and one wrong option in a dropdown putting an essay in the announcements
 * feed.
 *
 * It carries the same shape as a news item minus the three fields a written
 * piece has no use for — the counterparty, the event location, and the attached
 * MoU. Sharing that shape is deliberate: it is what lets `/knowledge` reuse the
 * news cards and the article layout without a second set of components.
 */
export const Knowledge: CollectionConfig = {
  slug: "knowledge",
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateCollection("knowledge")],
    afterDelete: [revalidateCollectionDelete("knowledge")],
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "date", "featured"],
    group: "Studio",
    description:
      "Written pieces — the studio's own thinking, rather than announcements. Shown at /knowledge.",
  },
  access: publishedOnlyAccess,
  fields: [
    {
      type: "row",
      fields: [
        { name: "title", type: "text", required: true },
        slugField("/knowledge"),
      ],
    },
    {
      name: "date",
      type: "date",
      required: true,
      admin: { date: { pickerAppearance: "dayOnly" } },
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
      admin: {
        description:
          "One line. Used on cards, in the index, and as the description on the card someone sees when this is shared to Facebook or LinkedIn.",
      },
    },
    paragraphs("body", { required: true }),
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: {
        description:
          "Also the picture on the social share card. Required for that reason — a shared link with no image is a grey box nobody clicks.",
      },
    },
    { name: "gallery", type: "upload", relationTo: "media", hasMany: true },
    {
      type: "row",
      fields: [
        {
          name: "featured",
          type: "checkbox",
          defaultValue: false,
          admin: { description: "Lead the Knowledge index with this piece." },
        },
        isDemoField,
      ],
    },
    seoGroup,
  ],
};
