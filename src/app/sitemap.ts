import type { MetadataRoute } from "next";

import {
  getKnowledgeSlugs,
  getNewsSlugs,
  getProductSlugs,
} from "@/data/content.cms";
import { getProjectSlugs } from "@/data/projects.cms";
import { SITE_URL } from "@/lib/share";

/**
 * `sitemap.xml`, generated at request time from the same accessors every
 * route already reads. Every project slug listed here is one the site would
 * otherwise only surface through the (paginated, client-filtered) `/projects`
 * index — a crawler, or an AI system building an index of what a studio has
 * built, has no other way to enumerate them.
 *
 * `getProjectSlugs` already filters to projects with a written-up case study
 * (`memory.md`'s "an empty description is what marks a card"), so a
 * card-only project — which has no page of its own — is correctly left out.
 *
 * No `lastModified`: the slug accessors run at `depth: 0` for exactly this
 * query and do not carry `updatedAt`, and fetching every full document just
 * to date-stamp a sitemap would be a heavier query for a field search engines
 * treat as an optional hint, not a requirement.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL || "https://uthandesignstudio.com";

  const [projects, products, news, knowledge] = await Promise.all([
    getProjectSlugs(),
    getProductSlugs(),
    getNewsSlugs(),
    getKnowledgeSlugs(),
  ]);

  const url = (path: string): string => new URL(path, base).toString();

  const staticRoutes: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/about", priority: 0.8 },
    { path: "/projects", priority: 0.9 },
    { path: "/products", priority: 0.7 },
    { path: "/sustainability", priority: 0.6 },
    { path: "/news", priority: 0.7 },
    { path: "/knowledge", priority: 0.6 },
    { path: "/contact", priority: 0.7 },
    { path: "/careers", priority: 0.4 },
  ];

  return [
    ...staticRoutes.map(({ path, priority }) => ({ url: url(path), priority })),
    ...projects.map((slug) => ({ url: url(`/projects/${slug}`), priority: 0.8 })),
    ...products.map((slug) => ({ url: url(`/products/${slug}`), priority: 0.6 })),
    ...news.map((slug) => ({ url: url(`/news/${slug}`), priority: 0.5 })),
    ...knowledge.map((slug) => ({ url: url(`/knowledge/${slug}`), priority: 0.5 })),
  ];
}
