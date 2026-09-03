"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";

import type { SearchEntry, SearchKind } from "@/types/content";

const KIND_LABELS: Record<SearchKind, string> = {
  page: "Page",
  project: "Project",
  product: "Product",
  news: "News",
  expertise: "Expertise",
  role: "Careers",
};

const LIMIT = 6;

/**
 * Site search.
 *
 * Runs entirely in the browser against the flattened content index. That is a
 * deliberate ceiling, not a shortcut: the whole corpus is a few dozen entries,
 * so a substring match over it is instant and correct, and a search service
 * would need a backend this phase does not have. When the CMS lands the index
 * is fetched rather than imported; nothing in this component changes.
 *
 * Ranking is by *where* the match landed rather than by how often it occurs:
 * a title match beats a summary match beats a keyword match. With this much
 * content that ordering is the whole of what a reader needs — anything
 * cleverer would be scoring noise.
 *
 * On semantics: this is a search field and a list of links, not an ARIA
 * combobox. A combobox promises a specific keyboard contract (arrow keys move
 * a virtual cursor through options, Enter selects the active one) and
 * half-implementing it is worse than not claiming it — so results are ordinary
 * links reached with Tab, and the count is announced politely as it changes.
 */
export function SiteSearch({
  index,
  onNavigate,
}: {
  index: SearchEntry[];
  /** Lets the overlay close itself when a result is chosen. */
  onNavigate?: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputId = useId();
  const trimmed = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (trimmed.length < 2) return [];

    const scored: { entry: SearchEntry; rank: number }[] = [];

    for (const entry of index) {
      const title = entry.title.toLowerCase();
      let rank = -1;

      if (title.startsWith(trimmed)) rank = 0;
      else if (title.includes(trimmed)) rank = 1;
      else if (entry.summary?.toLowerCase().includes(trimmed)) rank = 2;
      else if (
        entry.keywords?.some((k) => k.toLowerCase().includes(trimmed))
      )
        rank = 3;

      if (rank >= 0) scored.push({ entry, rank });
    }

    return scored
      .sort((a, b) => a.rank - b.rank || a.entry.title.localeCompare(b.entry.title))
      .slice(0, LIMIT)
      .map((s) => s.entry);
  }, [index, trimmed]);

  const showPanel = trimmed.length >= 2;

  return (
    <div className="w-full">
      <label htmlFor={inputId} className="sr-only">
        Search the site
      </label>

      <div className="group/field relative flex items-center gap-3 border-b border-hairline pb-3 transition-colors duration-[var(--dur-base)] focus-within:border-accent">
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className="size-[18px] shrink-0 text-secondary transition-colors group-focus-within/field:text-accent"
        >
          <circle cx="8.75" cy="8.75" r="5.75" stroke="currentColor" strokeWidth="1.25" />
          <path d="M13 13L17.5 17.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" />
        </svg>

        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search projects, products, pages…"
          autoComplete="off"
          className="w-full bg-transparent text-h3 text-paper outline-none placeholder:text-secondary"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="-mr-2 flex size-11 shrink-0 items-center justify-center text-secondary transition-colors hover:text-accent"
          >
            <span className="sr-only">Clear search</span>
            <span aria-hidden="true" className="relative block size-4">
              <span className="absolute top-1/2 left-0 block h-px w-full rotate-45 bg-current" />
              <span className="absolute top-1/2 left-0 block h-px w-full -rotate-45 bg-current" />
            </span>
          </button>
        )}
      </div>

      {/* Announced politely rather than on every keystroke's render. */}
      <p aria-live="polite" className="sr-only">
        {showPanel
          ? `${results.length} result${results.length === 1 ? "" : "s"} for ${query.trim()}`
          : ""}
      </p>

      {showPanel && (
        <div className="uds-glass mt-4 border border-hairline p-2 backdrop-blur-xl backdrop-saturate-150">
          {results.length === 0 ? (
            <p className="px-3 py-4 text-small text-secondary">
              Nothing matches &ldquo;{query.trim()}&rdquo;.
            </p>
          ) : (
            <ul>
              {results.map((entry) => (
                <li key={entry.id}>
                  <Link
                    href={entry.href}
                    onClick={onNavigate}
                    className="group/result block px-3 py-3 transition-colors duration-[var(--dur-fast)] hover:bg-paper/8 focus-visible:bg-paper/8 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
                  >
                    <span className="flex items-baseline justify-between gap-4">
                      <span className="text-small text-paper transition-transform duration-[var(--dur-base)] ease-out-soft group-hover/result:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none">
                        {entry.title}
                      </span>
                      <span className="shrink-0 text-meta uppercase text-accent">
                        {KIND_LABELS[entry.kind]}
                      </span>
                    </span>
                    {entry.summary && (
                      <span className="mt-1 block max-w-[46ch] text-caption text-secondary">
                        {entry.summary}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
