import type { MetadataRoute } from "next";

/**
 * Crawl rules.
 *
 * The site is open to crawlers — a studio wants its finished work found, and
 * image search is a real discovery channel for architecture. One exception:
 * the rough-work sheets in `ProcessGallery` are the studio's unpublished
 * thinking, concept sketches and working drawings, and they should not be
 * served as standalone results in Google Images where they arrive stripped of
 * the project that explains them.
 *
 * Blocking the crawl is the documented way to keep an image out of image
 * search; `noimageindex` would be the alternative, but it is a response header
 * on the image itself and there is nowhere to hang one on a static asset
 * without a middleware that would run on every request to buy the same result.
 *
 * **Both URLs have to be listed, and the obvious one is the wrong one.** The
 * markup never contains `/media/process-01.jpg`. `next/image` rewrites every
 * one of these to `/_next/image?url=%2Fmedia%2Fprocess-01.jpg&w=2048&q=75`, so
 * that is the only address a crawler ever reads out of the page — a rule
 * naming just the direct path would look correct in review and block nothing
 * that is actually fetched. The direct path is listed as well because it stays
 * publicly reachable and may be linked from somewhere else later.
 *
 * Worth being straight about the ceiling, the same as the note in
 * `ProcessGallery`: this is a request, not an access control. It is honoured
 * by the search engines that matter and ignored by anyone deliberately copying
 * the work, who does not need a crawler in the first place. The measure that
 * actually protects a drawing is not publishing it at full resolution.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        // What the pages actually reference, via the image optimizer.
        "/_next/image?url=%2Fmedia%2Fprocess-",
        // The wildcard form survives the query parameters being reordered,
        // which prefix matching alone would not.
        "/_next/image*process-",
        // The underlying file, still reachable directly.
        "/media/process-",
      ],
    },
  };
}
