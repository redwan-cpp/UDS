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
 * So saving a document invalidates the pages that render it. Pages stay static
 * and the change appears on the next request — seconds, not a deploy.
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
function invalidate(paths: string[], type?: "layout" | "page") {
  for (const path of paths) {
    try {
      revalidatePath(path, type);
    } catch {
      // No Next request context — a script, a migration, a build step.
    }
  }
}

/**
 * Which pages a collection appears on.
 *
 * Written out rather than derived, because it is a fact about the site's
 * composition that only a person knows: statistics appear on the homepage and
 * on About, brands only on the homepage, projects on both the homepage band
 * and the work index. Getting one wrong means a stale page nobody notices, so
 * the list is explicit and worth re-reading when a section moves.
 */
const PAGES: Record<string, string[]> = {
  projects: ["/", "/projects"],
  products: ["/products"],
  news: ["/", "/news"],
  knowledge: ["/knowledge"],
  team: ["/about"],
  expertise: ["/", "/about"],
  sustainability: ["/sustainability"],
  statistics: ["/", "/about"],
  brands: ["/"],
  careers: ["/careers"],
};

/** Collections whose documents also own a page of their own, at `/<base>/<slug>`. */
const DETAIL_ROUTE: Record<string, string> = {
  projects: "/projects",
  products: "/products",
  news: "/news",
  knowledge: "/knowledge",
};

/**
 * The listing pages, plus the whole detail subtree.
 *
 * The subtree is taken as a `layout`, not as the one concrete
 * `/projects/<slug>` that changed, because three different staleness bugs all
 * live in the pages that path does not cover:
 *
 * - **A deleted document keeps its page.** Invalidating `/projects/test1`
 *   after deleting it did not stop that URL serving 200 from cache.
 * - **A renamed slug leaves its old address live**, serving the document that
 *   moved away from it.
 * - **Every sibling detail page goes stale.** Each one renders a "related"
 *   strip listing the others, so a document that changed or was deleted keeps
 *   appearing — and linking — from pages that were never invalidated. This is
 *   the one that was found in production: a deleted test project still listed
 *   on every other project's page, pointing at a URL that no longer existed.
 *
 * Taking the base as a layout invalidates the index and every page beneath it
 * in one call, which covers all three without enumerating slugs.
 */
function revalidateFor(slug: string) {
  invalidate(PAGES[slug] ?? []);
  const base = DETAIL_ROUTE[slug];
  if (base) invalidate([base], "layout");
}

export const revalidateCollection =
  (slug: string): CollectionAfterChangeHook =>
  ({ doc }) => {
    revalidateFor(slug);
    return doc;
  };

export const revalidateCollectionDelete =
  (slug: string): CollectionAfterDeleteHook =>
  ({ doc }) => {
    revalidateFor(slug);
    return doc;
  };

/**
 * A global changes the whole site.
 *
 * The studio profile is in the footer of every page, the navigation is in every
 * header, and the copy global supplies headings across the site. There is no
 * useful subset to invalidate, so this takes the layout — which cascades to
 * every route beneath it — rather than listing pages and missing one.
 */
export const revalidateEverything: GlobalAfterChangeHook = ({ doc }) => {
  try {
    revalidatePath("/", "layout");
  } catch {
    // No Next request context.
  }
  return doc;
};

/** Media is referenced from anywhere, so a re-upload takes the layout too. */
export const revalidateMedia: CollectionAfterChangeHook = ({ doc }) => {
  try {
    revalidatePath("/", "layout");
  } catch {
    // No Next request context.
  }
  return doc;
};
