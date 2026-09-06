import type { CollectionConfig } from "payload";

import {
  revalidateCollection,
  revalidateCollectionDelete,
} from "./hooks/revalidate";

import { publishedOnlyAccess, indexField, stringList } from "./fields";

/**
 * Open roles.
 *
 * `commitment` is a phrase like "Full time" and deliberately not a salary or a
 * closing date — the type says so, and it is worth keeping. A stale closing
 * date on a careers page is worse than none, and a salary the studio has not
 * agreed to publish is a commitment made by the website rather than by the
 * studio.
 *
 * Drafts are on so a role can be unpublished when it closes rather than
 * deleted, which keeps the posting for reference without leaving it live.
 */
export const Careers: CollectionConfig = {
  slug: "careers",
  hooks: {
    afterChange: [revalidateCollection("careers")],
    afterDelete: [revalidateCollectionDelete("careers")],
  },
  // Autosave, because losing typing is the complaint that makes people stop
  // trusting a CMS. Payload only offers autosave on a drafts-enabled
  // collection, so drafts are on everywhere rather than on the four that
  // happened to have them — a consistent rule beats a remembered exception.
  // The interval is short: it is saving a row of a form, not a document.
  versions: { drafts: { autosave: { interval: 800 } } },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["index", "title", "discipline", "commitment"],
    group: "Studio",
    description: "Open roles. Unpublish rather than delete when a role closes.",
  },
  access: publishedOnlyAccess,
  defaultSort: "index",
  fields: [
    {
      type: "row",
      fields: [indexField, { name: "title", type: "text", required: true }],
    },
    {
      type: "row",
      fields: [
        { name: "discipline", type: "text", required: true },
        {
          name: "commitment",
          type: "text",
          required: true,
          admin: {
            description: "Such as Full time. Not a salary, not a closing date.",
          },
        },
      ],
    },
    { name: "summary", type: "textarea", required: true },
    stringList("requirements", {
      singular: "Requirement",
      plural: "Requirements",
      required: true,
    }),
  ],
};
