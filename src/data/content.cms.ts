import { cache } from "react";

import type {
  Brand,
  ExpertiseArea,
  JobOpening,
  NewsItem,
  Product,
  Statistic,
  StudioProfile,
  SustainabilityPrinciple,
  TeamMember,
} from "@/types/content";
import {
  client,
  toAsset,
  toAssets,
  toCategories,
  toParagraphs,
  toRows,
  toValues,
} from "./payload";

/**
 * The rest of the content, read from the CMS.
 *
 * One module rather than eleven, because these are all the same three lines of
 * work — query, map, return — and splitting them across files would spread a
 * single pattern thinly enough to hide a mistake in it. Projects earned its own
 * file; it is the one type with enough shape to deserve the room.
 *
 * Every accessor keeps the signature `architecture.md` §2.5 committed to, with
 * the body async and the return type unmoved, so nothing above this line has to
 * know where content comes from.
 *
 * `depth: 1` throughout for anything carrying media, so relationships come back
 * populated. Where a query wants only slugs it drops to `depth: 0` rather than
 * fetching a library it is about to discard.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
type Doc = any;

/**
 * `overrideAccess: false` is what keeps drafts off the public site.
 *
 * Payload's Local API skips access control unless told otherwise, so these
 * queries used to read every document regardless of status — including the
 * untitled draft autosave creates the moment an editor clicks "Create new" and
 * walks away. One of those shipped as a blank, unlinked card at the top of the
 * live work index. Every collection here already declares
 * `publishedOnlyAccess`, which gives an anonymous reader published documents
 * only; running the query *as* that reader applies it, rather than writing the
 * same `_status` filter into each accessor and missing one.
 */
const find = async (collection: string, opts: Record<string, unknown> = {}) => {
  const payload = await client();
  const { docs } = await payload.find({
    collection: collection as never,
    limit: 300,
    depth: 1,
    overrideAccess: false,
    ...opts,
  });
  return docs as Doc[];
};

/* ----------------------------------------------------------------- categories */

/**
 * The filter row for one side of the site.
 *
 * Built from the CMS rather than a hardcoded array, which is the whole point of
 * the categories collection — a studio adding "Adaptive reuse" gets a button
 * without a deploy.
 *
 * "All" leads, and "Other" is appended only when something is actually filed
 * outside the visible buttons. Offering "Other" when it would match nothing is
 * a dead control, and offering no "Other" when categories are hidden makes
 * those items unreachable — `memory.md` records that as a real decision.
 */
export const getCategoryFilters = cache(
  async (scope: "project" | "product"): Promise<{ value: string; label: string }[]> => {
    const all = await find("categories", {
      depth: 0,
      where: { scope: { equals: scope } },
      sort: "order",
    });
    const visible = all.filter((c) => c.inFilter);
    const hidden = all.filter((c) => !c.inFilter);

    return [
      { value: "all", label: "All" },
      ...visible.map((c) => ({ value: c.slug as string, label: c.label as string })),
      ...(hidden.length ? [{ value: "other", label: "Other" }] : []),
    ];
  },
);

/** The slugs that earn their own button — everything else falls under "Other". */
export const getVisibleCategorySlugs = cache(
  async (scope: "project" | "product"): Promise<string[]> =>
    (
      await find("categories", {
        depth: 0,
        where: { scope: { equals: scope }, inFilter: { equals: true } },
        sort: "order",
      })
    ).map((c) => c.slug as string),
);

/* The portfolio accessor is gone: `portfolio` merged into `projects`, and the
   work index now reads `getProjects` from projects.cms.ts. */

/* ---------------------------------------------------------------- studio --- */

/**
 * The studio profile — the footer, the contact details, the About copy.
 *
 * A global rather than a collection: there is one studio. It was modelled in
 * Payload when the CMS landed but nothing read it, so the site went on
 * rendering `src/data/studio.ts` and the panel's fields did nothing — an editor
 * could change the phone number, save, and watch the site ignore them. This is
 * the accessor that makes those fields real; `studio.ts` stays behind as the
 * seed source.
 *
 * Falls back field by field rather than wholesale. A global that has never been
 * saved comes back as an empty object, and a footer that renders "undefined"
 * for the studio's own name is worse than one showing what the seed put there.
 */
