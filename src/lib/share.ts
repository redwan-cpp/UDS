import type { Metadata } from "next";

import type { MediaAsset, NewsItem, Project, Seo, StudioProfile } from "@/types/content";

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
  seo,
}: {
  title: string;
  description: string;
  /** Site-relative, e.g. `/projects`. */
  path: string;
  /** The page's own picture. Falls back to the site's. */
  image?: MediaAsset;
  /** The editor's overrides from the item's SEO fields in the CMS. */
  seo?: Seo;
}): Metadata {
  title = seo?.title || title;
  description = seo?.description || description;
  image = seo?.image ?? image;
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
    robots: seo?.noIndex ? { index: false } : undefined,
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
  seo,
}: {
  title: string;
  description: string;
  /** Site-relative, e.g. `/news/some-slug`. */
  path: string;
  image?: MediaAsset;
  /** ISO date. Renders as `article:published_time`. */
  publishedTime?: string;
  /** The editor's overrides from the item's SEO fields in the CMS. */
  seo?: Seo;
}): Metadata {
  title = seo?.title || title;
  description = seo?.description || description;
  image = seo?.image ?? image;
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
    robots: seo?.noIndex ? { index: false } : undefined,
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

/**
 * The studio as structured data — `Organization`/`ProfessionalService` plus
 * `WebSite`, rendered once on every page from the root layout.
 *
 * This is the machine-readable identity claim underneath everything else SEO
 * touches: a name, address and phone that match the studio's Google Business
 * listing word for word (mismatched "NAP" data is a standard reason a
 * business fails to rank or resolve as one entity), `sameAs` linking to every
 * verified profile the studio actually runs, and coordinates for exact
 * geographic placement. This is also the layer that matters most for an AI
 * system answering "best interior designer in Dhaka" — those tools lean on
 * structured, cross-verified entity data rather than parsing prose, and this
 * is what gives them something to verify against. None of it substitutes for
 * the studio's own Google Business Profile, backlinks or reviews, which are
 * account-side work no code change reaches.
 *
 * Deliberately not asserted: `openingHoursSpecification` (`hours` is a free
 * text field — "Sunday–Thursday, 9:00 AM – 5:00 PM" — not the day/time codes
 * schema.org wants, and parsing that string to guess them risks stating a
 * wrong hour if the field is ever phrased differently) and a split
 * `PostalAddress` (`addressLines` is an ordered free-text list with no
 * declared street/city/postcode boundary; joining it whole is accurate to
 * what the CMS actually holds, splitting it would be guessing where the
 * boundaries fall).
 */
export function organizationJsonLd(studio: StudioProfile) {
  const id = `${SITE_URL}/#organization`;
  const logo = absolute("/icon.png");

  const address = studio.contact.addressLines.length
    ? {
        "@type": "PostalAddress",
        streetAddress: studio.contact.addressLines.join(", "),
      }
    : undefined;

  const geo = studio.contact.coordinates
    ? {
        "@type": "GeoCoordinates",
        latitude: studio.contact.coordinates.lat,
        longitude: studio.contact.coordinates.lon,
      }
    : undefined;

  const sameAs = studio.social.map((s) => s.href).filter((href): href is string => Boolean(href));

  const organization = {
    "@type": "ProfessionalService",
    "@id": id,
    name: studio.name,
    url: SITE_URL || undefined,
    logo,
    image: absolute(SHARE_IMAGE.url),
    description: studio.tagline || undefined,
    telephone: studio.contact.phone || undefined,
    email: studio.contact.email || undefined,
    address,
    geo,
    sameAs: sameAs.length ? sameAs : undefined,
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: studio.name,
    url: SITE_URL || undefined,
    publisher: { "@id": id },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [organization, website],
  };
}

/**
 * A breadcrumb trail — Home → section → this page.
 *
 * Shared by every per-page graph below rather than built inline twice: the
 * shape schema.org wants (`ListItem` with a 1-based `position`) is easy to
 * get subtly wrong copying it by hand a second time.
 */
function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: step.name,
      item: absolute(step.path),
    })),
  };
}

/**
 * A project's own page as structured data — `CreativeWork` plus its
 * breadcrumb trail, rendered per project page rather than once sitewide.
 *
 * `CreativeWork` rather than a more specific architectural type: schema.org
 * has no widely-supported "ArchitecturalWork," and asserting a type search
 * engines don't reliably parse is worse than the honest generic one they do.
 * `creator` links back to the studio's own `@id` from `organizationJsonLd`
 * rather than repeating its fields, so the two never drift apart.
 */
export function projectJsonLd(project: Project) {
  const url = `/projects/${project.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        name: project.title,
        description: project.summary,
        url: absolute(url),
        image: project.hero.src ? absolute(project.hero.src) : undefined,
        creator: { "@id": `${SITE_URL}/#organization` },
        dateCreated: project.year || undefined,
        locationCreated: project.location
          ? { "@type": "Place", name: project.location }
          : undefined,
        keywords: project.category.map((c) => c.label).join(", ") || undefined,
      },
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Projects", path: "/projects" },
        { name: project.title, path: url },
      ]),
    ],
  };
}

/**
 * A news or Knowledge item's own page as structured data — `Article` plus
 * its breadcrumb trail. One function for both: `toKnowledge` already maps a
 * Knowledge post onto the same `NewsItem` shape so `/knowledge` can reuse the
 * news cards and article layout, and the structured data follows the same
 * reasoning rather than inventing a second, near-identical builder.
 *
 * `Article` rather than `NewsArticle`/`BlogPosting`: those are valid schema.org
 * subtypes, but which one fits depends on editorial judgement per item this
 * project has no field for (`kind` covers collaborations, events and MoUs too,
 * not just journalism vs. commentary) — `Article` is the accurate common
 * parent rather than a guess at a distinction nothing in the CMS records.
 */
export function articleJsonLd(
  item: NewsItem,
  section: { path: "/news" | "/knowledge"; label: "News" | "Knowledge" },
) {
  const url = `${section.path}/${item.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: item.title,
        description: item.summary,
        url: absolute(url),
        image: item.image.src ? absolute(item.image.src) : undefined,
        datePublished: item.date || undefined,
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: section.label, path: section.path },
        { name: item.title, path: url },
      ]),
    ],
  };
}
