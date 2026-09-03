import type { ReactNode } from "react";

/**
 * A disclosure, built on native `<details>`.
 *
 * Deliberately not a React-state toggle. `<details>` gets four things for
 * nothing that a state toggle has to re-earn and usually does not:
 *
 * - The content is in the DOM whether open or shut, so it is crawlable and
 *   findable with the browser's own in-page search. A project's writing is the
 *   substance of the page; hiding it from a crawler to save vertical space
 *   would be a bad trade.
 * - It works with no JavaScript.
 * - The open/shut state, the button semantics and the keyboard behaviour are
 *   the browser's, so they are correct.
 * - `hidden="until-found"` behaviour comes free in browsers that support it:
 *   find-in-page opens the section rather than skipping past it.
 *
 * The default triangle is removed and replaced with a rule and a cross that
 * rotates to a minus, because a triangle is not in this interface's language.
 */
export function ViewMore({
  label = "View more",
  openLabel,
  children,
  className = "",
}: {
  label?: string;
  /** Shown when open, if the wording should change. Defaults to `label`. */
  openLabel?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <details className={`uds-disclosure group/more ${className}`}>
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 border-t border-hairline pt-5 text-meta uppercase transition-colors duration-[var(--dur-base)] hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
        <span>
          <span className="group-open/more:hidden">{label}</span>
          <span className="hidden group-open/more:inline">
            {openLabel ?? label}
          </span>
        </span>

        <span
          aria-hidden="true"
          className="relative block size-4 shrink-0 text-accent"
        >
          {/* Horizontal bar stays; the vertical one collapses to make a minus. */}
          <span className="absolute top-1/2 left-0 block h-px w-full -translate-y-1/2 bg-current" />
          <span className="absolute top-0 left-1/2 block h-full w-px -translate-x-1/2 bg-current transition-transform duration-[var(--dur-base)] ease-out-soft group-open/more:scale-y-0 motion-reduce:transition-none" />
        </span>
      </summary>

      <div className="pt-10">{children}</div>
    </details>
  );
}
