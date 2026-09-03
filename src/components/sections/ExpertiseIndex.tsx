"use client";

import { useState } from "react";

import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { Arrow } from "@/components/ui/Button";
import { SectionHead } from "@/components/typography";
import { Reveal } from "@/components/motion/Reveal";
import type { ExpertiseArea } from "@/types/content";

/**
 * The expertise index.
 *
 * Set as a numbered list separated by hairlines — how a drawing set or a
 * publication contents page is organised, and the alternative to nine
 * identical cards in a grid.
 *
 * Two authored compositions rather than one reflowed layout (design.md §7):
 *   Desktop — rows on the left, a single sticky image on the right that follows
 *             whichever row is hovered or focused. The image is decorative and
 *             duplicates nothing.
 *   Mobile  — each row carries its own image inline, because there is no hover
 *             and no room for a companion panel. The desktop panel is
 *             `display: none` there, so its images are never fetched.
 */
/**
 * How many rows show on a narrow viewport before "Show all" is needed.
 *
 * Below `lg` every row carries its own inline image (there is no room for the
 * desktop's sticky companion), which makes the full list a long stretch of
 * scroll before a mobile visitor reaches any actual project photography —
 * the strongest persuasive thing on the homepage. Capping the initial list
 * keeps the rest one tap away instead of removing it.
 */
const MOBILE_PREVIEW_COUNT = 4;

export function ExpertiseIndex({ areas }: { areas: ExpertiseArea[] }) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);

  if (areas.length === 0) return null;

  const hiddenCount = Math.max(areas.length - MOBILE_PREVIEW_COUNT, 0);

  return (
    <Section
      id="expertise"
      surface="dark"
      spacing="standard"
      labelledBy="expertise-heading"
    >
      <Container>
        <Reveal>
          <SectionHead
            index="03"
            eyebrow="What we do"
            title="Expertise"
            id="expertise-heading"
            aside={
              <p className="text-small text-secondary">
                Nine areas of work, run by one team. Most projects touch several
                of them, which is the point.
              </p>
            }
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-x-(--grid-gap) pt-12 lg:grid-cols-12 lg:pt-16">
          <ul className="lg:col-span-7">
            {areas.map((area, i) => (
              <li
                key={area.id}
                className={`border-t border-hairline last:border-b ${
                  i >= MOBILE_PREVIEW_COUNT && !expanded ? "hidden lg:block" : ""
                }`}
              >
                {/* Not focusable: the row is not a control, and adding a tab
                    stop that only swaps a decorative image is a keyboard trap
                    with no payoff. Everything here is already text. */}
                <div
                  onMouseEnter={() => setActive(i)}
                  className="group grid grid-cols-[auto_1fr] items-baseline gap-x-5 py-6 transition-colors duration-[var(--dur-base)] md:gap-x-8 md:py-8"
                >
                  <span
                    data-numeric
                    className="text-meta uppercase text-secondary transition-colors duration-[var(--dur-fast)] group-hover:text-accent"
                  >
                    {area.index}
                  </span>

                  <div>
                    <h3 className="text-h3 transition-transform duration-[var(--dur-base)] ease-out-soft group-hover:translate-x-2 motion-reduce:transform-none motion-reduce:transition-none">
                      {area.title}
                    </h3>
                    <p className="mt-3 max-w-[52ch] text-small text-secondary">
                      {area.description}
                    </p>

                    {/* Mobile-only companion image. */}
                    <div className="mt-6 lg:hidden">
                      <Media
                        asset={area.image}
                        ratio="landscape"
                        sizes="(min-width: 768px) 70vw, 100vw"
                      />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {hiddenCount > 0 && !expanded && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="group flex min-h-11 items-center gap-3 border-b border-hairline py-6 text-meta uppercase text-secondary transition-colors duration-[var(--dur-fast)] hover:text-accent lg:hidden"
            >
              Show all {areas.length} areas
              <Arrow className="transition-transform duration-[var(--dur-base)] ease-out-soft group-hover:translate-x-1 motion-reduce:transition-none" />
            </button>
          )}

          {/* Desktop-only sticky companion. Decorative: every row already
              carries its title and description in text. */}
          <div
            aria-hidden="true"
            className="hidden lg:col-span-4 lg:col-start-9 lg:block"
          >
            <div className="sticky top-32">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-ink-soft">
                {areas.map((area, i) => (
                  <div
                    key={area.id}
                    data-active={i === active || undefined}
                    className="fade-layer absolute inset-0"
                  >
                    <Media asset={area.image} ratio="tall" sizes="30vw" />
                  </div>
                ))}
              </div>
              <p className="mt-4 text-meta uppercase text-secondary">
                <span data-numeric className="text-accent">
                  {areas[active].index}
                </span>{" "}
                {areas[active].title}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
