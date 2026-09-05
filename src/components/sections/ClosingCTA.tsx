import Image from "next/image";

import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { Eyebrow, Statement } from "@/components/typography";
import { Reveal } from "@/components/motion/Reveal";
import type { SectionCopy } from "@/types/content";

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
 *
 * The drawing beside it is the studio's own supplied asset, line art in the
 * ink token on the paper ground. It is decorative and takes `alt=""`: the
 * heading and the button already say what this section is for, and describing
 * two people at a table would only make a screen reader read out something
 * the page has already said. Served as a file rather than inlined — it is
 * ~108KB of traced path data, which caches once but would otherwise sit in
 * the homepage's HTML on every visit.
 */
export function ClosingCTA({
  closing,
  copy,
  actionLabel,
}: {
  closing: string;
  copy: SectionCopy;
  actionLabel: string;
}) {
  return (
    <Section surface="light" spacing="pivotal" labelledBy="closing-heading">
      <Container>
        <Reveal>
          <div className="flex items-baseline gap-4 pb-4">
            <span data-numeric className="text-meta uppercase text-accent">
              {copy.index}
            </span>
            <Eyebrow>{copy.eyebrow}</Eyebrow>
          </div>
          <div className="h-px w-full bg-hairline" />
        </Reveal>

        <div className="grid grid-cols-1 gap-x-(--grid-gap) gap-y-12 pt-12 md:pt-16 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            {/* The section's accessible name, and the same string as the
                button below it. Bound to the same value rather than repeated:
                left as a literal it would keep saying "Start a conversation"
                after the visible button had been renamed to something else,
                which is the kind of drift only a screen reader user meets. */}
            <h2 id="closing-heading" className="sr-only">
              {actionLabel}
            </h2>
            <Reveal>
              <Statement as="p" className="max-w-[26ch]">
                {closing}
              </Statement>
            </Reveal>
            <Reveal delay={0.1}>
              <ButtonLink href="/contact" variant="primary" className="mt-10">
                {actionLabel}
                <Arrow />
              </ButtonLink>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.1}>
              {/* `unoptimized`: Next's optimizer refuses SVG unless
                  `dangerouslyAllowSVG` is set globally, and that flag would
                  apply to every image it ever handles, remote ones included —
                  a real widening of the attack surface to buy nothing, since
                  there is no raster work to do on a vector. Width and height
                  are still declared, which is what reserves the space. */}
              <Image
                src="/illustration/conversation.svg"
                alt=""
                width={2752}
                height={1536}
                unoptimized
                className="h-auto w-full"
              />
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
