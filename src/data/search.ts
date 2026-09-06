/* =============================================================================
   SEARCH INDEX

   Flattened from the typed content that already exists. Nothing here is a
   second copy of the content — every field is read from the same modules the
   pages render from, so a search result cannot drift out of sync with the page
   it points at.

   In Phase 2 this becomes a CMS query. The shape it returns (`SearchEntry[]`)
   is what the UI consumes, so the swap is confined to this file.
   ============================================================================= */

import type { SearchEntry } from "@/types/content";

import { navigation } from "./navigation";
import { getProjects } from "./projects";
import { getPortfolio } from "./portfolio";
import { getProducts } from "./products";
import { getNews, newsKindLabels } from "./news";
import { expertise } from "./expertise";
import { openings } from "./careers";
import { studio } from "./studio";
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

export function getSearchIndex(): SearchEntry[] {
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

  for (const project of getProjects()) {
    entries.push({
      id: `project:${project.slug}`,
      title: project.title,
      kind: "project",
      href: `/projects/${project.slug}`,
      summary: project.summary,
      keywords: [
        project.location,
        project.year,
        ...project.category.map((c) => c.label),
        statusLabels[project.status],
        ...(project.services ?? []),
      ],
    });
  }

  // Portfolio entries that are not also case studies. The ones that are would
  // otherwise appear twice under the same name pointing at the same page.
  for (const item of getPortfolio()) {
    if (item.projectSlug) continue;
    entries.push({
      id: `work:${item.slug}`,
      title: item.title,
      kind: "project",
      // An item in several categories still needs one destination; the
      // first is the one the editor put first.
      href: item.category.length
        ? `/projects?category=${item.category[0].slug}`
        : "/projects",
      summary: item.summary,
      keywords: [
        item.location,
        item.year,
        item.areaSize,
        ...item.category.map((c) => c.label),
      ],
    });
  }

  for (const product of getProducts()) {
    entries.push({
      id: `product:${product.slug}`,
      title: product.title,
      kind: "product",
      href: "/products",
      summary: product.summary,
      keywords: [...product.materials, ...product.applications],
    });
  }

  for (const item of getNews()) {
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
