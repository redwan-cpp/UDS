import { cache } from "react";

import type { Project } from "@/types/content";
import {
  client,
  toAsset,
  toAssets,
  toCategories,
  toRichParagraphs,
  toSeo,
  toRows,
  toSymbol,
  toValues,
  toVideos,
} from "./payload";

/**
 * Projects, read from the CMS.
 *
 * The accessor signatures are the ones `architecture.md` §2.5 committed to,
 * with the bodies now async and the return types unmoved — so every route and
 * component keeps receiving `Project` and none of them knows where it came
 * from. That promise is the reason this swap is a new file and a set of
 * `await`s rather than a rewrite of the site.
 *
 * **Drafts are excluded by the access rules, not by a query here.** An
 * unauthenticated read only ever sees published documents (see
 * `publishedOnlyAccess`), which means this file cannot accidentally publish a
 * draft by forgetting a filter — the boundary is enforced one layer down.
 *
 * `depth: 1` is deliberate and load-bearing: media relationships have to come
 * back populated or `toAsset` returns the empty asset and every image on the
 * site disappears. It is one level, not more, because nothing here follows a
 * relationship through a second hop.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
type Doc = any;

function toProject(d: Doc): Project {
  const gallery = toAssets(d.gallery);
  const process = toAssets(d.process);
  const videos = toVideos(d.videos);

  return {
    id: String(d.id),
    slug: d.slug,
    seo: toSeo(d.seo),
    isDemo: Boolean(d.isDemo),
    title: d.title,
    location: d.location,
    category: toCategories(d.category),
    year: d.year,
    status: d.status,
    summary: d.summary,
    // Undefined rather than an empty array when nothing has been written:
    // "does this have a case study" is read off this field, and `[]` and
    // `undefined` answer that question differently in a truthiness test.
    description: toRichParagraphs(d.description).length
      ? toRichParagraphs(d.description)
      : undefined,
    uniqueness: toRichParagraphs(d.uniqueness).length
      ? toRichParagraphs(d.uniqueness)
      : undefined,
    concept: toRichParagraphs(d.concept).length
      ? toRichParagraphs(d.concept)
      : undefined,
    area: d.area ?? undefined,
    client: d.client ?? undefined,
    services: toValues(d.services).length ? toValues(d.services) : undefined,
    facts: toRows(d.facts).length ? toRows(d.facts) : undefined,
    symbol: toSymbol(d.symbol),
    hero: toAsset(d.hero),
    gallery: gallery.length ? gallery : undefined,
    process: process.length ? process : undefined,
    videos: videos.length ? videos : undefined,
    featured: Boolean(d.featured),
    order: d.order ?? 0,
  };
}

export const getProjects = cache(async (): Promise<Project[]> => {
  const payload = await client();
  const { docs } = await payload.find({
    collection: "projects",
    // Drafts stay in the panel — see the note on `find` in content.cms.ts.
    overrideAccess: false,
    limit: 200,
    depth: 1,
    sort: "order",
  });
  // A doc with no slug can't be linked to — building `/projects/${slug}` from
  // one produces a real, crawlable `/projects/null` or `/projects/undefined`.
  // Payload's `required: true` only guards the save path, not documents that
  // predate it or ever got there another way, so this is checked here rather
  // than trusted from the schema.
  return docs.filter((d) => Boolean((d as Doc).slug)).map(toProject);
});

export const getProjectBySlug = cache(
  async (slug: string): Promise<Project | undefined> => {
    const payload = await client();
    const { docs } = await payload.find({
      collection: "projects",
      // Drafts stay in the panel — see the note on `find` in content.cms.ts.
      overrideAccess: false,
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
    });
    return docs.length ? toProject(docs[0]) : undefined;
  },
);

/**
 * Slugs for `generateStaticParams` — the written-up projects only.
 *
 * Not every project has a case study. Since `portfolio` merged into this
 * collection, the index also carries work that is a card and nothing more, and
 * building a page for one of those would publish a URL with a hero and no
 * content beneath it. The detail route refuses the same set (`notFound`), so
 * what gets built and what can be reached agree.
 *
 * `depth: 0` here on purpose — this needs the slug and whether anything is
 * written, and asking for populated media on every project at build time would
 * fetch the entire library to throw it away.
 */
export const getProjectSlugs = cache(async (): Promise<string[]> => {
  const payload = await client();
  const { docs } = await payload.find({
    collection: "projects",
    // Drafts stay in the panel — see the note on `find` in content.cms.ts.
    overrideAccess: false,
    limit: 200,
    depth: 0,
    sort: "order",
  });
  return docs
    .filter(
      (d) => Boolean((d as Doc).slug) && ((d as Doc).description?.length ?? 0) > 0,
    )
    .map((d) => (d as Doc).slug as string);
});

/**
 * Related work: same category first, then anything else, so a project page
 * always closes with somewhere to go even in a thin category.
 */
export const getRelatedProjects = cache(
  async (slug: string, limit = 3): Promise<Project[]> => {
    // Written-up projects only. These render as links, and a card-only project
    // has no page to link to — it would be a dead end dressed as a next step.
    const all = (await getProjects()).filter((p) => p.description?.length);
    const current = all.find((p) => p.slug === slug);
    if (!current) return all.slice(0, limit);

    const others = all.filter((p) => p.slug !== slug);
    // Shares any category, not all of them — an item in several should still
    // surface under each.
    const slugs = new Set(current.category.map((c) => c.slug));
    const sameCategory = others.filter((p) => p.category.some((c) => slugs.has(c.slug)));
    const rest = others.filter((p) => !p.category.some((c) => slugs.has(c.slug)));

    return [...sameCategory, ...rest].slice(0, limit);
  },
);
