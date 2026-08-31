import type { Metadata } from "next";

import { PageHero, DemoNotice } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { ContactFlow } from "@/components/contact/ContactFlow";
import { Eyebrow } from "@/components/typography";
import { studio } from "@/data/studio";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a conversation with Uthan Design Studio.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        index="07"
        eyebrow="Start a conversation"
        title="Contact"
        intro="A few questions rather than one long form. It takes about a minute, and it means the right person reads it first."
        aside={
          <DemoNotice>
            UI prototype. Nothing typed into this flow is sent, stored or
            emailed — the enquiry backend is a later phase.
          </DemoNotice>
        }
      />

      <Section surface="light" spacing="none" labelledBy="enquiry-heading">
        <h2 id="enquiry-heading" className="sr-only">
          Enquiry
        </h2>
        <ContactFlow email={studio.contact.email} />
      </Section>

      <Section surface="dark" spacing="standard" labelledBy="direct-heading">
        <Container>
          <h2 id="direct-heading" className="text-h2">
            Or reach us directly
          </h2>

          <div className="grid grid-cols-1 gap-10 pt-12 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border-t border-hairline pt-5">
              <Eyebrow as="h3">Email</Eyebrow>
              <p className="mt-3">
                <a
                  href={`mailto:${studio.contact.email}`}
                  className="text-body underline decoration-1 underline-offset-4 transition-colors hover:text-accent"
                >
                  {studio.contact.email}
                </a>
              </p>
            </div>

            <div className="border-t border-hairline pt-5">
              <Eyebrow as="h3">Telephone</Eyebrow>
              <p className="mt-3 text-body text-secondary">
                {studio.contact.phone}
              </p>
            </div>

            <div className="border-t border-hairline pt-5">
              <Eyebrow as="h3">Studio</Eyebrow>
              <address className="mt-3 not-italic text-body text-secondary">
                {studio.contact.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>

            <div className="border-t border-hairline pt-5">
              <Eyebrow as="h3">Hours</Eyebrow>
              <p className="mt-3 text-body text-secondary">
                {studio.contact.hours}
              </p>
            </div>
          </div>

          <p className="mt-10 text-caption text-secondary">
            Contact details above are placeholders pending confirmation by the
            studio.
          </p>
        </Container>
      </Section>
    </>
  );
}
