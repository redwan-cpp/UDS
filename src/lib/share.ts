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
 * The fallback picture on a share card.
 *
 * A page with no image of its own still has to have one: a card with no
 * picture is a grey box with a domain in it, which reads as a broken link
 * rather than as a restrained one. This is the hero's own poster frame — the
 * studio's work, already public under `public/`, and wide enough for the
 * large-image card. A scraper is an anonymous request from another network, so
 * whatever it is pointed at has to be reachable without logging in.
 */
export const SHARE_IMAGE = {
  url: "/media/hero-loop-poster.jpg",
  width: 2400,
  height: 1261,
  alt: "Raking sunlight through a gridded window inside a concrete architectural interior",
};

/** The suffix `metadata.title.template` adds. OpenGraph has no template. */
const TITLE_SUFFIX = "Uthan Design Studio";

/**
 * Metadata for an ordinary page — anything that is not a dated article.
 *
 * Every route used to declare a bare `title` and `description` and stop there,
 * so sharing any of them — the work index, a project, the studio page —
 * produced a card with no picture, no headline of its own and the bare domain
 * underneath. The only links that scraped properly were news and Knowledge
 * posts, because those were the only two calling `articleMetadata`.
 *
 * `title` is returned plain so the root layout's `%s — Uthan Design Studio`
 * template still applies to the browser tab. `openGraph.title` is composed by
 * hand because that template does *not* reach OpenGraph — Next leaves those
 * fields alone, and a card reading only "Projects" says nothing about whose.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  /** Site-relative, e.g. `/projects`. */
  path: string;
  /** The page's own picture. Falls back to the site's. */
  image?: MediaAsset;
}): Metadata {
  const url = absolute(path);
  const picture = image?.src
    ? {
        url: absolute(image.src),
        width: image.width || undefined,
        height: image.height || undefined,
        alt: image.alt || title,
      }
    : { ...SHARE_IMAGE, url: absolute(SHARE_IMAGE.url) };

  const shareTitle = `${title} — ${TITLE_SUFFIX}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: shareTitle,
      description,
      url,
      siteName: TITLE_SUFFIX,
      images: [picture],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [picture.url],
    },
  };
}

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
