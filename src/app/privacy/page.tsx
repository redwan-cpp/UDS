import type { Metadata } from "next";

import { PageHero } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/typography";
import { studio } from "@/data/studio";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Uthan Design Studio handles personal information.",
  robots: { index: false },
};

/**
 * Placeholder legal page.
 *
 * It exists because the footer links to it, and a footer link that 404s is a
 * defect. The content is deliberately not written: a privacy policy is a legal
 * document describing what a specific organisation actually does with data, and
 * drafting a plausible-sounding one would be worse than admitting it is absent.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageHero
        index="—"
        eyebrow="Legal"
        title="Privacy"
        intro="This page is a placeholder. A privacy policy has not yet been provided by the studio."
      />

      <Section surface="light" spacing="standard">
        <Container width="text" className="mx-auto">
          <div className="border-l border-accent pl-5">
            <Eyebrow as="h2" className="text-accent">
              Not yet written
            </Eyebrow>
            <p className="mt-3 text-body text-secondary">
              A privacy policy has to describe what this specific studio
              actually collects, why, where it is stored, how long it is kept
              and who it is shared with. None of that is decided yet — the
              website has no backend, no analytics and no cookies in this build —
              so writing a convincing-sounding policy here would be inventing
              legal commitments on the studio&rsquo;s behalf.
            </p>
            <p className="mt-3 text-body text-secondary">
              One thing it will have to cover: the contact page embeds a Google
              Map, so that page is not cookie-free even though the rest of the
              site is. Whether that needs a consent prompt depends on where the
              studio&rsquo;s visitors are.
            </p>
          </div>

          <div className="mt-12 border-t border-hairline pt-8">
            <Eyebrow as="h2">What this build does today</Eyebrow>
            <ul className="mt-5 flex flex-col">
              {[
                "No analytics and no tracking pixels.",
                "Fonts are self-hosted, so no request is made to a font provider.",
                "The contact flow sends nothing — answers stay in your browser.",
                "Only a first-visit flag is kept, in your browser's session storage.",
                "The contact page embeds a Google Map. Opening that page loads content from Google, which can set its own cookies and receive your IP address. This is the only third-party content on the site.",
              ].map((line) => (
                <li key={line} className="border-t border-hairline py-3.5 text-small">
                  {line}
                </li>
              ))}
            </ul>
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
