import type { Category, ProjectStatus } from "@/types/content";

/**
 * Display strings for enum values.
 *
 * Kept out of components so a category is labelled identically everywhere, and
 * so translating the site later is a change to one file rather than a hunt
 * through JSX.
 */
/**
 * The categories an item is filed under, as one line.
 *
 * Replaces a `Record<ProjectCategory, string>` that mapped slugs to display
 * names. That map could only work while the set of categories was closed and a
 * developer owned it; the studio owns categories now, and each one carries its
 * own label, so the lookup would have been a second place to edit — and the
 * place that silently rendered `undefined` for anything added in the CMS.
 *
 * Joined with a middot rather than a comma: an item is in several categories at
 * once, not in a list of them, and the separator should not read as prose.
 */
export function categoryLine(categories: Category[]): string {
  return categories.map((c) => c.label).join(" · ");
}

export const statusLabels: Record<ProjectStatus, string> = {
  completed: "Completed",
  "in-progress": "In progress",
  concept: "Concept",
};

/** Long-form date, e.g. "18 June 2026". Locale-aware via Intl, never hand-built. */
export function formatDate(iso: string, locale = "en-GB"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

