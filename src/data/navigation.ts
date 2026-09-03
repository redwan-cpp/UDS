import type { NavItem } from "@/types/content";

/**
 * The site index.
 *
 * Numbered because the whole interface language is the architectural index —
 * a numbered list separated by rules, the way a drawing set or a publication
 * contents page is organised.
 */
export const navigation: NavItem[] = [
  { index: "01", label: "About", href: "/studio" },
  { index: "02", label: "Major Projects", href: "/projects" },
  { index: "03", label: "Portfolio", href: "/portfolio" },
  { index: "04", label: "Products", href: "/products" },
  { index: "05", label: "Sustainability", href: "/sustainability" },
  { index: "06", label: "Collaboration & News", href: "/news" },
  { index: "07", label: "Contact", href: "/contact" },
];

/** Shown in the header on wide screens. The full index lives in the overlay. */
export const primaryNavigation: NavItem[] = navigation.filter((item) =>
  ["/projects", "/portfolio", "/studio", "/contact"].includes(item.href),
);
