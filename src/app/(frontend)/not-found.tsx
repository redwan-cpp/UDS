import type { Metadata } from "next";

import { Container } from "@/components/ui/Container";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { Eyebrow } from "@/components/typography";
import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

/**
 * 404.
 *
 * Treated as a room rather than an error message: a large empty ground, one
 * hairline, and the number set as a plan reference. The joke is architectural
 * and quiet — this address exists on the drawing, but nothing was built there.
 */
export default function NotFound() {
  return (
    <div className="surface-dark relative flex min-h-dvh flex-col justify-center bg-ink py-32">
      {/* The drawing grid, as on the homepage hero — this is still the site. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
        <Container className="relative h-full">
          <div className="grid h-full grid-cols-12">
            {Array.from({ length: 11 }).map((_, i) => (
              <div key={i} className="border-r border-paper/5" />
            ))}
          </div>
        </Container>
      </div>

      <Container className="relative">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-(--grid-gap)">
          <div className="lg:col-span-7">
            <Eyebrow className="text-accent">Error 404</Eyebrow>

            <p
              data-numeric
              aria-hidden="true"
              className="mt-6 text-display leading-none text-paper/12"
            >
              404
            </p>

            <div className="mt-8 h-px w-full bg-hairline" />

            <RevealText
              as="h1"
              text="This space doesn't exist."
              className="mt-8 text-h1"
              immediate
              stagger={0.06}
            />

            <Reveal delay={0.3}>
              <p className="mt-8 max-w-[44ch] font-serif text-lead text-secondary">
                The address is on the drawing, but nothing was built here. It may
                have moved, or it may never have been finished.
              </p>

              <div className="mt-12 flex flex-wrap gap-4">
                <ButtonLink href="/" variant="primary">
                  Return home
                </ButtonLink>
                <ButtonLink href="/projects" variant="secondary">
                  Explore projects
                  <Arrow />
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          <div className="hidden lg:col-span-3 lg:col-start-10 lg:block lg:self-end">
            <Reveal delay={0.4}>
              <dl className="flex flex-col text-meta uppercase">
                <div className="flex justify-between gap-4 border-t border-hairline py-3">
                  <dt className="text-secondary">Status</dt>
                  <dd>Not found</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-hairline py-3">
                  <dt className="text-secondary">Level</dt>
                  <dd data-numeric>—</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-b border-hairline py-3">
                  <dt className="text-secondary">Area</dt>
                  <dd data-numeric>0 m²</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </Container>
    </div>
  );
}
