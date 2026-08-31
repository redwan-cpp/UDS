/**
 * Demo media post-processing.
 *
 * Two jobs, in order:
 *   1. Downscale and re-encode everything Commons gave us. Originals arrive at
 *      2000px and several megabytes; the site never needs more than 2400px and
 *      quality 82, and the repository should not carry 300MB of demo assets.
 *   2. Emit `src/data/media.generated.ts` with the REAL post-optimisation
 *      dimensions, so `MediaAsset.width/height` can never drift from the file
 *      on disk — which is what structurally prevents layout shift.
 *
 * Usage: node scripts/process-media.mjs
 */

import { readdir, readFile, writeFile, rename, unlink, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "media");
const DIRS = [
  { dir: ROOT, prefix: "" },
  { dir: path.join(ROOT, "pool"), prefix: "pool/" },
];
const OUT = path.join(process.cwd(), "src", "data", "media.generated.ts");
const MAX_WIDTH = 2400;
const QUALITY = 82;

async function optimise(dir, file) {
  const full = path.join(dir, file);
  const tmp = `${full}.tmp`;

  const image = sharp(full, { failOn: "none" });
  const meta = await image.metadata();
  const width = Math.min(meta.width ?? MAX_WIDTH, MAX_WIDTH);

  await image
    .rotate() // honour EXIF orientation before stripping it
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
    .toFile(tmp);

  await unlink(full);
  await rename(tmp, full);

  const after = await sharp(full).metadata();
  return { width: after.width, height: after.height };
}

async function main() {
  const assets = {};
  let before = 0;
  let after = 0;

  for (const { dir, prefix } of DIRS) {
    const creditsPath = path.join(dir, "CREDITS.json");
    let credits;
    try {
      credits = JSON.parse(await readFile(creditsPath, "utf8"));
    } catch {
      continue;
    }

    const files = (await readdir(dir)).filter((f) => /\.jpe?g$/i.test(f)).sort();

    for (const file of files) {
      const entry = credits[file];
      if (!entry) {
        console.warn(`  ! ${prefix}${file} has no CREDITS entry — skipped`);
        continue;
      }
      before += entry.bytes ?? 0;

      // Idempotent: re-encoding an already-optimised JPEG loses quality each
      // pass, so a processed file is measured but never touched again.
      let dims;
      if (entry.optimised) {
        const m = await sharp(path.join(dir, file)).metadata();
        dims = { width: m.width, height: m.height };
      } else {
        dims = await optimise(dir, file);
        entry.optimised = true;
      }
      const { size } = await stat(path.join(dir, file));
      after += size;

      const id = `${prefix}${file}`.replace(/\.jpe?g$/i, "");
      assets[id] = {
        src: `/media/${prefix}${file}`,
        width: dims.width,
        height: dims.height,
        credit: entry.creator,
        licence: entry.licence,
        source: entry.source,
      };
    }

    await writeFile(creditsPath, JSON.stringify(credits, null, 2) + "\n");
  }

  const body = `/* =============================================================================
   GENERATED FILE — DO NOT EDIT BY HAND
   Produced by scripts/process-media.mjs from the CREDITS.json files under
   public/media.

   DEMO CONTENT. Every asset below is licensed demo media sourced from Wikimedia
   Commons, not work by Uthan Design Studio. Dimensions are read back from the
   optimised files on disk, so they always match reality.

   This is the raw library. Which asset appears where is decided by hand in
   src/data/media.curation.ts — sourcing is automated, curation is not.
   ============================================================================= */

export interface RawAsset {
  src: string;
  width: number;
  height: number;
  credit: string | null;
  licence: string | null;
  source: string | null;
}

export const LIBRARY = ${JSON.stringify(assets, null, 2)} as const satisfies Record<string, RawAsset>;

export type AssetId = keyof typeof LIBRARY;
`;

  await writeFile(OUT, body);

  const count = Object.keys(assets).length;
  console.log(
    `
${count} assets · ${(before / 1e6).toFixed(1)}MB → ${(after / 1e6).toFixed(1)}MB`,
  );
  console.log(`Wrote ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
