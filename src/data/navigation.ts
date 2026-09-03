import { img } from "./media";
import type { NavItem } from "@/types/content";

/**
 * The site index.
 *
 * Numbered because the whole interface language is the architectural index —
 * a numbered list separated by rules, the way a drawing set or a publication
 * contents page is organised.
 *
 * Each item carries the image the menu overlay's hover panel shows for it —
 * decorative (the panel is `aria-hidden`), so the pairing only has to feel
 * right, not describe the destination exactly. Drawn from the same curated
 * sets the destination page itself uses, so a hover preview is never a frame
 * that page wouldn't also show.
 */
export const navigation: NavItem[] = [
  {
    index: "01",
    label: "About",
    href: "/about",
    image: img("about", 0, ""),
  },
  // Major Projects and Portfolio were two answers to the same question and
  // showed the same six case studies twice. Merged into one index.
  {
    index: "02",
    label: "Projects",
    href: "/projects",
    image: img("project", 0, ""),
  },
  {
    index: "03",
    label: "Products",
    href: "/products",
    image: img("product", 0, ""),
  },
  {
    index: "04",
    label: "Sustainability",
    href: "/sustainability",
    image: img("sustain", 0, ""),
  },
  {
    index: "05",
    label: "Collaboration & News",
    href: "/news",
    image: img("news", 0, ""),
  },
  {
    index: "06",
    label: "Contact",
    href: "/contact",
    image: img("urban", 0, ""),
  },
];

/** Shown in the header on wide screens. The full index lives in the overlay. */
export const primaryNavigation: NavItem[] = navigation.filter((item) =>
  ["/projects", "/about", "/contact"].includes(item.href),
);
