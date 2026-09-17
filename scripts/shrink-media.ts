/**
 * Shrink media uploaded before `Media` capped originals at 2560px wide.
 *
 * Rewrites each oversized file in place — same filename, same URL — so nothing
 * that references it changes. The thumbnail/card/wide derivatives were already
 * cut from the original and stay as they are. Run `backup.sh` first: the
 * full-size originals are replaced, not kept.
 *
 *   npx payload run scripts/shrink-media.ts
 */
import { rename } from "fs/promises";
import path from "path";

import sharp from "sharp";
import { getPayload } from "payload";
import config from "@payload-config";

/** Same cap as `Media.upload.resizeOptions`. */
const MAX_WIDTH = 2560;
const RESIZABLE = ["image/jpeg", "image/png", "image/webp", "image/tiff", "image/avif"];

const payload = await getPayload({ config });
const staticDir = payload.collections.media.config.upload.staticDir;
if (!staticDir) throw new Error("media has no staticDir — is MEDIA_DIR set?");

const { docs } = await payload.find({ collection: "media", limit: 0, depth: 0, pagination: false });
let shrunk = 0;

for (const doc of docs) {
  if (!doc.filename || !RESIZABLE.includes(doc.mimeType ?? "")) continue;
  if ((doc.width ?? 0) <= MAX_WIDTH) continue;

  const file = path.join(staticDir, doc.filename);
  const temp = `${file}.shrinking`;
  // `rotate()` applies the EXIF orientation before it is stripped, as Payload
  // does on upload, so a portrait phone photo does not come out sideways.
  const { width, height, size } = await sharp(file)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .toFile(temp);
  await rename(temp, file);

  await payload.update({
    collection: "media",
    id: doc.id,
    data: { width, height, filesize: size },
  });
  console.log(`${doc.filename}: ${doc.width}x${doc.height} ${Math.round((doc.filesize ?? 0) / 1024)}KB -> ${width}x${height} ${Math.round(size / 1024)}KB`);
  shrunk++;
}

console.log(`\n${shrunk} of ${docs.length} media files shrunk.`);
process.exit(0);