export const getStudio = cache(async (): Promise<StudioProfile> => {
  const payload = await client();
  const d: Doc = await payload.findGlobal({ slug: "studio", depth: 1 });

  // All three or none. A WebM with no MP4 fails silently on Safari, and video
  // with no poster shows nothing at all under reduced motion — so a partly
  // filled hero falls back to the shipped clip rather than half-rendering.
  const poster = toAsset(d.hero?.poster);
  const webm = d.hero?.webm?.url;
  const mp4 = d.hero?.mp4?.url;
  const hero =
    webm && mp4 && poster.src
      ? {
          sources: [
            { src: webm, type: "video/webm" },
            { src: mp4, type: "video/mp4" },
          ],
          poster,
        }
      : undefined;

  return {
    name: d.name ?? "",
    tagline: d.tagline ?? "",
    disciplines: toValues(d.disciplines),
    hero,
    services: (d.services ?? []).map((s: Doc) => ({
      label: s.label ?? "",
      href: s.href ?? "",
    })),
    statement: toParagraphs(d.statement),
    approach: toParagraphs(d.approach),
    closing: d.closing ?? "",
    about: {
      statement: toParagraphs(d.about?.statement),
      body: toParagraphs(d.about?.body),
    },
    contact: {
      email: d.contact?.email ?? "",
      phone: d.contact?.phone ?? "",
      phoneAlt: d.contact?.phoneAlt ?? undefined,
      addressLines: toValues(d.contact?.addressLines),
      hours: d.contact?.hours ?? undefined,
      coordinates:
        d.contact?.coordinates?.lat != null && d.contact?.coordinates?.lon != null
          ? { lat: d.contact.coordinates.lat, lon: d.contact.coordinates.lon }
          : undefined,
      mapEmbedUrl: d.contact?.mapEmbedUrl ?? undefined,
    },
    // `href` stays optional here on purpose: the UI renders a channel with no
    // URL as plain text rather than as a link that goes nowhere.
    social: (d.social ?? []).map((s: Doc) => ({
      label: s.label ?? "",
      href: s.href || undefined,
    })),
    legal: (d.legal ?? []).map((s: Doc) => ({
      label: s.label ?? "",
      href: s.href ?? "",
    })),
  };
});

/* ------------------------------------------------------------------- products */

const toProduct = (d: Doc): Product => ({
  id: String(d.id),
  slug: d.slug,
  isDemo: Boolean(d.isDemo),
  title: d.title,
  category: toCategories(d.category),
  summary: d.summary,
  description: toParagraphs(d.description),
  materials: toValues(d.materials),
  applications: toValues(d.applications),
  specs: toRows(d.specs),
  hero: toAsset(d.hero),
  gallery: toAssets(d.gallery),
  order: d.order ?? 0,
});

export const getProducts = cache(async (): Promise<Product[]> =>
  (await find("products", { sort: "order" })).map(toProduct),
);

export const getProductBySlug = cache(
  async (slug: string): Promise<Product | undefined> => {
    const docs = await find("products", {
      where: { slug: { equals: slug } },
      limit: 1,
    });
    return docs.length ? toProduct(docs[0]) : undefined;
  },
);

export const getProductSlugs = cache(async (): Promise<string[]> =>
  (await find("products", { depth: 0, sort: "order" })).map((d) => d.slug as string),
);

/* ----------------------------------------------------------------------- news */

const toNews = (d: Doc): NewsItem => ({
  id: String(d.id),
  slug: d.slug,
  isDemo: Boolean(d.isDemo),
  title: d.title,
  kind: d.kind,
  // Payload stores a real date; the site renders it through `<time datetime>`,
  // which wants ISO. Sliced to the day because that is the precision the
  // editor entered — rendering a time nobody chose would be inventing detail.
  date: typeof d.date === "string" ? d.date.slice(0, 10) : d.date,
  organisation: d.organisation ?? undefined,
  location: d.location ?? undefined,
  summary: d.summary,
  body: toParagraphs(d.body),
  image: toAsset(d.image),
  gallery: toAssets(d.gallery).length ? toAssets(d.gallery) : undefined,
  documents: (d.documents ?? []).map((doc: Doc) => ({
    label: doc.label,
    href: doc.href,
    kind: doc.kind,
  })),
  featured: Boolean(d.featured),
});

export const getNews = cache(async (): Promise<NewsItem[]> =>
  (await find("news", { sort: "-date" })).map(toNews),
);

export const getFeaturedNews = cache(async (limit = 3): Promise<NewsItem[]> => {
  const docs = await find("news", {
    where: { featured: { equals: true } },
    sort: "-date",
    limit,
  });
  // Falls back to the most recent when nothing is flagged, so the homepage band
  // is never empty because an editor forgot a checkbox.
  if (docs.length) return docs.map(toNews);
  return (await getNews()).slice(0, limit);
});

