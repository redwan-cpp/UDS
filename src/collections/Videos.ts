import path from "path";

import type { CollectionConfig } from "payload";

import { revalidateMedia } from "./hooks/revalidate";

/**
 * Web-ready video. Separate from `Media`, and deliberately not clever.
 *
 * **The server does not transcode.** It would be the obvious thing to offer —
 * upload the camera file, let the machine sort it out — and it is the wrong
 * thing on this hardware. The VPS is two shared vCPUs: `next build` had to be
 * given 4GB of swap before it stopped being killed, and resizing photographs
 * saturated the CPU badly enough that a 957-byte script took three seconds to
 * serve. VP9 encoding is heavier than any of that, and it would run in the same
 * process that answers requests. A studio uploading a clip would take the site
 * down for the minutes it ran.
 *
 * So the pipeline stays where it already was: `scripts/transcode-hero.mjs`
 * turns a camera export into the pair of derivatives the site serves, on a
 * developer's machine, and what gets uploaded here is the finished article.
 * The size guard below is what stops that convention being an honour system —
 * a 33MB HEVC export is refused with an error that says what to do instead,
 * rather than quietly becoming the homepage.
 *
 * `MEDIA_DIR` for the same reason as Media: Next's standalone server calls
 * `process.chdir(__dirname)` on boot, so a relative path would resolve inside
 * the build output and every deploy would delete the studio's uploads.
 */

/** Refused above this. Comfortably above a transcoded hero, far below a master. */
const MAX_BYTES = 12 * 1024 * 1024;

export const Videos: CollectionConfig = {
  slug: "videos",
  hooks: {
    afterChange: [revalidateMedia],
    beforeValidate: [
      ({ req, data }) => {
        const size = req.file?.size;
        if (size && size > MAX_BYTES) {
          throw new Error(
            `That file is ${(size / 1024 / 1024).toFixed(1)}MB, and the limit is ` +
              `${MAX_BYTES / 1024 / 1024}MB. This collection takes web-ready video only — ` +
              `run it through scripts/transcode-hero.mjs first, or ask a developer to. ` +
              `Uploading a camera export directly would make the homepage unusable on a ` +
              `slow connection.`,
          );
        }
        return data;
      },
    ],
  },
  admin: {
    group: "Library",
    description:
      "Web-ready video only — WebM and MP4, already compressed. Not camera or phone exports.",
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === "admin",
  },
  upload: {
    staticDir: process.env.MEDIA_DIR
      ? path.join(process.env.MEDIA_DIR, "video")
      : path.resolve(process.cwd(), "media/video"),
    // VP9 in WebM, H.264 in MP4 — the two the hero element offers, in that
    // order. Anything else the browser would have to be lucky to decode.
    mimeTypes: ["video/webm", "video/mp4"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description:
          "What the footage shows. The hero video is decorative — the poster image beneath it carries the description — so a single space is a legitimate answer here, but type it on purpose.",
      },
    },
  ],
};
