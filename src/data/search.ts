/* =============================================================================
   SEARCH INDEX

   Flattened from the typed content that already exists. Nothing here is a
   second copy of the content — every field is read from the same modules the
   pages render from, so a search result cannot drift out of sync with the page
   it points at.

   Read from the CMS through the same accessors the pages use, so something an
   editor publishes is searchable on the next render. The shape it returns
   (`SearchEntry[]`) is what the UI consumes.
   ============================================================================= */

import type { SearchEntry } from "@/types/content";

import { getProjects } from "./projects.cms";
import {
  getExpertise,
  getNavigation,
  getNews,
  getOpenings,
  getProducts,
  getStudio,
} from "./content.cms";
import { newsKindLabels } from "./news";
import { statusLabels } from "@/lib/labels";

/**
 * Short descriptions for the routes that are pages rather than content
 * entries. Written here because they describe what the page is *for*, which is
 * a search concern — the pages themselves already say it at length.
 */
const PAGE_SUMMARIES: Record<string, string> = {
  "/about": "The practice, its people, and how it works.",
  "/projects": "Every project the studio has built, filterable by category.",
  "/products": "Custom doors and fabricated sheet work.",
  "/sustainability": "How the studio approaches material, energy and reuse.",
  "/news": "Collaborations, exhibitions and announcements.",
  "/contact": "Start a conversation with the studio.",
  "/careers": "Open roles at the studio.",
};

export async function getSearchIndex(): Promise<SearchEntry[]> {
  const [navigation, projects, products, news, expertise, openings, studio] =
    await Promise.all([
      getNavigation(),
      getProjects(),
      getProducts(),
      getNews(),
      getExpertise(),
      getOpenings(),
      getStudio(),
    ]);
  const entries: SearchEntry[] = [];

  /**
   * Extra matchable terms per page. Someone searching the studio's city or
   * "address" is looking for the contact page, and would otherwise be told
   * nothing matches while the address sits on a page one click away.
   */
  const PAGE_KEYWORDS: Record<string, string[]> = {
    "/contact": [
      ...studio.contact.addressLines,
      "address",
      "location",
      "map",
      "directions",
      "email",
      "phone",
      "enquiry",
    ],
    "/about": ["studio", "team", "people", "practice"],
    "/news": ["collaboration", "press", "exhibition", "award"],
  };

  for (const item of navigation) {
    entries.push({
      id: `page:${item.href}`,
      title: item.label,
      kind: "page",
      href: item.href,
      summary: PAGE_SUMMARIES[item.href],
      keywords: PAGE_KEYWORDS[item.href],
    });
  }

  entries.push({
    id: "page:/careers",
    title: "Careers",
    kind: "page",
    href: "/careers",
    summary: PAGE_SUMMARIES["/careers"],
    keywords: ["jobs", "hiring", "vacancies", "work with us"],
  });

  // One loop, because there is one collection now. Projects and portfolio
  // entries used to be indexed separately, with a guard to stop work that was
  // both appearing twice under the same name.
  //
  // A written-up project points at its own page. One that is only a card has
  // no page, so it points at the index filtered to its first category — an
  // item in several still needs one destination, and the first is the one the
  // editor put first.
  for (const project of projects) {
    const documented = Boolean(project.description?.length);
    entries.push({
      id: `project:${project.slug}`,
      title: project.title,
      kind: "project",
      href: documented
        ? `/projects/${project.slug}`
        : project.category.length
          ? `/projects?category=${project.category[0].slug}`
          : "/projects",
      summary: project.summary,
      keywords: [
        project.location,
        project.year,
        ...(project.area ? [project.area] : []),
        ...project.category.map((c) => c.label),
        statusLabels[project.status],
        ...(project.services ?? []),
      ],
    });
  }

  for (const product of products) {
    entries.push({
      id: `product:${product.slug}`,
      title: product.title,
      kind: "product",
      href: `/products/${product.slug}`,
      summary: product.summary,
      keywords: [...product.materials, ...product.applications],
    });
  }

  for (const item of news) {
    entries.push({
      id: `news:${item.slug}`,
      title: item.title,
      kind: "news",
      href: `/news/${item.slug}`,
      summary: item.summary,
      keywords: [
        newsKindLabels[item.kind],
        item.organisation ?? "",
        item.location ?? "",
      ].filter(Boolean),
    });
  }

  for (const area of expertise) {
    entries.push({
      id: `expertise:${area.id}`,
      title: area.title,
      kind: "expertise",
      href: "/about#expertise",
      summary: area.description,
    });
  }

  for (const role of openings) {
    entries.push({
      id: `role:${role.index}`,
      title: role.title,
      kind: "role",
      href: "/careers",
      summary: role.summary,
      keywords: [role.discipline, role.commitment, "job", "career", "hiring"],
    });
  }

  return entries;
}
