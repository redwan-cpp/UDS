/**
 * Demo media sourcing — Wikimedia Commons, restricted to CC0 / Public Domain.
 *
 * Phase 1 development tool. Downloads clearly-licensed demo media into
 * public/media and records full provenance in public/media/CREDITS.json.
 *
 * These assets are DEMO CONTENT. They are not Uthan Design Studio's work and
 * must be replaced with the studio's own photography before production.
 *
 * Commons is used over Openverse because it needs no API key, has workable
 * anonymous rate limits, and indexes video as well as stills.
 *
 * Usage: node scripts/fetch-media.mjs [key ...]
 */

import { mkdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "media");
const API = "https://commons.wikimedia.org/w/api.php";
const UA = "UthanDesignStudioDev/1.0 (Phase 1 demo asset sourcing)";

/**
 * Licences we accept.
 *
 * CC0 and Public Domain are preferred and are the only licences used for the
 * hero. Commons has comparatively little CC0 contemporary architecture, so
 * attributed Creative Commons licences are accepted for gallery and secondary
 * imagery — every one of them is recorded in CREDITS.json and surfaced in the
 * UI through the Figure component's caption, which is what those licences ask
 * for. All of it is demo content and is replaced before production.
 */
const FREE =
  /^(cc0|public domain|pd|no restrictions|cc pdm|cc by[ -]?(sa)?[ -]?[0-9])/i;

/** Stricter set for the hero, where no credit line is displayed. */
const HERO_ONLY = /^(cc0|public domain|pd|no restrictions|cc pdm)/i;

/**
 * Short queries beat long ones here. Commons search ANDs every term, so
 * "minimalist concrete interior room" matched almost nothing while
 * "modern building interior" returns a deep, well-licensed pool.
 */
