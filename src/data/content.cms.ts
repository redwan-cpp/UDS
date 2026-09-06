import { cache } from "react";

import type {
  Brand,
  ExpertiseArea,
  JobOpening,
  NewsItem,
  PortfolioItem,
  Product,
  Statistic,
  SustainabilityPrinciple,
  TeamMember,
} from "@/types/content";
import {
  client,
  toAsset,
  toAssets,
  toParagraphs,
  toRows,
  toSymbol,
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

const find = async (collection: string, opts: Record<string, unknown> = {}) => {
  const payload = await client();
  const { docs } = await payload.find({
    collection: collection as never,
    limit: 300,
    depth: 1,
    ...opts,
  });
  return docs as Doc[];
};

/* ------------------------------------------------------------------ portfolio */

const toPortfolio = (d: Doc): PortfolioItem => ({
  id: String(d.id),
  slug: d.slug,
  isDemo: Boolean(d.isDemo),
  title: d.title,
  summary: d.summary,
  location: d.location,
  areaSize: d.areaSize,
  category: d.category,
  year: d.year,
  image: toAsset(d.image),
  projectSlug: d.projectSlug ?? undefined,
  symbol: toSymbol(d.symbol),
});

export const getPortfolio = cache(async (): Promise<PortfolioItem[]> =>
  (await find("portfolio")).map(toPortfolio),
);

/* ------------------------------------------------------------------- products */

const toProduct = (d: Doc): Product => ({
  id: String(d.id),
  slug: d.slug,
  isDemo: Boolean(d.isDemo),
  title: d.title,
  category: d.category,
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
