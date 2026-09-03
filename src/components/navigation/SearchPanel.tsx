"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
 * Site search, as a panel of its own.
 *
 * It used to live inside the index overlay, which conflated two different
 * intentions: "show me everything" and "take me to this one thing". They are
 * now separate — the index is the contents page, this is the shortcut.
 *
 * **It stays mounted and is toggled with `data-open`.** That is the whole
 * reason it can animate *out*: a panel that unmounts on close has nothing left
 * to transition, so it vanishes instantly however carefully the entrance was
 * written. Closed, it is `inert` and `aria-hidden`, so nothing inside it can
 * be tabbed into or announced while it is not there.
 *
 * Focus is moved into the field on open and returned to the trigger on close,
 * because a keyboard user who opens a panel and is left standing outside it
 * has to hunt for what just happened.
 *
 * Search itself runs in the browser against the flattened content index —
 * a few dozen entries, so a substring match is instant and a search service
 * would be machinery the content does not justify. Ranked by *where* the match
 * landed (title, then summary, then keywords) rather than by frequency, which
 * at this scale would be scoring noise.
 *
 * On semantics: a search field and a list of links, not an ARIA combobox. A
 * combobox promises a specific keyboard contract — arrow keys driving a
 * virtual cursor, Enter selecting the active option — and half-implementing
 * that is worse than not claiming it.
 */
export function SearchPanel({
  index,
  open,
  onClose,
  triggerRef,
}: {
  index: SearchEntry[];
  open: boolean;
  onClose: () => void;
  /** Focus is handed back here on close. */
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}) {
  const [query, setQuery] = useState("");
  const inputId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

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
      else if (entry.keywords?.some((k) => k.toLowerCase().includes(trimmed)))
        rank = 3;

      if (rank >= 0) scored.push({ entry, rank });
    }

    return scored
      .sort(
        (a, b) => a.rank - b.rank || a.entry.title.localeCompare(b.entry.title),
      )
      .slice(0, LIMIT)
      .map((s) => s.entry);
  }, [index, trimmed]);

  // Opening clears the previous query and focuses the field, so the panel is
  // never reopened showing a stale answer.
  //
  // Cleared on the way *in* rather than on the way out for two reasons: doing
  // it on close means calling setState synchronously from an effect body, and
  // it would also blank the panel mid-fade — the query should still be there
  // while you watch it leave. The timeout also lets focus land after the panel
  // is no longer `inert`, which it has to be while closed.
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => {
      setQuery("");
      inputRef.current?.focus();
    }, 30);
    return () => window.clearTimeout(id);
  }, [open]);

  // Escape closes; a click anywhere outside closes.
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        triggerRef?.current?.focus();
      }
    };

    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (triggerRef?.current?.contains(target)) return;
      onClose();
    };

    document.addEventListener("keydown", onKey);
    // `capture` so it still fires when the click lands on something that stops
    // propagation on its way up.
    document.addEventListener("pointerdown", onPointer, true);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer, true);
    };
  }, [open, onClose, triggerRef]);

  // A completed navigation is the confirmation — the panel's work is done.
  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const showResults = trimmed.length >= 2;

  return (
    <div
      ref={panelRef}
      data-open={open || undefined}
      inert={!open || undefined}
      aria-hidden={!open || undefined}
      aria-label="Search"
      className="uds-search-panel surface-dark uds-glass fixed top-20 right-(--gutter) z-80 w-[min(26rem,calc(100vw-2*var(--gutter)))] border border-hairline backdrop-blur-2xl backdrop-saturate-150 md:top-24"
    >
      <div className="p-4">
        <label htmlFor={inputId} className="sr-only">
          Search the site
        </label>

        <div className="group/field flex items-center gap-3 border-b border-hairline pb-3 transition-colors duration-[var(--dur-base)] focus-within:border-accent">
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            className="size-[18px] shrink-0 text-secondary transition-colors group-focus-within/field:text-accent"
          >
            <circle
              cx="8.75"
              cy="8.75"
              r="5.75"
              stroke="currentColor"
              strokeWidth="1.25"
            />
            <path
              d="M13 13L17.5 17.5"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="square"
            />
          </svg>

          <input
            ref={inputRef}
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the site…"
            autoComplete="off"
            className="w-full bg-transparent text-body text-paper outline-none placeholder:text-secondary"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="-mr-1 flex size-9 shrink-0 items-center justify-center text-secondary transition-colors hover:text-accent"
            >
              <span className="sr-only">Clear search</span>
              <span aria-hidden="true" className="relative block size-3.5">
                <span className="absolute top-1/2 left-0 block h-px w-full rotate-45 bg-current" />
                <span className="absolute top-1/2 left-0 block h-px w-full -rotate-45 bg-current" />
              </span>
            </button>
          )}
        </div>

        <p aria-live="polite" className="sr-only">
          {showResults
            ? `${results.length} result${results.length === 1 ? "" : "s"} for ${query.trim()}`
            : ""}
        </p>

        {showResults ? (
          results.length === 0 ? (
            <p className="px-1 pt-4 text-small text-secondary">
              Nothing matches &ldquo;{query.trim()}&rdquo;.
            </p>
          ) : (
            <ul className="pt-2">
              {results.map((entry) => (
                <li key={entry.id}>
                  <Link
                    href={entry.href}
                    onClick={onClose}
                    className="group/result block px-2 py-2.5 transition-colors duration-[var(--dur-fast)] hover:bg-paper/8 focus-visible:bg-paper/8 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
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
                      <span className="mt-0.5 block max-w-[44ch] text-caption text-secondary">
                        {entry.summary}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )
        ) : (
          <p className="px-1 pt-4 text-caption text-secondary">
            Projects, products, pages and open roles.
          </p>
        )}
      </div>
    </div>
  );
}
