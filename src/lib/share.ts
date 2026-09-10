import type { Metadata } from "next";

import type { MediaAsset } from "@/types/content";

/**
 * The site's own origin.
 *
 * Social networks fetch a shared URL from their own servers, so every value
 * they read has to be absolute — a relative image path resolves against
 * `facebook.com` and the card comes back blank. Empty in development, where
 * nothing is scraping anything.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "";

/** An absolute URL for a path on this site. */
export const absolute = (path: string) =>
  SITE_URL ? new URL(path, SITE_URL).toString() : path;

/**
 * Metadata for a shareable article — a news item or a Knowledge post.
 *
 * Without this a shared link renders as the bare domain and nothing else,
 * which is what every article on this site did until now. With it the card
 * carries a picture, a headline and a sentence, which is the difference
 * between a link somebody clicks and one they scroll past.
 *
 * `openGraph` covers Facebook and LinkedIn — LinkedIn reads OG rather than
 * having tags of its own. The Twitter block is a separate vocabulary that
 * several other apps also read, and `summary_large_image` is what asks for the
 * wide card instead of a thumbnail.
 *
 * The image URL has to be absolute and the picture has to be publicly
 * reachable: a scraper is an anonymous request from another network, so it
 * gets whatever a logged-out visitor gets.
 */
export function articleMetadata({
  title,
  description,
  path,
  image,
  publishedTime,
}: {
  title: string;
  description: string;
  /** Site-relative, e.g. `/news/some-slug`. */
  path: string;
  image?: MediaAsset;
  /** ISO date. Renders as `article:published_time`. */
  publishedTime?: string;
}): Metadata {
  const url = absolute(path);
  const images = image?.src
    ? [
        {
          url: absolute(image.src),
          width: image.width || undefined,
          height: image.height || undefined,
          alt: image.alt || title,
        },
      ]
    : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      images,
      publishedTime,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title,
      description,
      images: images?.map((i) => i.url),
    },
  };
}
