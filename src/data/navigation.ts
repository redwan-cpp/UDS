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


/**
 * The index a page carries in its hero, looked up from the nav rather than
 * written out again on the page.
 *
 * These were literals on each route, and they drifted: the site index used to
 * carry a seventh item, Expertise, at 03. When it was removed the nav
 * resequenced to 01–06 and the page heroes did not, so every page from
 * Products onward was showing a number one higher than its own entry in the
 * menu the visitor had just used to get there. That is the second time this
 * numbering has gone stale after a section was deleted, so it is derived now
 * and there is nothing left to forget to update.
 *
 * Falls back to an em dash, which is what the unnumbered utility pages
 * (privacy, terms, careers) already display — they are deliberately outside
 * the index, not missing from it.
 */
export function navIndex(href: string): string {
  return navigation.find((item) => item.href === href)?.index ?? "—";
}
