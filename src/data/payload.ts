import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";

import type { Category, MediaAsset } from "@/types/content";

/**
 * The seam between Payload and the site.
 *
 * `architecture.md` §2.5 promised that when the CMS landed the accessor bodies
 * would become async fetches and the return types would not move. This file is
 * what makes that true: everything below converts a Payload document into the
 * shapes in `src/types/content.ts`, so components keep receiving exactly what
 * they always received and no component knows a CMS exists.
 *
 * It is also the fallback path. If Payload is ever swapped for Directus — the
 * documented alternative — this is the file that changes, and only this file.
 *
 * **One instance per request, not per call.** `cache` is React's per-request
 * memoiser: a page that asks for projects, the studio profile and the nav gets
 * one Payload instance and one connection rather than three. Without it every
 * accessor would spin up its own.
 */
export const client = cache(async () => getPayload({ config }));

/* ------------------------------------------------------------------ shapes */

/** A Payload upload field is a populated document, an id, or nothing. */
type Upload =
  | {
      url?: string | null;
      alt?: string | null;
      width?: number | null;
      height?: number | null;
      caption?: string | null;
      credit?: string | null;
      source?: string | null;
      licence?: string | null;
      focal?: { x?: number | null; y?: number | null } | null;
    }
  | number
  | string
  | null
  | undefined;

/**
 * The empty asset.
 *
 * Returned where a document has no image rather than throwing, because several
 * of these are legitimately absent: team portraits are empty until the studio
 * supplies them, and `TeamGrid` renders a designed pending state off exactly
 * this shape. An `src` of `""` is the signal it already understands.
 */
const NO_ASSET: MediaAsset = { src: "", alt: "", width: 0, height: 0 };

/**
 * A media document as the site's `MediaAsset`.
 *
 * Returns `NO_ASSET` for an unpopulated relationship — an id rather than an
 * object — instead of guessing a URL from it. That happens when a query runs at
 * `depth: 0`, and rendering a broken image is a worse failure than rendering
 * the designed empty state.
 */
export function toAsset(value: Upload): MediaAsset {
  if (!value || typeof value === "number" || typeof value === "string") {
    return NO_ASSET;
  }
  return {
    src: value.url ?? "",
    alt: value.alt ?? "",
    width: value.width ?? 0,
    height: value.height ?? 0,
    caption: value.caption ?? undefined,
    credit: value.credit ?? undefined,
    source: value.source ?? undefined,
    licence: value.licence ?? undefined,
    focal:
      value.focal?.x != null && value.focal?.y != null
        ? { x: value.focal.x, y: value.focal.y }
        : undefined,
  };
}

/** A list of uploads, with the unpopulated and the empty dropped. */
export function toAssets(value: Upload[] | null | undefined): MediaAsset[] {
  return (value ?? []).map(toAsset).filter((a) => a.src !== "");
}

/**
 * Payload's array-of-rows back to the `string[]` the site renders.
 *
 * Paragraphs are stored as rows because the boundaries carry behaviour — each
 * one gets its own scroll trigger (CLAUDE.md rule 5) — and this is where that
 * round trip closes. Empty rows are dropped: an editor who adds a row and
 * leaves it blank should not produce an empty `<p>`.
 */
export const toParagraphs = (
  rows: { text?: string | null }[] | null | undefined,
): string[] => (rows ?? []).map((r) => r.text ?? "").filter(Boolean);

/** The same, for the short-value lists — materials, services, requirements. */
export const toValues = (
  rows: { value?: string | null }[] | null | undefined,
): string[] => (rows ?? []).map((r) => r.value ?? "").filter(Boolean);

/**
 * A label/value table, with Payload's row `id` stripped.
 *
 * Payload adds an `id` to every array row. The site's `ProjectFact` and
 * `ProductSpec` are exactly two fields, and passing the extra one through would
 * quietly widen a type that `src/types/content.ts` defines narrowly.
 */
export const toRows = (
  rows: { label?: string | null; value?: string | null }[] | null | undefined,
): { label: string; value: string }[] =>
  (rows ?? [])
    .map((r) => ({ label: r.label ?? "", value: r.value ?? "" }))
    .filter((r) => r.label || r.value);

/**
 * The categories an item is filed under.
 *
 * Unpopulated entries — a bare id, which is what a `depth: 0` query returns —
 * are dropped rather than passed through. An id leaking into `?category=` would
 * produce a filter matching nothing and a URL nobody can read, so an item with
 * no resolvable category reads as uncategorised instead.
 *
 * Each carries its own label, so nothing downstream maps a slug to a display
 * name from a table it has to keep in step.
 */
export function toCategories(
  value:
    | ({ slug?: string | null; label?: string | null } | number | string)[]
    | { slug?: string | null; label?: string | null }
    | number
    | string
    | null
    | undefined,
): Category[] {
  const list = Array.isArray(value) ? value : value == null ? [] : [value];
  return list
    .filter(
      (v): v is { slug?: string | null; label?: string | null } =>
        typeof v === "object" && v !== null,
    )
    .map((v) => ({ slug: v.slug ?? "", label: v.label ?? v.slug ?? "" }))
    .filter((c) => c.slug !== "");
}

/** A `symbol` group, or undefined when no mark has been supplied. */
export function toSymbol(
  group: { asset?: Upload; label?: string | null } | null | undefined,
) {
  const asset = toAsset(group?.asset);
  if (!asset.src) return undefined;
  return { asset, label: group?.label ?? "" };
}
