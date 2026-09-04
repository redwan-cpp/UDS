import type {
  ProductCategory,
  ProjectCategory,
  ProjectStatus,
} from "@/types/content";

/**
 * Display strings for enum values.
 *
 * Kept out of components so a category is labelled identically everywhere, and
 * so translating the site later is a change to one file rather than a hunt
 * through JSX.
 */
export const categoryLabels: Record<ProjectCategory, string> = {
  residential: "Residential",
  commercial: "Commercial",
  hospitality: "Hospitality",
  interior: "Interior",
  institutional: "Institutional",
  urban: "Urban",
  landscape: "Landscape",
  other: "Other",
};

export const productCategoryLabels: Record<ProductCategory, string> = {
  doors: "Doors",
  metalwork: "Metalwork",
};

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

