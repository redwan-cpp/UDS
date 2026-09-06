/**
 * Load the existing content into the CMS.
 *
 * Phase 1 built every content type as a typed array in `src/data/**`, and Phase
 * 2 modelled the same types as Payload collections. This is the bridge: it
 * reads the arrays and writes them through Payload's Local API, so the panel
 * holds the site's real content instead of being an empty shape.
 *
 * Local API, not HTTP — server-side, against the config directly, with no
 * request and no login. Access control is bypassed by design there, which is
 * appropriate for a migration and is exactly why this is a script rather than
 * something the admin panel offers.
 *
 * **Idempotent.** Every document is matched on its natural key (`slug`, or the
 * name for the collections that have none) and updated if it already exists.
 * Running it twice does not produce two of everything, which matters because
 * the first run of a seed is almost never the last.
 *
 *   npx payload run scripts/seed.ts
 */
import path from "path";
import fs from "fs";

import { getPayload } from "payload";
import type { Where } from "payload";
import config from "@payload-config";

import { getProjects } from "@/data/projects";
import { getPortfolio } from "@/data/portfolio";
import { getProducts } from "@/data/products";
import { getNews } from "@/data/news";
import { getSustainabilityPrinciples } from "@/data/sustainability";
import { team } from "@/data/team";
import { expertise } from "@/data/expertise";
import { statistics } from "@/data/statistics";
import { brands } from "@/data/brands";
import { openings } from "@/data/careers";
import { studio } from "@/data/studio";
import { navigation } from "@/data/navigation";
import {
  homeCopy,
  heroCopy,
  sectionCopy,
  footerCopy,
  actionCopy,
} from "@/data/copy";
import type { MediaAsset } from "@/types/content";

const payload = await getPayload({ config });

/* ---------------------------------------------------------------- media --- */

/**
 * Every asset is uploaded once and reused.
 *
 * The same photograph appears in several places with different alt text — the
 * media helper authors alt per *use*, which is right for the site and wrong for
 * a library, where one file is one row. The first alt encountered wins and the
 * rest are dropped; per-use alt is a thing the site will need to reintroduce at
 * the render layer once it reads from here.
 */
// Numbers, not `string | number`. Payload types an id as either because an
// adapter may use text keys; the SQLite adapter this project runs on uses
// integers, and narrowing here is what lets an uploaded id satisfy the
// generated relationship types without an `any` at every call site.
const uploaded = new Map<string, number>();

async function upload(asset: MediaAsset | undefined) {
  if (!asset?.src) return undefined;
  const cached = uploaded.get(asset.src);
  if (cached !== undefined) return cached;

  const filePath = path.join(process.cwd(), "public", asset.src);
  if (!fs.existsSync(filePath)) {
    console.warn(`  ! missing file, skipped: ${asset.src}`);
    return undefined;
  }

  // Ask the database, not just the in-memory map. The map only dedupes within
  // a single run, which made the content idempotent while media was not: a
  // second run re-uploaded all 35 files and the library grew by 35 every time.
  // Measured, not theorised — 60 rows became 95 on the second pass.
  const filename = path.basename(asset.src);
  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  });
  if (existing.docs.length) {
    uploaded.set(asset.src, Number(existing.docs[0].id));
    return Number(existing.docs[0].id);
  }

  const doc = await payload.create({
    collection: "media",
    filePath,
    data: {
      alt: asset.alt || " ",
      caption: asset.caption,
      credit: asset.credit,
      source: asset.source,
      licence: asset.licence,
      focal: asset.focal ? { x: asset.focal.x, y: asset.focal.y } : undefined,
    },
  });
  uploaded.set(asset.src, Number(doc.id));
  return Number(doc.id);
}

const uploadMany = async (assets: MediaAsset[] = []) => {
  const ids: number[] = [];
  for (const a of assets) {
    const id = await upload(a);
    if (id !== undefined) ids.push(id);
  }
  return ids;
};

/* --------------------------------------------------------------- shapes --- */

/** `string[]` -> the array-of-objects Payload stores it as. */
const paras = (v: string[] = []) => v.map((text) => ({ text }));
const values = (v: string[] = []) => v.map((value) => ({ value }));

/* --------------------------------------------------------------- upsert --- */

/**
 * Create, or update the existing document with the same natural key.
 *
 * Matching on `slug` where there is one and on a named field otherwise. An `id`
 * from the source data is deliberately NOT used: those are demo identifiers
 * like "b1", and Payload owns its own ids.
 */
async function upsert(
  collection: string,
  where: Where,
  data: Record<string, unknown>,
) {
  const existing = await payload.find({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    collection: collection as any,
    where,
    limit: 1,
    depth: 0,
  });

  if (existing.docs.length) {
    await payload.update({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      collection: collection as any,
      id: existing.docs[0].id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: data as any,
    });
    return "updated";
  }

  await payload.create({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    collection: collection as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: data as any,
  });
  return "created";
}

const tally: Record<string, number> = {};
const note = (c: string) => {
  tally[c] = (tally[c] ?? 0) + 1;
};

/* ---------------------------------------------------------------- seed ---- */

console.log("\nSeeding from src/data …\n");

for (const p of getProjects()) {
  await upsert(
    "projects",
    { slug: { equals: p.slug } },
    {
      title: p.title,
      slug: p.slug,
      location: p.location,
      year: p.year,
      category: p.category,
      status: p.status,
      summary: p.summary,
      description: paras(p.description),
      uniqueness: paras(p.uniqueness),
      concept: paras(p.concept),
      area: p.area,
      client: p.client,
      services: values(p.services),
      facts: p.facts,
      symbol: p.symbol
        ? { asset: await upload(p.symbol.asset), label: p.symbol.label }
        : undefined,
      hero: await upload(p.hero),
      gallery: await uploadMany(p.gallery),
      process: await uploadMany(p.process),
      featured: p.featured,
      order: p.order,
      isDemo: p.isDemo,
      _status: "published",
    },
  );
  note("projects");
}

