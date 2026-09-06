import type { CollectionConfig } from "payload";

/**
 * The media library.
 *
 * Shaped to satisfy `MediaAsset` in `src/types/content.ts` rather than
 * Payload's defaults, because that type is the contract the whole site already
 * renders against — `architecture.md` §2.5 calls it the CMS contract, and this
 * is the collection that has to honour it.
 *
 * **`alt` is required, and that is a decision rather than an oversight.** The
 * site's rule is that decorative images take `alt=""` and meaningful ones
 * describe what they show; leaving the field optional in the CMS makes the
 * common case an empty database column and the accessible name silently
 * missing. Requiring it forces the editor to answer the question once, and an
 * empty string is a legitimate answer they have to type on purpose.
 *
 * Derivative sizes match `next.config.ts`'s `imageSizes`/`deviceSizes` so the
 * optimizer is never asked to resize past what the source can fill.
 */
export const Media: CollectionConfig = {
  slug: "media",
  admin: { group: "Library" },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === "admin",
  },
  upload: {
    // Kept out of `public/`. Anything under `public/` is served verbatim, which
    // is the rule the raw video masters already follow (see CLAUDE.md) — an
    // uploaded 30MB original should never be publicly fetchable at full size.
    staticDir: "media",
    mimeTypes: ["image/*"],
    imageSizes: [
      { name: "thumbnail", width: 384, height: undefined, position: "centre" },
      { name: "card", width: 1080, height: undefined, position: "centre" },
      { name: "wide", width: 1920, height: undefined, position: "centre" },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description:
          'What the image shows, for someone who cannot see it. If it is purely decorative and the surrounding text already says everything, type a single space — an empty alt is a real answer, but it has to be a deliberate one.',
      },
    },
    {
      name: "caption",
      type: "text",
      admin: { description: "Printed under the image where the layout shows one." },
    },
    {
      name: "credit",
      type: "text",
      admin: { description: "Photographer or studio, where one is owed." },
    },
    {
      name: "source",
      type: "text",
      admin: { description: "Where the file came from. Required for licensed media." },
    },
    {
      name: "licence",
      type: "text",
      admin: { description: "e.g. CC BY-SA 4.0. Leave blank for the studio's own work." },
    },
    {
      // `MediaAsset.focal` — 0–1 in each axis. Payload has its own focal point
      // UI, but the site reads this shape, so it is stored explicitly.
      name: "focal",
      type: "group",
      admin: {
        description:
          "Focal point for art-directed crops. Leave blank to centre.",
      },
      fields: [
        { name: "x", type: "number", min: 0, max: 1 },
        { name: "y", type: "number", min: 0, max: 1 },
      ],
    },
  ],
};
