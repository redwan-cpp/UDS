import path from "path";

import type { CollectionBeforeOperationHook, CollectionConfig } from "payload";

import { revalidateMedia } from "./hooks/revalidate";

/**
 * Strip the boilerplate design tools wrap around an SVG, before validation.
 *
 * Illustrator and CorelDRAW export every SVG with an XML prolog and a
 * `<!DOCTYPE>` — Illustrator's with an internal subset of `<!ENTITY>`
 * declarations. Payload's upload check does not recognise an XML file as an
 * SVG once a DOCTYPE is present, and refuses it as `application/xml`; a clean
 * SVG from Figma passes. So every logo the studio exported from Illustrator was
 * rejected, and the collaborator list quietly filled up with placeholder icons
 * instead. Reproduced locally before this was written: the Illustrator shape
 * and a plain-DOCTYPE shape both failed, Figma and Inkscape shapes passed.
 *
 * None of that boilerplate draws anything. Entity values are substituted where
 * the document uses them (Illustrator puts them in namespace attributes, which
 * would be broken references once the declarations are gone), then the prolog,
 * comments and DOCTYPE are removed.
 *
 * Payload's own security scan still runs afterwards on what is left, so an SVG
 * carrying a script is refused exactly as before — this removes a false
 * rejection, not a check. Dropping the DOCTYPE also removes the one place an
 * XML entity-expansion attack could live.
 */
const normaliseSvgUpload: CollectionBeforeOperationHook = ({ args, req }) => {
  const file = req.file;
  const isSvg =
    file?.mimetype === "image/svg+xml" || file?.name?.toLowerCase().endsWith(".svg");
  if (!file?.data?.length || !isSvg) return args;

  let svg = file.data.toString("utf8");

  const doctype = svg.match(/<!DOCTYPE[^[>]*(?:\[([\s\S]*?)\])?\s*>/i);
  if (doctype) {
    for (const [, name, , value] of (doctype[1] ?? "").matchAll(
      /<!ENTITY\s+([\w.-]+)\s+(["'])([\s\S]*?)\2\s*>/g,
    )) {
      svg = svg.split(`&${name};`).join(value);
    }
    svg = svg.replace(doctype[0], "");
  }

  svg = svg
    .replace(/<\?xml[\s\S]*?\?>/i, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();

  file.data = Buffer.from(svg, "utf8");
  file.size = file.data.length;
  file.mimetype = "image/svg+xml";
  return args;
};

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
  hooks: {
    beforeOperation: [normaliseSvgUpload],
    afterChange: [revalidateMedia],
  },
  admin: { group: "Library" },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === "admin",
  },
  upload: {
    // An absolute path, and that is not fussiness.
    //
    // Next's standalone server calls `process.chdir(__dirname)` on boot, so the
    // working directory becomes `.next/standalone` no matter where the process
    // was started or what systemd's `WorkingDirectory` says. A relative
    // `"media"` therefore resolves *inside the build output* in production —
    // where every deploy would delete the studio's uploaded photographs. Caught
    // by running the standalone build rather than by reading it.
    //
    // `MEDIA_DIR` is set in the server's `.env`; locally the default is right
    // because `next dev` does not move the working directory.
    //
    // Kept out of `public/` either way. Anything under `public/` is served
    // verbatim, which is the rule the raw video masters already follow (see
    // CLAUDE.md) — an uploaded 30MB original should never be publicly
    // fetchable at full size.
    staticDir: process.env.MEDIA_DIR || path.resolve(process.cwd(), "media"),
    mimeTypes: ["image/*"],
    // Payload defaults this to true whenever `imageSizes` is set, adding its
    // own focal-point picker. Turned off because the site never used it —
    // only the `cropPoint` field below, which the site's own accessor exposes
    // as `MediaAsset.focal`. Kept off even though it turned out not to be the
    // actual source of the column collision below: Payload's own upload
    // pipeline apparently writes a `focal_x`/`focal_y` pair regardless of this
    // flag whenever `imageSizes` is configured, which the flag's own
    // description does not suggest — the field was renamed instead of
    // relying further on undocumented internals.
    focalPoint: false,
    // Cap the stored original. Studios upload straight from cameras and
    // renderers — 7680×4320, 4–8MB — and every size the site requests is cut
    // from the original on a two-vCPU server: measured at 4–6s per image per
    // width, so a project page with a ten-image gallery timed out on phones.
    // Width only: the site requests images by width and never above 2048, so
    // 2560 keeps every size sharp, and a tall portrait keeps its full width.
    // Only raster formats go through this; SVG is untouched.
    // `scripts/shrink-media.ts` applies the same cap to files uploaded before.
    resizeOptions: { width: 2560, withoutEnlargement: true },
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
      // `MediaAsset.focal` — 0–1 in each axis. Named `cropPoint` rather than
      // `focal` on the Payload side specifically to avoid colliding with
      // whatever Payload's own upload pipeline calls it internally — see the
      // note on `focalPoint` above. The site-facing accessor still exposes
      // this as `MediaAsset.focal`; only the CMS-internal name changed.
      name: "cropPoint",
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
