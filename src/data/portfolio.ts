/* =============================================================================
   DEMO CONTENT
   Fictional placeholder work, written to exercise the filtered index at a
   realistic length. None of it is Uthan Design Studio's work.
   ============================================================================= */

import type { PortfolioItem, ProjectCategory } from "@/types/content";

import { img } from "./media";

const portfolio: PortfolioItem[] = [
  {
    id: "f1", slug: "courtyard-house", isDemo: true, projectSlug: "courtyard-house",
    title: "Courtyard House", category: [{ slug: "residential", label: "Residential" }], year: "2024",
    location: "Coastal escarpment", areaSize: "410 m²",
    summary: "A closed perimeter with a room of open air cut through its centre.",
    image: img("project", 0, "Board-marked concrete mass seen from below"),
    // One worked example of an editor-uploaded mark, so the CMS path is
    // exercised rather than only typed. Every other project falls back to the
    // drawn section mark until someone uploads one.
    symbol: {
      asset: {
        src: "/brand/projects/courtyard-house.svg",
        alt: "",
        width: 24,
        height: 24,
      },
      label: "Courtyard House mark: a room of open air inside a closed perimeter",
    },
  },
  {
    id: "f2", slug: "warehouse-conversion", isDemo: true, projectSlug: "warehouse-conversion",
    title: "Warehouse Conversion", category: [{ slug: "commercial", label: "Commercial" }], year: "2023",
    location: "Former dock district", areaSize: "2,840 m²",
    summary: "Two vertical cuts through a timber-framed goods store: one stair, one purely light.",
    image: img("project", 1, "Raking light striping a concrete stair and landing"),
  },
  {
    id: "f3", slug: "hillside-pavilions", isDemo: true, projectSlug: "hillside-pavilions",
    title: "Hillside Pavilions", category: [{ slug: "hospitality", label: "Hospitality" }], year: "2025",
    location: "Upland valley", areaSize: "1,120 m²",
    summary: "Nine pavilions on a contour, each rotated so no two share a view.",
    image: img("project", 2, "A low pavilion mirrored in still water"),
  },
  {
    id: "f4", slug: "civic-reading-rooms", isDemo: true, projectSlug: "civic-reading-rooms",
    title: "Civic Reading Rooms", category: [{ slug: "institutional", label: "Institutional" }], year: "2023",
    location: "City centre", areaSize: "1,760 m²",
    summary: "A library planned as five rooms of graded acoustic character.",
    image: img("project", 3, "A tall civic hall enclosed in a glass and steel lattice"),
  },
  {
    id: "f5", slug: "market-canopy", isDemo: true, projectSlug: "market-canopy",
    title: "Market Canopy", category: [{ slug: "urban", label: "Urban" }], year: "2022",
    location: "Riverside quarter", areaSize: "2,200 m²",
    summary: "A roof and nothing else, designed from the shade it casts.",
    image: img("project", 4, "A white lattice canopy spanning an open floor"),
  },
  {
    id: "f6", slug: "apartment-in-section", isDemo: true, projectSlug: "apartment-in-section",
    title: "Apartment in Section", category: [{ slug: "interior", label: "Interior" }], year: "2024",
    location: "Nineteenth-century terrace", areaSize: "168 m²",
    summary: "One opening cut in a floor, doing the work of a whole replan.",
    image: img("project", 5, "A stone spiral stair seen straight down through the full height of its void"),
  },
  {
    id: "f7", slug: "brick-workshop", isDemo: true,
    title: "Brick Workshop", category: [{ slug: "commercial", label: "Commercial" }], year: "2022",
    location: "Industrial edge", areaSize: "640 m²",
    summary: "A maker's workshop in load-bearing brick, top-lit along its full length.",
    image: img("detail", 0, "Rubble stone wall with a timber lintel"),
  },
  {
    id: "f8", slug: "garden-studio", isDemo: true,
    title: "Garden Studio", category: [{ slug: "residential", label: "Residential" }], year: "2023",
    location: "Suburban garden", areaSize: "34 m²",
    summary: "A single-room timber studio, built in nine days from a shop-fabricated kit.",
    image: img("sustain", 0, "Glazed structure with planting inside"),
  },
  {
    id: "f9", slug: "restaurant-fit-out", isDemo: true,
    title: "Restaurant Fit-out", category: [{ slug: "hospitality", label: "Hospitality" }], year: "2024",
    location: "Market street", areaSize: "220 m²",
    summary: "Sixty covers arranged around an open kitchen and one long shared table.",
    image: img("interior", 2, "Public foyer with an open stair"),
  },
  {
    id: "f10", slug: "terrace-extension", isDemo: true,
    title: "Terrace Extension", category: [{ slug: "residential", label: "Residential" }], year: "2022",
    location: "Victorian terrace", areaSize: "56 m²",
    summary: "A rear extension detailed so the join to the existing house is invisible from inside.",
    image: img("detail", 1, "Weathered timber door set into a rendered wall"),
  },
  {
    id: "f11", slug: "office-headquarters", isDemo: true,
    title: "Office Headquarters", category: [{ slug: "commercial", label: "Commercial" }], year: "2025",
    location: "Business district", areaSize: "5,400 m²",
    summary: "A deep-plan office broken by three full-height atria on a diagonal.",
    image: img("urban", 2, "Glass towers seen against an open sky"),
  },
  {
    id: "f12", slug: "chapel-restoration", isDemo: true,
    title: "Chapel Restoration", category: [{ slug: "other", label: "Other" }], year: "2021",
    location: "Rural parish", areaSize: "310 m²",
    summary: "Fabric repair and a new stone floor, with the nineteenth-century roof left exposed.",
    image: img("interior", 3, "Rock-cut concourse with exposed strata"),
  },
];

/** Filter set for the portfolio index. `all` is not stored; it is the absence of a filter. */
export const portfolioFilters: { value: ProjectCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "hospitality", label: "Hospitality" },
  { value: "interior", label: "Interior" },
  { value: "other", label: "Other" },
];

/**
 * Categories outside the visible filter set (urban, institutional, landscape)
 * are collected under "Other", so no item is ever unreachable by filtering.
 */
const VISIBLE: ProjectCategory[] = [
  "residential",
  "commercial",
  "hospitality",
  "interior",
];

export function getPortfolio(): PortfolioItem[] {
  return portfolio;
}

export function filterPortfolio(
  items: PortfolioItem[],
  filter: ProjectCategory | "all",
): PortfolioItem[] {
  if (filter === "all") return items;
  // "Other" is everything outside the visible buttons, so nothing is ever
  // unreachable by filtering. `some`, because an item can sit in several
  // categories at once and matching one is enough to belong in the row.
  if (filter === "other") {
    return items.filter((i) => !i.category.some((c) => VISIBLE.includes(c.slug)));
  }
  return items.filter((i) => i.category.some((c) => c.slug === filter));
}

export function countPortfolio(filter: ProjectCategory | "all"): number {
  return filterPortfolio(portfolio, filter).length;
}
