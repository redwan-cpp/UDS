import { revalidatePath } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload";

/**
 * Publish means published.
 *
 * The site's pages are statically generated, which is what makes them fast and
 * also what would make the CMS feel broken: an editor saves a project, reloads
 * the page, and sees the old one until somebody deploys. `process.md`'s Phase
 * 2 to 3 gate asks that a non-technical editor publish a project unaided, and
 * "unaided" cannot include asking a developer to rebuild.
 *
 * **Any save invalidates the whole site.** Not the pages a document "appears
 * on", which is how this started and why it failed. That version kept a table
 * of which collections render where, and got it wrong in ways that only showed
 * in production: a renamed Knowledge post changed on the index and stayed as it
 * was on its own page; a deleted project lingered in every sibling's related
 * strip. Two narrower fixes were tried and measured against a real production
 * build before this was written, and neither worked for pages prerendered by
 * `generateStaticParams`:
 *
 * - `revalidatePath("/knowledge", "layout")` — targets a layout file at that
 *   segment, and there is none, so it matched nothing.
 * - `revalidatePath("/knowledge/[slug]", "page")` — the route pattern; left the
 *   prerendered article as `x-nextjs-cache: HIT` after the edit.
 *
 * `revalidatePath("/", "layout")` targets the one layout that does exist, and in
 * the same test it turned a cached article *and* an unrelated project page into
 * a MISS, and the article showed the edit. It also cannot drift: there is no
 * list of pages to forget to update when a section moves.
 *
 * The cost is small. Nothing is rebuilt on save — each page is marked stale and
 * re-renders once, on its next visit — and a studio publishes a handful of
 * times a week, not a second.
 *
 * **Why this can call `revalidatePath` at all.** Payload runs inside this Next
 * application rather than beside it, so a hook fires in the same process that
 * owns the cache. That is the upside of the coupling `memory.md` records as the
 * accepted risk of choosing Payload; a decoupled CMS would need a webhook and a
 * shared secret to do the same job.
 *
 * **The guard is not defensive noise.** These hooks also fire from scripts —
 * the seed runs the same create and update operations — and outside a Next
 * request `revalidatePath` throws. A seed that dies two documents in because it
 * tried to invalidate a cache that is not running would be a genuinely
 * confusing failure, so the call is allowed to fail quietly when there is no
 * server to tell.
 */
function invalidateSite() {
  try {
    revalidatePath("/", "layout");
  } catch {
    // No Next request context — a script, a migration, a build step.
  }
}

/**
 * The collection name is kept at the call sites because it reads as what the
 * hook is attached to, and it names the source in the debug log — not because
 * it narrows what gets invalidated. Nothing does, on purpose; see above.
 */
export const revalidateCollection =
  (collection: string): CollectionAfterChangeHook =>
  ({ doc, req }) => {
    req.payload.logger.debug(`${collection} changed — invalidating the site`);
    invalidateSite();
    return doc;
  };

export const revalidateCollectionDelete =
  (collection: string): CollectionAfterDeleteHook =>
  ({ doc, req }) => {
    req.payload.logger.debug(`${collection} deleted — invalidating the site`);
    invalidateSite();
    return doc;
  };

/** Globals — the studio profile, the menu, the site copy — appear on every page. */
export const revalidateEverything: GlobalAfterChangeHook = ({ doc }) => {
  invalidateSite();
  return doc;
};

/** Media is referenced from anywhere. */
export const revalidateMedia: CollectionAfterChangeHook = ({ doc }) => {
  invalidateSite();
  return doc;
};
