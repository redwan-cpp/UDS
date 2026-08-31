/**
 * Transcode a supplied hero video into web-safe derivatives.
 *
 * The site never ships a raw camera/export file directly — phone and camera
 * exports arrive as HEVC in a QuickTime container, often 15-30MB for a few
 * seconds of footage, with an audio track the muted hero never plays. This
 * produces the two derivatives BackgroundVideo actually serves, plus a poster
 * frame extracted from the video itself so the static fallback and the video's
 * real first frame are the same image — see the note in src/data/hero.ts on
 * why that match matters.
 *
 * Requires `ffmpeg-static` (dev dependency) and `sharp` (already a dependency
 * for the photo pipeline). Neither ships to production; this is dev tooling.
 *
 * The source file is never written into public/ — anything there is publicly
 * downloadable as-is, which defeats the point of transcoding a 30MB+ export
 * down to a 2MB derivative. Keep raw masters in the gitignored media-source/
 * directory at the project root.
 *
 * Usage:
 *   node scripts/transcode-hero.mjs media-source/hero.mov [--at <seconds>]
 *
 * Writes:
 *   public/media/hero-loop.webm         VP9, ~2MB for a 15s loop
 *   public/media/hero-loop.mp4          H.264 fallback, ~2.3MB
 *   public/media/hero-loop-poster.jpg   poster frame, optimised like the rest
 *                                       of the photo library (2400px cap, q82)
 *
 * Then update the `sources` and `poster` in src/data/hero.ts to match.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";
import sharp from "sharp";

const run = promisify(execFile);

const OUT = path.join(process.cwd(), "public", "media");
const TARGET_WIDTH = 1920;

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : fallback;
}

async function main() {
  const source = process.argv[2];
  if (!source || source.startsWith("--")) {
    console.error("Usage: node scripts/transcode-hero.mjs <source-file> [--at <seconds>]");
    process.exit(1);
  }
  const posterAt = arg("--at", "1.0");

  await mkdir(OUT, { recursive: true });

  const webm = path.join(OUT, "hero-loop.webm");
  const mp4 = path.join(OUT, "hero-loop.mp4");
  const posterRaw = path.join(OUT, "hero-loop-poster.raw.png");
  const poster = path.join(OUT, "hero-loop-poster.jpg");

  console.log("Encoding WebM (VP9)...");
  await run(ffmpegPath, [
    "-y", "-i", source,
    "-vf", `scale=${TARGET_WIDTH}:-2`, "-r", "30",
    "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "34",
    "-deadline", "good", "-cpu-used", "2",
    "-an",
    webm,
  ]);

  console.log("Encoding MP4 (H.264)...");
  await run(ffmpegPath, [
    "-y", "-i", source,
    "-vf", `scale=${TARGET_WIDTH}:-2`, "-r", "30",
    "-c:v", "libx264", "-preset", "slow", "-crf", "26",
    "-profile:v", "high", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    "-an",
    mp4,
  ]);

  console.log(`Extracting poster at t=${posterAt}s...`);
  await run(ffmpegPath, ["-y", "-ss", posterAt, "-i", source, "-frames:v", "1", "-q:v", "1", posterRaw]);

  const raw = sharp(posterRaw, { failOn: "none" });
  const meta = await raw.metadata();
  const width = Math.min(meta.width ?? TARGET_WIDTH, 2400);
  await raw
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality: 82, progressive: true, mozjpeg: true })
    .toFile(poster);
  await unlink(posterRaw);

  const posterMeta = await sharp(poster).metadata();
  const { statSync } = await import("node:fs");
  const sizes = [webm, mp4, poster].map((f) => `${path.basename(f)}: ${(statSync(f).size / 1e6).toFixed(2)}MB`);

  console.log("\nDone:");
  sizes.forEach((s) => console.log("  " + s));
  console.log(
    `\nPoster dimensions: ${posterMeta.width}×${posterMeta.height} — update src/data/hero.ts if these changed.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
