/**
 * Demo media sourcing, second pass — Commons *curated* categories.
 *
 * Why this replaced free-text search: `list=search` returns whatever matches
 * the words, which on Commons means mostly amateur documentation photography.
 * A contact-sheet review of the first pass showed banal apartment blocks,
 * parked motorcycles and an estate agent's board — unusable for a studio whose
 * entire proposition is art direction.
 *
 * Commons maintains peer-reviewed quality tiers (Featured pictures, Quality
 * images). Pulling from those categories instead raises the floor enormously.
 *
 * This script only builds a POOL. It does not decide what the site uses —
 * every asset is reviewed on a contact sheet and assigned to a slot by hand in
 * `src/data/media.curation.ts`. Sourcing is automated; curation is not.
 *
 * Usage: node scripts/fetch-curated.mjs [group ...]
 */

import { mkdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "media", "pool");
const API = "https://commons.wikimedia.org/w/api.php";
const UA = "UthanDesignStudioDev/1.0 (Phase 1 demo asset sourcing)";

const FREE =
  /^(cc0|public domain|pd|no restrictions|cc pdm|cc by[ -]?(sa)?[ -]?[0-9])/i;

/**
 * Each group draws from peer-reviewed Commons categories.
 * `depth: 1` walks one level of subcategories; deeper than that drifts
 * off-topic fast (architecture → roads → vehicles).
 */
const GROUPS = [
  {
    key: "arch",
    n: 24,
    min: 1600,
    depth: 0,
    cats: [
      "Category:Featured pictures of architecture",
      "Category:Featured pictures of buildings",
      "Category:Quality images of architecture",
    ],
  },
  {
    key: "int",
    n: 20,
    min: 1400,
    depth: 0,
    cats: [
      "Category:Featured pictures of building interiors",
      "Category:Featured pictures of libraries",
      "Category:Featured pictures of museums",
      "Category:Featured pictures of concert halls",
      "Category:Featured pictures of railway stations",
    ],
  },
  {
    key: "elem",
    n: 14,
    min: 1200,
    depth: 0,
    cats: [
      "Category:Featured pictures of architectural elements",
      "Category:Quality images of architectural elements",
      "Category:Quality images of facades",
    ],
  },
  {
    key: "stair",
    n: 10,
    min: 1200,
    depth: 0,
    cats: ["Category:Quality images of stairs"],
  },
  {
    key: "door",
    n: 12,
    min: 1000,
    depth: 0,
    cats: ["Category:Quality images of doors", "Category:Quality images of portals"],
  },
  {
    key: "city",
    n: 10,
    min: 1600,
    depth: 0,
    cats: [
      "Category:Featured pictures of cityscapes",
      "Category:Quality images of cityscapes",
    ],
  },
  {
    key: "ind",
    n: 10,
    min: 1400,
    depth: 0,
    cats: ["Category:Featured pictures of industry buildings"],
  },
  {
    key: "win",
    n: 8,
    min: 1200,
    depth: 0,
    cats: ["Category:Quality images of windows"],
  },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let lastCall = 0;
async function api(params, attempt = 0) {
  const gap = Date.now() - lastCall;
  if (gap < 2200) await sleep(2200 - gap);
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

async function members(category, type) {
  const json = await api({
    action: "query",
    list: "categorymembers",
    cmtitle: category,
    cmtype: type,
    cmlimit: 500,
  });
  return (json.query?.categorymembers ?? []).map((m) => m.title);
}

/** Collect file titles from a category, optionally one level of subcategories. */
async function collect(cats, depth) {
  const titles = new Set();
  const queue = [...cats];
  const seen = new Set();

  for (let level = 0; level <= depth; level++) {
    const next = [];
    for (const cat of queue) {
      if (seen.has(cat)) continue;
      seen.add(cat);
      try {
        for (const f of await members(cat, "file")) titles.add(f);
        if (level < depth) {
          for (const sub of await members(cat, "subcat")) {
            // "by user" / "by country" indexes explode the tree for no gain.
            if (/ by (user|country|year|date)/i.test(sub)) continue;
            next.push(sub);
          }
        }
      } catch (err) {
        console.error(`    ! ${cat}: ${err.message}`);
      }
    }
    queue.length = 0;
    queue.push(...next);
  }
  return [...titles];
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
  }
  return out;
}

function meta(info, field) {
  const raw = info.extmetadata?.[field]?.value;
  if (!raw) return null;
  return String(raw).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
  if (!res.ok) throw new Error(`download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 40_000) throw new Error("too small");
  await writeFile(dest, buf);
  return buf.length;
}

/** Deterministic shuffle so a re-run picks the same sample, not a new one. */
function shuffle(arr, seed = 7) {
  let s = seed;
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) % 2147483648;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const creditsPath = path.join(OUT, "CREDITS.json");
  const credits = existsSync(creditsPath)
    ? JSON.parse(await readFile(creditsPath, "utf8"))
    : {};

  const only = process.argv.slice(2);
  const groups = only.length ? GROUPS.filter((g) => only.includes(g.key)) : GROUPS;

  for (const group of groups) {
    console.log(`\n## ${group.key}`);
    const titles = await collect(group.cats, group.depth);
    console.log(`   ${titles.length} candidates`);

    const items = await details(shuffle(titles).slice(0, group.n * 4));
    let saved = 0;

    for (const { title, info } of items) {
      if (saved >= group.n) break;

      const licence = meta(info, "LicenseShortName") ?? "";
      if (!FREE.test(licence)) continue;
      if ((info.width ?? 0) < group.min) continue;
      // Skip near-square and extreme panoramas; neither crops well here.
      const ratio = (info.width ?? 1) / (info.height ?? 1);
      if (ratio > 3.2 || ratio < 0.45) continue;

      const name = `${group.key}-${String(saved + 1).padStart(2, "0")}.jpg`;
      const dest = path.join(OUT, name);
      if (existsSync(dest) && credits[name]) {
        saved++;
        continue;
      }

      try {
        const bytes = await download(info.thumburl ?? info.url, dest);
        credits[name] = {
          title: title.replace(/^File:/, ""),
          creator: meta(info, "Artist"),
          licence,
          licenceUrl: info.extmetadata?.LicenseUrl?.value ?? null,
          source: info.descriptionurl ?? null,
          provider: "Wikimedia Commons",
          width: info.thumbwidth ?? info.width,
          height: info.thumbheight ?? info.height,
          bytes,
        };
        saved++;
        console.log(`   + ${name}  ${(bytes / 1024).toFixed(0)}kB  ${licence}`);
      } catch {
        /* try the next candidate */
      }
      await sleep(250);
    }

    console.log(`   ${group.key}: ${saved}/${group.n}`);
    await writeFile(creditsPath, JSON.stringify(credits, null, 2) + "\n");
    await sleep(2000);
  }

  console.log(`\nPool: ${Object.keys(credits).length} assets in ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
