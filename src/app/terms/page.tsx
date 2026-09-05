import type { Metadata } from "next";

import { PageHero } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/typography";
import { studio } from "@/data/studio";
import { heroCopy } from "@/data/copy";
import { sectionCopy } from "@/data/copy";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for the Uthan Design Studio website.",
  robots: { index: false },
};

/**
 * Placeholder legal page — see the note in `privacy/page.tsx`. It exists so the
 * footer link resolves; the content is a legal document the studio must supply.
 */
export default function TermsPage() {
  return (
    <>
      <PageHero
        index="—"
        eyebrow={heroCopy["/terms"].eyebrow}
        title={heroCopy["/terms"].title}
        intro={heroCopy["/terms"].intro}
      />

      <Section surface="light" spacing="standard">
        <Container width="text" className="mx-auto">
          <div className="border-l border-accent pl-5">
            <Eyebrow as="h2" className="text-accent">
              Not yet written
            </Eyebrow>
            <p className="mt-3 text-body text-secondary">
              Terms of use are a legal document specific to the studio and its
              jurisdiction. Drafting placeholder terms would create the
              impression of commitments nobody has agreed to.
            </p>
          </div>

          <div className="mt-12 border-t border-hairline pt-8">
            <Eyebrow as="h2">{sectionCopy["terms.content"].eyebrow}</Eyebrow>
            <p className="mt-5 text-small text-secondary">
              Every project, statistic, team member, collaborator and news entry
              on this site is placeholder content created for design review, and
              none of it describes real work by Uthan Design Studio. Photography
              is openly licensed demo media from Wikimedia Commons; the creator,
              licence and source of each file is recorded in the repository at{" "}
              <code>public/media/CREDITS.json</code> and shown in image captions
              where those images appear.
            </p>
          </div>

          <p className="mt-10 text-small text-secondary">
            Questions in the meantime:{" "}
            <a
              href={`mailto:${studio.contact.email}`}
              className="text-accent underline decoration-1 underline-offset-4"
            >
              {studio.contact.email}
            </a>
          </p>
        </Container>
      </Section>
    </>
  );
}
