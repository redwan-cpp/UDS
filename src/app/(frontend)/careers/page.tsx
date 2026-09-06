import type { Metadata } from "next";

import { PageHero } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/typography";
import { Reveal } from "@/components/motion/Reveal";
import { careersIntro, openings } from "@/data/careers";
import { studio } from "@/data/studio";
import { heroCopy } from "@/data/copy";
import { sectionCopy } from "@/data/copy";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Open roles at Uthan Design Studio — architecture, interior design and fabrication.",
};

/**
 * Careers.
 *
 * The footer links here, so the roles are the page rather than a teaser that
 * sends people to an inbox. Each opening is an index row in the same register
 * as the site index and the project information tables: number, title, the
 * facts that matter, then what the role actually asks for.
 *
 * There is no application form. A form implies a backend that receives it, and
 * this build has none (Phase 1) — a form that silently drops an application is
 * a worse outcome than an email address that works.
 */
export default async function CareersPage() {
  return (
    <>
      <PageHero
        index="—"
        eyebrow={heroCopy["/careers"].eyebrow}
        title={heroCopy["/careers"].title}
        intro={careersIntro}
      />

      <Section surface="light" spacing="standard">
        <Container>
          <Reveal>
            <div className="flex items-baseline gap-4 pb-4">
              <span className="text-meta uppercase text-accent" data-numeric>
                {String(openings.length).padStart(2, "0")}
              </span>
              <Eyebrow as="h2">{sectionCopy["careers.roles"].eyebrow}</Eyebrow>
            </div>
            <div className="h-px w-full bg-hairline" />
          </Reveal>

          <ul className="mt-2">
            {openings.map((role) => (
              <li key={role.index}>
                <Reveal>
                  <article className="grid grid-cols-1 items-start gap-x-(--grid-gap) gap-y-6 border-b border-hairline py-10 lg:grid-cols-12">
                    <div className="flex items-baseline gap-4 lg:col-span-4">
                      <span
                        data-numeric
                        className="text-meta uppercase text-accent"
                      >
                        {role.index}
                      </span>
                      <div>
                        <h3 className="text-heading text-ink">{role.title}</h3>
                        <p className="mt-2 text-meta uppercase text-secondary">
                          {role.discipline} · {role.commitment}
                        </p>
                      </div>
                    </div>

                    <div className="lg:col-span-8">
                      <p className="max-w-[60ch] text-body text-pretty">
                        {role.summary}
                      </p>

                      <ul className="mt-6 flex flex-col">
                        {role.requirements.map((requirement) => (
                          <li
                            key={requirement}
                            className="flex gap-4 border-t border-hairline py-3.5 text-small text-secondary"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-2.5 h-px w-4 shrink-0 bg-accent"
                            />
                            {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal>
            <div className="mt-12 border-l border-accent pl-5">
              <Eyebrow as="h2" className="text-accent">
                How to apply
              </Eyebrow>
              <p className="mt-3 max-w-[62ch] text-body text-secondary">
                Send a portfolio and a short note about which role you are
                writing about to{" "}
                <a
                  href={`mailto:${studio.contact.email}`}
                  className="text-accent underline decoration-1 underline-offset-4"
                >
                  {studio.contact.email}
                </a>
                . We read everything that arrives, and we answer — including
                when the answer is no.
              </p>
              <p className="mt-4 max-w-[62ch] text-small text-secondary">
                Speculative applications are welcome even when nothing above
                matches. Tell us what you want to be working on.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
