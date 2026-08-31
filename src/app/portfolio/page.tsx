import type { Metadata } from "next";

import { PageHero, DemoNotice } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { PortfolioFilter } from "@/components/portfolio/PortfolioFilter";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { filterPortfolio, getPortfolio, portfolioFilters } from "@/data/portfolio";
import type { ProjectCategory } from "@/types/content";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "The full index of work by Uthan Design Studio, filterable by category.",
};

/** Anything not in the filter set falls back to "all" rather than an error. */
function readFilter(value: string | undefined): ProjectCategory | "all" {
  if (!value) return "all";
  const match = portfolioFilters.find((f) => f.value === value);
  return match ? match.value : "all";
}

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const active = readFilter(category);
  const items = filterPortfolio(getPortfolio(), active);

  return (
    <>
      <PageHero
        index="03"
        eyebrow="The full index"
        title="Portfolio"
        intro="Everything the studio has built, at a glance. Projects with a full case study link through to it."
        aside={
          <DemoNotice>
            Placeholder work created for design review — not the studio&rsquo;s
            projects.
          </DemoNotice>
        }
      />

      <Section surface="dark" spacing="none" className="pb-24 md:pb-32">
        <Container>
          <div className="flex flex-col gap-6 border-b border-hairline pb-6 md:flex-row md:items-baseline md:justify-between">
            <PortfolioFilter active={active} />
            <p aria-live="polite" className="text-meta uppercase text-secondary">
              <span data-numeric>{items.length}</span>{" "}
              {items.length === 1 ? "project" : "projects"}
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
