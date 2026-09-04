import Link from "next/link";

export interface CategoryFilterOption {
  /** The query value. `"all"` links back to the bare route. */
  value: string;
  label: string;
  /** How many items this filter would show. */
  count: number;
}

/**
 * The category filter, shared by the project index and the product index.
 *
 * Built as real links rather than as client-side state. That gets three things
 * at once: the filtered view is linkable and shareable, every filter is
 * crawlable so the whole index is reachable without JavaScript, and the page
 * ships no client bundle for this at all.
 *
 * **One row, scrolled sideways, not wrapped.** A wrapping filter set is fine
 * at six categories and quietly stops working at sixteen: it grows downward,
 * pushes the results it is supposed to be filtering off the screen, and turns
 * the top of the page into a wall of options. A single scrolling row stays one
 * line tall whatever the studio adds later. The scrollbar is deliberately
 * *kept* and themed (`.uds-scroll-x`) rather than hidden — a row that scrolls
 * with no visible indication that it scrolls is a row whose right-hand half
 * nobody finds — and `.uds-scroll-fade` softens both ends so the cut edge
 * reads as "continues" rather than as "ends here".
 *
 * Tabbing still reaches every filter in order: these are ordinary links, and
 * the browser scrolls a focused one into view on its own.
 *
 * The active state is carried by weight, a drawn rule and `aria-current` —
 * never by colour alone. The filter list arrives as a prop; this component
 * never reads `src/data` (architecture.md §2.4).
 */
export function CategoryFilter({
  filters,
  active,
  basePath,
  label = "Filter by category",
}: {
  filters: CategoryFilterOption[];
  active: string;
  /** The route the filter links back into. */
  basePath: string;
  label?: string;
}) {
  return (
    <nav aria-label={label} className="min-w-0">
      <ul className="uds-scroll-x uds-scroll-fade -mx-(--gutter) flex snap-x items-baseline gap-x-6 px-(--gutter) pb-3">
        {filters.map((filter) => {
          const current = filter.value === active;
          const href =
            filter.value === "all"
              ? basePath
              : `${basePath}?category=${filter.value}`;

          return (
            <li key={filter.value} className="shrink-0 snap-start">
              <Link
                href={href}
                aria-current={current ? "true" : undefined}
                className={[
                  "group/filter relative inline-flex items-baseline gap-2 py-1 text-meta uppercase transition-colors duration-[var(--dur-fast)]",
                  current ? "text-accent" : "text-secondary hover:text-current",
                ].join(" ")}
              >
                <span className={current ? "font-semibold" : ""}>
                  {filter.label}
                </span>
                <span data-numeric className="opacity-60">
                  {filter.count}
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
