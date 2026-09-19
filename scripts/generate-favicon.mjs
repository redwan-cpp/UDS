/**
 * Rebuild the favicon set from the studio's own mark, on brand paper.
 *
 * One-off, not part of the build. Run again only if `uthan-mark.svg` changes:
 *
 *   node scripts/generate-favicon.mjs
 *
 * Writes `src/app/favicon.ico` (multi-res, PNG-in-ICO — supported since
 * Windows Vista and every current browser, and far simpler than a BMP DIB
 * encoder) plus `src/app/icon.png` and `src/app/apple-icon.png`, which Next's
 * file convention picks up with no config. The previous favicon.ico was a
 * generic placeholder (black circle, white triangle) that predates the
 * studio's mark being drawn — not this project's artwork.
 */
import { writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

const MARK = path.resolve("public/brand/uthan-mark.svg");
const PAPER = "#f3f1e8"; // --color-paper, globals.css — the mark is drawn for a light ground.

/**
 * The mark composited onto a square paper tile, with breathing room.
 *
 * The mark's own viewBox (404×467) is taller than wide, so fitting it into a
 * square via `contain` pillarboxes left and right. `sharp`'s `resize` pads
 * that letterbox with **opaque black** by default rather than transparent —
 * undocumented behaviour, found by rendering the SVG alone (clean) and only
 * seeing bars once this resize was in the pipeline. An explicit transparent
 * background is what actually lets the paper tile show through underneath.
 */
async function tile(size, pad = 0.22) {
  const inner = Math.round(size * (1 - pad * 2));
  const mark = await sharp(MARK, { density: 1200 })
    .resize(inner, inner, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();
  return sharp({
    create: { width: size, height: size, channels: 4, background: PAPER },
  })
    .composite([{ input: mark, gravity: "centre" }])
    .png()
    .toBuffer();
}

/** Minimal ICO container: header + directory + raw PNG payloads. */
function packIco(pngs) {
  const count = pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);

  let offset = 6 + count * 16;
  const dir = Buffer.alloc(count * 16);
  const bodies = [];
  pngs.forEach(({ size, buf }, i) => {
    const e = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, e); // 0 means 256
    dir.writeUInt8(size >= 256 ? 0 : size, e + 1);
    dir.writeUInt8(0, e + 2); // no palette
    dir.writeUInt8(0, e + 3); // reserved
    dir.writeUInt16LE(1, e + 4); // colour planes
    dir.writeUInt16LE(32, e + 6); // bits per pixel
    dir.writeUInt32LE(buf.length, e + 8);
    dir.writeUInt32LE(offset, e + 12);
    offset += buf.length;
    bodies.push(buf);
  });
  return Buffer.concat([header, dir, ...bodies]);
}

const sizes = [16, 32, 48, 64];
const pngs = await Promise.all(sizes.map(async (size) => ({ size, buf: await tile(size, size <= 32 ? 0.14 : 0.2) })));
await writeFile("src/app/favicon.ico", packIco(pngs));

await writeFile("src/app/icon.png", await tile(512, 0.24));
// Apple wants a fully opaque square, no transparency — already the case here
// since the tile always paints the paper background first.
await writeFile("src/app/apple-icon.png", await tile(180, 0.2));

console.log("favicon.ico (16/32/48/64), icon.png (512), apple-icon.png (180) written.");
