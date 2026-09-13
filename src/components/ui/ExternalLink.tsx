import type { ReactNode } from "react";

/**
 * A link that leaves the site.
 *
 * Three things have to travel together, and until now they did not: the same
 * social row appears in the footer, in the menu and on the contact page, and
 * only the contact page opened in a new tab. That is the kind of inconsistency
 * nobody reports and everybody feels.
 *
 * - **`target="_blank"`** — leaving for Instagram should not cost the visitor
 *   the page they were reading.
 * - **`rel="noopener noreferrer"`** — `noopener` is the one that matters. A page
 *   opened this way can otherwise reach back through `window.opener` and
 *   navigate the tab it came from somewhere else entirely. Modern browsers imply
 *   it for `_blank`, but it is one attribute against a whole class of attack and
 *   older browsers do not.
 * - **"opens in a new tab", announced.** A new tab with no warning is
 *   disorienting for a screen-reader user and quietly breaks the back button's
 *   promise for everyone. Visually hidden, because sighted users learn the same
 *   thing from the tab appearing.
 *
 * For http(s) destinations only. `mailto:` and `tel:` hand off to another
 * application rather than opening a page, and the blank tab left behind is a
 * well-earned annoyance — those stay plain anchors.
 */
export function ExternalLink({
  href,
  className,
  children,
  label,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  /**
   * What the destination is, for the announcement, when the visible text does
   * not say it on its own. Omit it and the visible text carries the meaning.
   */
  label?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
      <span className="sr-only">
        {label ? ` ${label} (opens in a new tab)` : " (opens in a new tab)"}
      </span>
    </a>
  );
}
