import type { ElementType, ReactNode } from "react";

import { Reveal } from "@/components/motion/Reveal";
import type { Paragraph } from "@/types/content";

/**
 * The typographic vocabulary. Every heading, label and statement on the site is
 * one of these — which is what keeps hierarchy carried by type rather than by
 * decoration, and stops each page inventing its own scale.
 */

interface BaseProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Present so a heading rendered through these can label a landmark. */
  id?: string;
}

/**
 * The small uppercase label: section indices, categories, years, field labels.
 * The only uppercase style in the system.
 */
export function Eyebrow({ children, className = "", as: Tag = "span", id }: BaseProps) {
  return (
    <Tag id={id} className={`block text-meta uppercase text-secondary ${className}`}>
      {children}
    </Tag>
  );
}

/** The editorial voice — set in the serif, used sparingly for real statements. */
export function Statement({ children, className = "", as: Tag = "p", id }: BaseProps) {
  return (
    <Tag id={id} className={`font-serif text-statement text-balance ${className}`}>
      {children}
    </Tag>
  );
}

/**
 * Renders one `Paragraph` inline: a plain string as-is, or a `RichParagraph`'s
 * `html` as safe inline markup (bold, italic, underline, strikethrough,
 * sub/superscript, links — no block wrapper, so it nests inside whatever
 * element the caller already renders). Shared by `Prose` and by anywhere else
 * a single paragraph is pulled out and shown on its own, such as a lead
 * statement — the CMS content shape is the same either way.
 */
export function RichText({ paragraph }: { paragraph: Paragraph }) {
  if (typeof paragraph === "string") return <>{paragraph}</>;
  // See the note on `Prose` below: this html is inline-only and CMS-authored
  // by an access-controlled editor, not public input.
  return (
    <span
      className="[&_a]:text-accent [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-4"
      dangerouslySetInnerHTML={{ __html: paragraph.html }}
    />
  );
}

/**
 * Long-form narrative body, for project descriptions and articles.
 *
 * Each paragraph reveals on its own scroll trigger rather than sharing one
 * trigger for the whole block. A description can run to five or six
 * paragraphs — several screens of text — and a single reveal on the wrapper
 * fires once, when its top crosses the trigger line, then finishes in well
 * under a second. On a block that tall the animation is long done before the
 * reader has scrolled far enough to see most of it: everything below the
 * first paragraph or two arrives already at full opacity, which is what "pops
 * in from nothing" actually was. Giving each paragraph its own trigger means
 * each one animates when it individually nears the fold, the way the rest of
 * the site's scroll reveals already behave.
 */
export function Prose({
  paragraphs,
  className = "",
}: {
  paragraphs: Paragraph[];
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      {paragraphs.map((p, i) => (
        <Reveal
          key={i}
          as="p"
          delay={Math.min(i, 2) * 0.05}
          className="font-serif text-body-serif text-pretty"
        >
          <RichText paragraph={p} />
        </Reveal>
      ))}
    </div>
  );
}

interface SectionHeadProps {
  /** Two-digit index, e.g. "03". Part of the architectural-index language. */
  index?: string;
  eyebrow?: string;
  title: ReactNode;
  id?: string;
  /** Sits opposite the title on wide screens; usually a short line or a link. */
  aside?: ReactNode;
  level?: 2 | 3;
  className?: string;
}

/**
 * The standard section opener: index and eyebrow above a rule, heading below.
 * The rule is what carries structure — not a box around anything.
 */
export function SectionHead({
  index,
  eyebrow,
  title,
  id,
  aside,
  level = 2,
  className = "",
}: SectionHeadProps) {
  const Heading = level === 2 ? "h2" : "h3";

  return (
    <header className={className}>
      {(index || eyebrow) && (
        <div className="flex items-baseline gap-4 pb-4">
          {index && (
            <span className="text-meta uppercase text-accent" data-numeric>
              {index}
            </span>
          )}
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        </div>
      )}

      <div className="h-px w-full bg-hairline" />

      <div className="flex flex-col gap-6 pt-8 md:flex-row md:items-end md:justify-between md:gap-16">
        <Heading id={id} className="text-h2 max-w-[18ch]">
          {title}
        </Heading>
        {aside && <div className="shrink-0 md:max-w-[34ch]">{aside}</div>}
      </div>
    </header>
  );
}
