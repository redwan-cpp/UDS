import type { Metadata } from "next";

import { pageMetadata } from "@/lib/share";

import { PageHero, DemoNotice } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { CategoryFilter, readCategory } from "@/components/ui/CategoryFilter";
import { WorkIndex } from "@/components/projects/WorkIndex";
import { navIndex } from "@/data/navigation";
import { heroCopy } from "@/data/copy";
import { getProjects } from "@/data/projects.cms";
import {
  getCategoryFilters,
  getVisibleCategorySlugs,
} from "@/data/content.cms";


export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description:
    "The full index of work by Uthan Design Studio, filterable by category. Selected projects are documented in full.",
  path: "/projects",
});

/**
 * Projects — one index for all the work.
 *
 * This used to be two routes: `/projects` for the six documented case studies
 * and `/portfolio` for the full index of everything built. They were two
 * different answers to the same question, and the split forced a visitor to
 * guess which page held the thing they were looking for — while the six case
 * studies appeared on both. `/portfolio` now redirects here.
 *
 * It was also two *collections* for longer than it was two routes: a portfolio
 * entry was the card, a project was the case study, and a piece of work that
 * was both had to be entered twice and kept in step by hand. They have since
 * merged into `projects`. Everything the studio has built is one document; the
 * ones somebody has written up carry a description, and those are the ones
 * that link through.
 *
 * Filtering stays URL-driven rather than client state, so a filtered view is
 * linkable, crawlable and ships no JavaScript.
 */
export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [all, filters, visible] = await Promise.all([
    getProjects(),
    getCategoryFilters("project"),
    getVisibleCategorySlugs("project"),
  ]);
  const active = readCategory(category, filters);
  // Matching happens here rather than in a helper over a static array: the
  // visible set is now a studio decision, so "Other" has to be computed
  // against what they actually chose to show.
  const items =
    active === "all"
      ? all
      : active === "other"
        ? all.filter((i) => !i.category.some((c) => visible.includes(c.slug)))
        : all.filter((i) => i.category.some((c) => c.slug === active));
  const documented = items.filter((item) => item.description?.length).length;

  return (
    <>
      <PageHero
        index={navIndex("/projects")}
        eyebrow={heroCopy["/projects"].eyebrow}
        title={heroCopy["/projects"].title}
        intro={heroCopy["/projects"].intro}
        aside={
          <DemoNotice>
            Every project shown here is placeholder content created for design
            review. None of it is the studio&rsquo;s work.
          </DemoNotice>
        }
      />

      <Section
        surface="dark"
        spacing="none"
        className="pb-24 md:pb-32"
        labelledBy="work-index-heading"
      >
        <Container>
          {/* The card titles are h3. Without this the document jumped h1 → h3,
              which is a heading level a screen-reader user has to step over
              wondering what they missed. */}
          <h2 id="work-index-heading" className="sr-only">
            Index of work
          </h2>

          <div className="flex flex-col gap-4 border-b border-hairline pb-3 md:flex-row md:items-baseline md:justify-between md:gap-8">
            <CategoryFilter
              filters={filters.map((f) => ({
                value: f.value,
                label: f.label,
                count:
                  f.value === "all"
                    ? all.length
                    : f.value === "other"
                      ? all.filter(
                          (i) => !i.category.some((c) => visible.includes(c.slug)),
                        ).length
                      : all.filter((i) =>
                          i.category.some((c) => c.slug === f.value),
                        ).length,
              }))}
              active={active}
              basePath="/projects"
              label="Filter work by category"
            />
            <p
              aria-live="polite"
              className="shrink-0 pb-3 text-meta uppercase text-secondary"
            >
              <span data-numeric>{items.length}</span>{" "}
              {items.length === 1 ? "project" : "projects"}
              {documented > 0 && (
                <>
                  {" · "}
                  <span data-numeric>{documented}</span> documented
                </>
              )}
            </p>
          </div>

          <div className="pt-14">
            <WorkIndex items={items} />
          </div>
        </Container>
      </Section>
    </>
  );
}
