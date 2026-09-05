import type { Metadata } from "next";

import { PageHero, DemoNotice } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { CategoryFilter, readCategory } from "@/components/ui/CategoryFilter";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import {
  countPortfolio,
  filterPortfolio,
  getPortfolio,
  portfolioFilters,
} from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "The full index of work by Uthan Design Studio, filterable by category. Selected projects are documented in full.",
};

/**
 * Projects — one index for all the work.
 *
 * This used to be two routes: `/projects` for the six documented case studies
 * and `/portfolio` for the full index of everything built. They were two
 * different answers to the same question, and the split forced a visitor to
 * guess which page held the thing they were looking for — while the six case
 * studies appeared on both.
 *
 * The portfolio data was already a superset (it carried every case study plus
 * the work without one), so the merge is that superset shown once, with a
 * case-study link where a case study exists. `/portfolio` now redirects here.
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
  const active = readCategory(category, portfolioFilters);
  const items = filterPortfolio(getPortfolio(), active);
  const documented = items.filter((item) => item.projectSlug).length;

  return (
    <>
      <PageHero
        index="02"
        eyebrow="Selected work"
        title="Projects"
        intro="Everything the studio has built. The projects documented at length — the thinking, the drawings, and what happened on site — link through to their full case study."
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
              filters={portfolioFilters.map((f) => ({
                value: f.value,
                label: f.label,
                count: countPortfolio(f.value),
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
            <PortfolioGrid items={items} />
          </div>
        </Container>
      </Section>
    </>
  );
}
