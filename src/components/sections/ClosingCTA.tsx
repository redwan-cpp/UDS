import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { Eyebrow, Statement } from "@/components/typography";
import { Reveal } from "@/components/motion/Reveal";

/**
 * The homepage's last authored beat before the footer.
 *
 * Everything above this section makes the case for the studio; the footer
 * that follows it is index, contact details and legal — reference, not
 * pitch. Without a section in between, the page's persuasive arc ran
 * straight from the work into News and then the footer, so a visitor who
 * had just been convinced had nowhere to act on it. See memory.md.
 *
 * Composed like `AboutStatement` — numbered index, eyebrow, hairline rule,
 * then a serif statement in a left-aligned column — rather than centred:
 * this site's own rule is asymmetry with a reason, never arbitrary
 * centring, and a closing CTA is not an exception to that.
 */
export function ClosingCTA({ closing }: { closing: string }) {
  return (
    <Section surface="dark" spacing="pivotal" labelledBy="closing-heading">
      <Container>
        <Reveal>
          <div className="flex items-baseline gap-4 pb-4">
            <span data-numeric className="text-meta uppercase text-accent">
              08
            </span>
            <Eyebrow>Start a project</Eyebrow>
          </div>
          <div className="h-px w-full bg-hairline" />
        </Reveal>

        <div className="pt-12 md:pt-16">
          <h2 id="closing-heading" className="sr-only">
            Start a conversation
          </h2>
          <Reveal>
            <Statement as="p" className="max-w-[26ch]">
              {closing}
            </Statement>
          </Reveal>
          <Reveal delay={0.1}>
            <ButtonLink href="/contact" variant="primary" className="mt-10">
              Start a conversation
              <Arrow />
            </ButtonLink>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