for (const item of getPortfolio()) {
  await upsert(
    "portfolio",
    { slug: { equals: item.slug } },
    {
      title: item.title,
      slug: item.slug,
      location: item.location,
      year: item.year,
      category: item.category,
      areaSize: item.areaSize,
      summary: item.summary,
      image: await upload(item.image),
      projectSlug: item.projectSlug,
      symbol: item.symbol
        ? { asset: await upload(item.symbol.asset), label: item.symbol.label }
        : undefined,
      isDemo: item.isDemo,
    },
  );
  note("portfolio");
}

for (const p of getProducts()) {
  await upsert(
    "products",
    { slug: { equals: p.slug } },
    {
      title: p.title,
      slug: p.slug,
      category: p.category,
      summary: p.summary,
      description: paras(p.description),
      materials: values(p.materials),
      applications: values(p.applications),
      specs: p.specs,
      hero: await upload(p.hero),
      gallery: await uploadMany(p.gallery),
      order: p.order,
      isDemo: p.isDemo,
      _status: "published",
    },
  );
  note("products");
}

for (const n of getNews()) {
  await upsert(
    "news",
    { slug: { equals: n.slug } },
    {
      title: n.title,
      slug: n.slug,
      kind: n.kind,
      date: n.date,
      organisation: n.organisation,
      location: n.location,
      summary: n.summary,
      body: paras(n.body),
      image: await upload(n.image),
      gallery: await uploadMany(n.gallery),
      documents: n.documents,
      featured: n.featured,
      isDemo: n.isDemo,
      _status: "published",
    },
  );
  note("news");
}

for (const m of team) {
  await upsert(
    "team",
    { slug: { equals: m.slug } },
    {
      name: m.name,
      slug: m.slug,
      role: m.role,
      bio: m.bio,
      detail: m.detail,
      portrait: await upload(m.portrait),
      linkedin: m.linkedin,
      order: m.order,
      isDemo: m.isDemo,
    },
  );
  note("team");
}

for (const a of expertise) {
  await upsert(
    "expertise",
    { title: { equals: a.title } },
    {
      index: a.index,
      title: a.title,
      description: a.description,
      image: await upload(a.image),
      isDemo: a.isDemo,
    },
  );
  note("expertise");
}

for (const p of getSustainabilityPrinciples()) {
  await upsert(
    "sustainability",
    { title: { equals: p.title } },
    {
      index: p.index,
      title: p.title,
      description: p.description,
      measures: values(p.measures),
      image: await upload(p.image),
      isDemo: p.isDemo,
    },
  );
  note("sustainability");
}

for (const [i, s] of statistics.entries()) {
  await upsert(
    "statistics",
    { label: { equals: s.label } },
    {
      label: s.label,
      value: s.value,
      prefix: s.prefix,
      suffix: s.suffix,
      order: i,
      isDemo: s.isDemo,
    },
  );
  note("statistics");
}

for (const [i, b] of brands.entries()) {
  await upsert(
    "brands",
    { name: { equals: b.name } },
    {
      name: b.name,
      relationship: b.relationship,
      logo: await upload(b.logo),
      order: i,
      isDemo: b.isDemo,
    },
  );
  note("brands");
}

for (const o of openings) {
  await upsert(
    "careers",
    { title: { equals: o.title } },
    {
      index: o.index,
      title: o.title,
      discipline: o.discipline,
      commitment: o.commitment,
      summary: o.summary,
      requirements: values(o.requirements),
      _status: "published",
    },
  );
  note("careers");
}

/* -------------------------------------------------------------- globals --- */

await payload.updateGlobal({
  slug: "studio",
  data: {
    name: studio.name,
    tagline: studio.tagline,
    disciplines: values(studio.disciplines),
    services: studio.services,
    statement: paras(studio.statement),
    approach: paras(studio.approach),
    closing: studio.closing,
    contact: {
      email: studio.contact.email,
      phone: studio.contact.phone,
      addressLines: values(studio.contact.addressLines),
      hours: studio.contact.hours,
      coordinates: studio.contact.coordinates,
      mapEmbedUrl: studio.contact.mapEmbedUrl,
    },
    social: studio.social,
    legal: studio.legal,
  },
});
note("globals");

await payload.updateGlobal({
  slug: "navigation",
  data: {
    items: await Promise.all(
      navigation.map(async (n) => ({
        index: n.index,
        label: n.label,
        href: n.href,
        // `null`, not `undefined`: the generated type allows an absent image
        // as null, and undefined is not in that union.
        image: (await upload(n.image)) ?? null,
      })),
    ),
  },
});
note("globals");

await payload.updateGlobal({
  slug: "copy",
  data: {
    home: homeCopy,
    heroes: Object.entries(heroCopy).map(([route, v]) => ({ route, ...v })),
    sections: Object.entries(sectionCopy).map(([key, v]) => ({ key, ...v })),
    footer: footerCopy,
    actions: actionCopy,
  },
});
note("globals");

/* --------------------------------------------------------------- report --- */

console.log("\nseeded");
console.log("--------------------------");
for (const [k, v] of Object.entries(tally)) {
  console.log(`${k.padEnd(18)}${String(v).padStart(6)}`);
}
console.log(`${"media files".padEnd(18)}${String(uploaded.size).padStart(6)}`);
console.log("--------------------------\n");

process.exit(0);
