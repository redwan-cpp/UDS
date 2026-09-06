import { cache } from "react";

import type { Project } from "@/types/content";
import {
  client,
  toAsset,
  toAssets,
  toParagraphs,
  toRows,
  toSymbol,
  toValues,
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
  return {
    id: String(d.id),
    slug: d.slug,
    isDemo: Boolean(d.isDemo),
    title: d.title,
    location: d.location,
    category: d.category,
    year: d.year,
    status: d.status,
    summary: d.summary,
    description: toParagraphs(d.description),
    uniqueness: toParagraphs(d.uniqueness).length
      ? toParagraphs(d.uniqueness)
      : undefined,
    concept: toParagraphs(d.concept).length ? toParagraphs(d.concept) : undefined,
    area: d.area ?? undefined,
    client: d.client ?? undefined,
    services: toValues(d.services).length ? toValues(d.services) : undefined,
    facts: toRows(d.facts),
    symbol: toSymbol(d.symbol),
    hero: toAsset(d.hero),
    gallery: toAssets(d.gallery),
    process: toAssets(d.process).length ? toAssets(d.process) : undefined,
    featured: Boolean(d.featured),
    order: d.order ?? 0,
  };
}

export const getProjects = cache(async (): Promise<Project[]> => {
  const payload = await client();
  const { docs } = await payload.find({
    collection: "projects",
    limit: 200,
    depth: 1,
    sort: "order",
  });
  return docs.map(toProject);
});

export const getProjectBySlug = cache(
  async (slug: string): Promise<Project | undefined> => {
    const payload = await client();
    const { docs } = await payload.find({
      collection: "projects",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
    });
    return docs.length ? toProject(docs[0]) : undefined;
  },
);

/**
 * Slugs for `generateStaticParams`.
 *
 * `depth: 0` here on purpose — this needs nothing but the slug, and asking for
 * populated media on every project at build time would fetch the entire library
 * to throw it away.
 */
export const getProjectSlugs = cache(async (): Promise<string[]> => {
  const payload = await client();
  const { docs } = await payload.find({
    collection: "projects",
    limit: 200,
    depth: 0,
    sort: "order",
  });
  return docs.map((d) => (d as Doc).slug as string);
});

/**
 * Related work: same category first, then anything else, so a project page
 * always closes with somewhere to go even in a thin category.
 */
export const getRelatedProjects = cache(
  async (slug: string, limit = 3): Promise<Project[]> => {
    const all = await getProjects();
    const current = all.find((p) => p.slug === slug);
    if (!current) return all.slice(0, limit);

    const others = all.filter((p) => p.slug !== slug);
    const sameCategory = others.filter((p) => p.category === current.category);
    const rest = others.filter((p) => p.category !== current.category);

    return [...sameCategory, ...rest].slice(0, limit);
  },
);
