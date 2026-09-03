import Link from "next/link";

import { countPortfolio, portfolioFilters } from "@/data/portfolio";
import type { ProjectCategory } from "@/types/content";

/**
 * Portfolio filtering.
 *
 * Built as real links rather than as client-side state. That gets three things
 * at once: the filtered view is linkable and shareable, every filter is
 * crawlable so the whole portfolio is reachable without JavaScript, and the
 * page ships no client bundle for this at all.
 *
 * The active state is carried by weight, a drawn rule and `aria-current` —
 * never by colour alone.
 */
export function PortfolioFilter({
  active,
  basePath = "/projects",
}: {
  active: ProjectCategory | "all";
  /** The route the filter links back into. */
  basePath?: string;
}) {
  return (
    <nav aria-label="Filter work by category">
      <ul className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
        {portfolioFilters.map((filter) => {
          const current = filter.value === active;
          const href =
            filter.value === "all"
              ? basePath
              : `${basePath}?category=${filter.value}`;
          const count = countPortfolio(filter.value);

          return (
            <li key={filter.value}>
              <Link
                href={href}
                aria-current={current ? "true" : undefined}
                className={[
                  "group/filter relative inline-flex items-baseline gap-2 py-1 text-meta uppercase transition-colors duration-[var(--dur-fast)]",
                  current ? "text-accent" : "text-secondary hover:text-current",
                ].join(" ")}
              >
                <span className={current ? "font-semibold" : ""}>{filter.label}</span>
                <span data-numeric className="opacity-60">
                  {count}
                </span>
                <span
                  aria-hidden="true"
                  className={[
                    "absolute -bottom-0.5 left-0 block h-px w-full origin-left bg-accent transition-transform duration-[var(--dur-base)] ease-out-soft motion-reduce:transition-none",
                    current
                      ? "scale-x-100"
                      : "scale-x-0 group-hover/filter:scale-x-100 group-focus-visible/filter:scale-x-100",
                  ].join(" ")}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
