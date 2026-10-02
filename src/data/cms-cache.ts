import { unstable_cache } from "next/cache";

import { client } from "./payload";

/**
 * Public CMS reads are safe to reuse briefly between requests. Payload hooks
 * invalidate this tag after every content change, so the cache improves the
 * read path without making a published edit wait for the TTL.
 */
export const CMS_CONTENT_TAG = "uds-cms-content";
const CMS_REVALIDATE_SECONDS = 60;

const findCached = unstable_cache(
  async (collection: string, opts: Record<string, unknown> = {}) => {
    const payload = await client();
    const { docs } = await payload.find({
      collection: collection as never,
      limit: 300,
      depth: 1,
      overrideAccess: false,
      ...opts,
    });
    return docs;
  },
  ["uds-cms-find"],
  { revalidate: CMS_REVALIDATE_SECONDS, tags: [CMS_CONTENT_TAG] },
);

const findGlobalCached = unstable_cache(
  async (slug: string, opts: Record<string, unknown> = {}) => {
    const payload = await client();
    return payload.findGlobal({
      slug: slug as "copy" | "studio" | "navigation",
      overrideAccess: false,
      ...opts,
    });
  },
  ["uds-cms-global"],
  { revalidate: CMS_REVALIDATE_SECONDS, tags: [CMS_CONTENT_TAG] },
);

export function findCMS(collection: string, opts: Record<string, unknown> = {}) {
  return findCached(collection, opts);
}

export function findGlobalCMS(slug: string, opts: Record<string, unknown> = {}) {
  return findGlobalCached(slug, opts);
}
