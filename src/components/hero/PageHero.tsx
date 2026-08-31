import type { ReactNode } from "react";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/typography";

interface PageHeroProps {
  index: string;
  eyebrow: string;
  title: string;
  /** One short paragraph. If it needs two, it belongs further down the page. */
  intro?: string;
  /** Right-hand column: counts, filters, a demo notice. */
  aside?: ReactNode;
}

/**
 * The standard page opening.
 *
 * Not a hero image — the homepage owns that move, and repeating it on every
 * route would make the site read as a template of itself. Instead: an index
 * number, a rule, and the title set large on a dark ground, with the page's
 * own content starting immediately beneath.
 */
export function PageHero({ index, eyebrow, title, intro, aside }: PageHeroProps) {
  return (
    <Section
      surface="dark"
      spacing="none"
      className="pt-32 pb-16 md:pt-44 md:pb-24"
      labelledBy="page-title"
    >
      <Container>
        <div className="flex items-baseline gap-4 pb-4">
          <span data-numeric className="text-meta uppercase text-accent">
            {index}
          </span>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>

        <Reveal variant="rule" duration={0.9}>
          <div className="h-px w-full bg-hairline" />
        </Reveal>

        <div className="grid grid-cols-1 gap-8 pt-10 lg:grid-cols-12 lg:gap-(--grid-gap)">
          <div className="lg:col-span-7">
            <RevealText
              as="h1"
              id="page-title"
              text={title}
              className="text-h1"
              immediate
              stagger={0.06}
            />
          </div>

          <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
            {intro && (
              <Reveal delay={0.2}>
                <p className="max-w-[46ch] font-serif text-lead text-secondary">
                  {intro}
                </p>
              </Reveal>
            )}
            {aside && <div className={intro ? "mt-6" : ""}>{aside}</div>}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/**
 * The demo-content marker used on pages whose content would otherwise read as
 * the studio's real work. Small, set in the interface language, and honest.
 */
export function DemoNotice({ children }: { children: ReactNode }) {
  return (
    <p className="flex gap-3 border-l border-accent pl-4 text-caption text-secondary">
      <span className="shrink-0 text-meta uppercase text-accent">Demo</span>
      <span>{children}</span>
    </p>
  );
}
