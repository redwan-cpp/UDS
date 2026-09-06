import type { GlobalConfig } from "payload";

import { revalidateEverything } from "../collections/hooks/revalidate";

/**
 * The site index.
 *
 * **This is where the site's numbering is decided.** Every page hero reads its
 * number from the matching entry here rather than carrying its own, so
 * renumbering the menu renumbers the pages with it. That is deliberate: the
 * numbers used to be literals on each route and they drifted twice — a nav item
 * was removed, the menu resequenced, and four page heroes went on showing a
 * number one higher than the menu the visitor had just clicked.
 *
 * So reordering here is a real edit with a visible effect, and the `index`
 * values are meant to be renumbered as a set when an item is added or removed.
 */
export const Navigation: GlobalConfig = {
  slug: "navigation",
  hooks: { afterChange: [revalidateEverything] },
  admin: {
    group: "Settings",
    description:
      "The menu, and the source of the site's page numbering. Renumber the whole set when adding or removing an item — a gap here shows up on the pages.",
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "items",
      type: "array",
      required: true,
      minRows: 1,
      labels: { singular: "Menu item", plural: "Menu items" },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "index",
              type: "text",
              required: true,
              admin: { description: 'Two digits, e.g. "01".' },
            },
            { name: "label", type: "text", required: true },
            {
              name: "href",
              type: "text",
              required: true,
              admin: { description: "The route, e.g. /projects." },
            },
          ],
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          admin: {
            description:
              "Shown in the desktop menu overlay on hover. Decorative — the panel is hidden from assistive technology, so this only has to feel right, not describe the destination.",
          },
        },
      ],
    },
  ],
};
