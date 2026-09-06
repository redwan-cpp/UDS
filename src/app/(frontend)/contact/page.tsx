import type { Metadata } from "next";

import { PageHero, DemoNotice } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { StudioMap } from "@/components/contact/StudioMap";
import { SocialIcon } from "@/components/contact/SocialIcon";
import { Eyebrow } from "@/components/typography";
import { studio } from "@/data/studio";
import { enquiryTopics } from "@/data/contact";
import { navIndex } from "@/data/navigation";
import { heroCopy } from "@/data/copy";
import { sectionCopy } from "@/data/copy";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a conversation with Uthan Design Studio.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        index={navIndex("/contact")}
        eyebrow={heroCopy["/contact"].eyebrow}
        title={heroCopy["/contact"].title}
        intro={heroCopy["/contact"].intro}
        aside={
          <DemoNotice>
            UI prototype. Nothing typed into this form is sent, stored or
            emailed — the enquiry backend is a later phase.
          </DemoNotice>
        }
      />

      {/* The enquiry on the left, where the studio is on the right. Two things
          a visitor arrives wanting — "how do I start this" and "where are
          you" — answered side by side instead of stacked a screen apart.
          The map column is sticky so it stays with the form, and collapses
          under it entirely on narrow screens. */}
      <Section surface="light" spacing="none" labelledBy="enquiry-heading">
        <h2 id="enquiry-heading" className="sr-only">
          Enquiry
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm
              topics={enquiryTopics}
              email={studio.contact.email}
            />
          </div>
          <div className="lg:col-span-5">
            <div className="h-full px-(--gutter) pb-16 lg:sticky lg:top-28 lg:pb-0 lg:pl-0">
              <StudioMap contact={studio.contact} />
            </div>
          </div>
        </div>
      </Section>

      <Section surface="dark" spacing="standard" labelledBy="direct-heading">
        <Container>
          <h2 id="direct-heading" className="text-h2">
            {sectionCopy["contact.direct"].title}
          </h2>

          <div className="grid grid-cols-1 gap-10 pt-12 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border-t border-hairline pt-5">
              <Eyebrow as="h3">{sectionCopy["contact.email"].eyebrow}</Eyebrow>
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
              <Eyebrow as="h3">{sectionCopy["contact.phone"].eyebrow}</Eyebrow>
              <p className="mt-3 text-body text-secondary">
                {studio.contact.phone}
              </p>
            </div>

            <div className="border-t border-hairline pt-5">
              <Eyebrow as="h3">{sectionCopy["contact.address"].eyebrow}</Eyebrow>
              <address className="mt-3 not-italic text-body text-secondary">
                {studio.contact.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>

            <div className="border-t border-hairline pt-5">
              <Eyebrow as="h3">{sectionCopy["contact.hours"].eyebrow}</Eyebrow>
              <p className="mt-3 text-body text-secondary">
                {studio.contact.hours}
              </p>
            </div>
          </div>

          {/* Channels. Rendered as labels until the studio supplies handles —
              a social icon linking to `#`, or worse to a guessed profile that
              belongs to someone else, is a defect, not a placeholder. */}
          <div className="mt-12 border-t border-hairline pt-8">
            <Eyebrow as="h3">{sectionCopy["contact.social"].eyebrow}</Eyebrow>
            <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-3">
              {studio.social.map((channel) => {
                const content = (
                  <>
                    <SocialIcon label={channel.label} />
                    {channel.label}
                  </>
                );

                return (
                  <li key={channel.label}>
                    {channel.href ? (
                      <a
                        href={channel.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-11 items-center gap-2.5 border border-hairline px-4 text-meta uppercase transition-colors duration-[var(--dur-base)] hover:border-accent hover:text-accent"
                      >
                        {content}
                      </a>
                    ) : (
                      <span className="flex min-h-11 items-center gap-2.5 border border-hairline px-4 text-meta uppercase text-secondary">
                        {content}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* The address and the map are real now — only the email, phone,
              hours and social handles are still outstanding, so the notice
              names those rather than disclaiming the whole block. */}
          <p className="mt-10 text-caption text-secondary">
            The email address, telephone number, opening hours and social
            channels above are placeholders pending confirmation by the studio.
          </p>
        </Container>
      </Section>
    </>
  );
}
