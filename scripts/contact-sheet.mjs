/**
 * Build a labelled contact sheet of the demo media library.
 *
 * Art direction is the point of this project, and a search API returns whatever
 * matches the words — not whatever suits the work. This makes the whole library
 * reviewable at a glance so weak frames can be culled rather than shipped.
 *
 * Usage: node scripts/contact-sheet.mjs [slot ...]
 * Output: .review/contact-sheet-N.png
 */

import { readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const args = process.argv.slice(2);
const POOL = args.includes("--pool");
const MEDIA = POOL
  ? path.join(process.cwd(), "public", "media", "pool")
  : path.join(process.cwd(), "public", "media");
const OUT = path.join(process.cwd(), ".review");

const COLS = 5;
const ROWS_PER_SHEET = 4;
const CELL_W = 320;
const CELL_H = 210;
const LABEL_H = 26;
const PAD = 8;

const TILE_W = CELL_W + PAD * 2;
const TILE_H = CELL_H + LABEL_H + PAD * 2;

function escapeXml(s) {
  return s.replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c],
  );
}

async function buildSheet(files, index) {
  const rows = Math.ceil(files.length / COLS);
  const width = TILE_W * COLS;
  const height = TILE_H * rows;

  const composites = [];
  const labels = [];

  for (const [i, file] of files.entries()) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = col * TILE_W + PAD;
    const y = row * TILE_H + PAD;

    const buf = await sharp(path.join(MEDIA, file))
      .resize(CELL_W, CELL_H, { fit: "cover", position: "attention" })
      .jpeg({ quality: 74 })
      .toBuffer();

    composites.push({ input: buf, left: x, top: y });
    labels.push(
      `<text x="${x}" y="${y + CELL_H + 17}" font-family="monospace" font-size="14" fill="#b7d77a">${escapeXml(file.replace(".jpg", ""))}</text>`,
    );
  }

  const overlay = Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${labels.join("")}</svg>`,
  );

  const out = path.join(OUT, `sheet-${index}.png`);
  await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 10, g: 10, b: 10 },
    },
  })
    .composite([...composites, { input: overlay, left: 0, top: 0 }])
    .png({ compressionLevel: 9 })
    .toFile(out);

  return out;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const only = args.filter((a) => !a.startsWith("--"));

  let files = (await readdir(MEDIA)).filter((f) => /\.jpe?g$/i.test(f)).sort();
  if (only.length) {
    files = files.filter((f) => only.some((s) => f.startsWith(`${s}-`)));
  }

  const perSheet = COLS * ROWS_PER_SHEET;
  const written = [];
  for (let i = 0; i < files.length; i += perSheet) {
    written.push(await buildSheet(files.slice(i, i + perSheet), `${POOL ? "pool" : "media"}-${written.length + 1}`));
  }

  await writeFile(
    path.join(OUT, "README.md"),
    "Review artefacts. Not part of the site.\nRegenerate: `node scripts/contact-sheet.mjs`\n",
  );

  console.log(`${files.length} files across ${written.length} sheet(s):`);
  written.forEach((w) => console.log(`  ${w}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