export const getNewsBySlug = cache(
  async (slug: string): Promise<NewsItem | undefined> => {
    const docs = await find("news", { where: { slug: { equals: slug } }, limit: 1 });
    return docs.length ? toNews(docs[0]) : undefined;
  },
);

export const getNewsSlugs = cache(async (): Promise<string[]> =>
  (await find("news", { depth: 0 })).map((d) => d.slug as string),
);

/* ------------------------------------------------------------------ knowledge */

/**
 * Knowledge posts, mapped to `NewsItem`.
 *
 * The same shape, so `/knowledge` reuses the news cards and article layout
 * rather than growing a parallel set of components. `kind` is fixed to
 * `publication` because the type requires one and a written piece is exactly
 * that — the Knowledge collection does not ask an editor to choose, since
 * there is nothing to choose between.
 */
const toKnowledge = (d: Doc): NewsItem => ({
  id: String(d.id),
  slug: d.slug,
  isDemo: Boolean(d.isDemo),
  title: d.title,
  kind: "publication",
  date: typeof d.date === "string" ? d.date.slice(0, 10) : d.date,
  summary: d.summary,
  body: toParagraphs(d.body),
  image: toAsset(d.image),
  gallery: toAssets(d.gallery).length ? toAssets(d.gallery) : undefined,
  featured: Boolean(d.featured),
});

export const getKnowledge = cache(async (): Promise<NewsItem[]> =>
  (await find("knowledge", { sort: "-date" })).map(toKnowledge),
);

export const getKnowledgeBySlug = cache(
  async (slug: string): Promise<NewsItem | undefined> => {
    const docs = await find("knowledge", {
      where: { slug: { equals: slug } },
      limit: 1,
    });
    return docs.length ? toKnowledge(docs[0]) : undefined;
  },
);

export const getKnowledgeSlugs = cache(async (): Promise<string[]> =>
  (await find("knowledge", { depth: 0 })).map((d) => d.slug as string),
);

/* ----------------------------------------------------------------------- team */

export const getTeam = cache(async (): Promise<TeamMember[]> =>
  (await find("team", { sort: "order" })).map((d) => ({
    id: String(d.id),
    slug: d.slug,
    isDemo: Boolean(d.isDemo),
    name: d.name,
    role: d.role,
    bio: d.bio ?? undefined,
    detail: d.detail ?? undefined,
    // Legitimately empty until the studio supplies portraits — the grid
    // renders a designed pending state off exactly this shape.
    portrait: toAsset(d.portrait),
    linkedin: d.linkedin ?? undefined,
    order: d.order ?? 0,
  })),
);

/* ------------------------------------------------------------------ expertise */

export const getExpertise = cache(async (): Promise<ExpertiseArea[]> =>
  (await find("expertise", { sort: "index" })).map((d) => ({
    id: String(d.id),
    index: d.index,
    title: d.title,
    description: d.description,
    image: toAsset(d.image),
    isDemo: Boolean(d.isDemo),
  })),
);

/* ------------------------------------------------------------- sustainability */

export const getSustainabilityPrinciples = cache(
  async (): Promise<SustainabilityPrinciple[]> =>
    (await find("sustainability", { sort: "index" })).map((d) => ({
      id: String(d.id),
      index: d.index,
      title: d.title,
      description: d.description,
      measures: toValues(d.measures),
      image: toAsset(d.image).src ? toAsset(d.image) : undefined,
      isDemo: Boolean(d.isDemo),
    })),
);

/* ----------------------------------------------------------------- statistics */

export const getStatistics = cache(async (): Promise<Statistic[]> =>
  (await find("statistics", { depth: 0, sort: "order" })).map((d) => ({
    id: String(d.id),
    value: d.value,
    prefix: d.prefix ?? undefined,
    suffix: d.suffix ?? undefined,
    label: d.label,
    isDemo: Boolean(d.isDemo),
  })),
);

/* --------------------------------------------------------------------- brands */

export const getBrands = cache(async (): Promise<Brand[]> =>
  (await find("brands", { sort: "order" })).map((d) => {
    const logo = toAsset(d.logo);
    return {
      id: String(d.id),
      name: d.name,
      logo: logo.src ? logo : undefined,
      relationship: d.relationship,
      isDemo: Boolean(d.isDemo),
    };
  }),
);

/* -------------------------------------------------------------------- careers */

export const getOpenings = cache(async (): Promise<JobOpening[]> =>
  (await find("careers", { depth: 0, sort: "index" })).map((d) => ({
    index: d.index,
    title: d.title,
    discipline: d.discipline,
    commitment: d.commitment,
    summary: d.summary,
    requirements: toValues(d.requirements),
  })),
);