const SLOTS = [
  { key: "hero", q: "brutalist concrete building facade", n: 4, min: 1600, type: "bitmap" },
  { key: "about", q: "concrete staircase modernist interior", n: 4, min: 1400, type: "bitmap" },
  { key: "expertise", q: "modernist architecture building", n: 12, min: 1200, type: "bitmap" },
  { key: "project", q: "modern house architecture", n: 14, min: 1400, type: "bitmap" },
  { key: "interior", q: "modern building interior", n: 14, min: 1200, type: "bitmap" },
  { key: "detail", q: "architectural detail", n: 12, min: 1200, type: "bitmap" },
  { key: "urban", q: "city architecture building", n: 10, min: 1400, type: "bitmap" },
  { key: "process", q: "architectural drawing plan elevation", n: 10, min: 1200, type: "bitmap" },
  { key: "product", q: "wooden door", n: 8, min: 900, type: "bitmap" },
  { key: "metal", q: "metal facade building", n: 8, min: 900, type: "bitmap" },
  { key: "news", q: "museum gallery interior", n: 10, min: 1200, type: "bitmap" },
  { key: "sustain", q: "timber building architecture", n: 10, min: 1200, type: "bitmap" },
  { key: "concrete", q: "concrete texture", n: 8, min: 1200, type: "bitmap" },
  { key: "video", q: "building timelapse", n: 4, min: 0, type: "video" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Commons throttles anonymous clients hard: serialise, pace, and back off. */
let lastCall = 0;
async function api(params, attempt = 0) {
  const gap = Date.now() - lastCall;
  if (gap < 1100) await sleep(1100 - gap);
  lastCall = Date.now();

  const url = new URL(API);
  for (const [k, v] of Object.entries({ format: "json", origin: "*", ...params })) {
    url.searchParams.set(k, String(v));
  }

  let res;
  try {
    res = await fetch(url, { headers: { "User-Agent": UA } });
  } catch (err) {
    if (attempt >= 5) throw err;
    await sleep(5000 * 2 ** attempt);
    return api(params, attempt + 1);
  }

  if (res.status === 429 || res.status >= 500) {
    if (attempt >= 6) throw new Error(`Commons ${res.status} after retries`);
    const wait = Math.min(90_000, 5000 * 2 ** attempt);
    console.log(`    ... ${res.status}, backing off ${wait / 1000}s`);
    await sleep(wait);
    return api(params, attempt + 1);
  }
  if (!res.ok) throw new Error(`Commons ${res.status}`);
  return res.json();
}

/** Pages through search results so each slot has a deep enough candidate pool
 *  to survive the licence filter, which rejects most Commons architecture. */
async function search(q, type, pages = 3) {
  const filetype = type === "video" ? "filetype:video" : "filetype:bitmap";
  const titles = [];
  for (let page = 0; page < pages; page++) {
    const json = await api({
      action: "query",
      list: "search",
      srsearch: `${q} ${filetype}`,
      srnamespace: 6,
      srlimit: 50,
      sroffset: page * 50,
    });
    const batch = (json.query?.search ?? []).map((r) => r.title);
    titles.push(...batch);
    if (batch.length < 50) break;
  }
  return titles;
}

async function details(titles) {
  const out = [];
  for (let i = 0; i < titles.length; i += 20) {
    const json = await api({
      action: "query",
      titles: titles.slice(i, i + 20).join("|"),
      prop: "imageinfo",
      iiprop: "url|extmetadata|size|mime",
      iiurlwidth: 2000,
    });
    for (const page of Object.values(json.query?.pages ?? {})) {
      const info = page.imageinfo?.[0];
      if (info) out.push({ title: page.title, info });
    }
    await sleep(400);
  }
  return out;
}

function meta(info, field) {
  const raw = info.extmetadata?.[field]?.value;
  if (!raw) return null;
  return String(raw)
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
  if (!res.ok) throw new Error(`download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 30_000) throw new Error("too small");
  await writeFile(dest, buf);
  return buf.length;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const creditsPath = path.join(OUT, "CREDITS.json");
  const credits = existsSync(creditsPath)
    ? JSON.parse(await readFile(creditsPath, "utf8"))
    : {};

  const only = process.argv.slice(2);
  const slots = only.length ? SLOTS.filter((s) => only.includes(s.key)) : SLOTS;

  for (const slot of slots) {
    let saved = 0;
    let titles;
    try {
      titles = await search(slot.q, slot.type);
    } catch (err) {
      console.error(`  ! search failed for ${slot.key}: ${err.message}`);
      continue;
    }

    const items = await details(titles);

    for (const { title, info } of items) {
      if (saved >= slot.n) break;

      const licence = meta(info, "LicenseShortName") ?? "";
      const allowed = slot.key === "hero" ? HERO_ONLY : FREE;
      if (!allowed.test(licence)) continue;
      if (slot.type === "bitmap" && (info.width ?? 0) < slot.min) continue;

      const isVideo = slot.type === "video";
      const ext = isVideo ? (info.mime?.includes("ogg") ? "ogv" : "webm") : "jpg";
      const name = `${slot.key}-${String(saved + 1).padStart(2, "0")}.${ext}`;
      const dest = path.join(OUT, name);

      if (existsSync(dest) && credits[name]) {
        saved++;
        continue;
      }

      // Bitmaps: take the 2400px derivative, not the multi-megabyte original.
      const src = isVideo ? info.url : (info.thumburl ?? info.url);
      try {
        const bytes = await download(src, dest);
        credits[name] = {
          title: title.replace(/^File:/, ""),
          creator: meta(info, "Artist"),
          licence,
          licenceUrl: info.extmetadata?.LicenseUrl?.value ?? null,
          source: info.descriptionurl ?? null,
          provider: "Wikimedia Commons",
          width: isVideo ? info.width : (info.thumbwidth ?? info.width),
          height: isVideo ? info.height : (info.thumbheight ?? info.height),
          mime: info.mime,
          bytes,
          query: slot.q,
        };
        saved++;
        console.log(
          `  + ${name.padEnd(16)} ${(bytes / 1024).toFixed(0).padStart(6)}kB  ${licence.padEnd(16)} ${(meta(info, "Artist") ?? "unknown").slice(0, 40)}`,
        );
      } catch {
        /* unreachable or undersized asset — try the next candidate */
      }
      await sleep(400);
    }
    console.log(`${slot.key}: ${saved}/${slot.n}\n`);
    // Checkpoint after every slot so a rate-limit stall never loses progress.
    await writeFile(creditsPath, JSON.stringify(credits, null, 2) + "\n");
    await sleep(3000);
  }

  await writeFile(creditsPath, JSON.stringify(credits, null, 2) + "\n");
  console.log(`Wrote ${Object.keys(credits).length} entries to ${creditsPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
