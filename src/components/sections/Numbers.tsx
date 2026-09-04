import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/typography";
import { LogoMarquee } from "@/components/brands/LogoMarquee";
import { TerraceMotif } from "@/components/ui/TerraceMotif";
import type { Brand, Statistic } from "@/types/content";

/**
 * The figures band.
 *
 * Presented as a measured index rather than four boxes: each figure sits in its
 * own column separated by a vertical hairline, numerals set at heading scale
 * and tabular so nothing shifts while they count. On a dark surface, between two
 * light ones, so it reads as a held pause in the scroll.
 */
export function Numbers({
  statistics,
  brands = [],
}: {
  statistics: Statistic[];
  brands?: Brand[];
}) {
  if (statistics.length === 0) return null;

  return (
    <Section surface="dark" spacing="standard" label="The studio in figures">
      {/* Full-bleed, behind everything, decorative only — a texture on the
          "held pause" this band already is, not a second thing to read. */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden opacity-20">
        <TerraceMotif />
      </div>

      {/* `relative`, so the figures paint in the positioned layer above the
          motif behind them. An absolutely positioned sibling otherwise paints
          over in-flow text, which the motif was quietly doing — invisible at
          20% of a hairline tone, but wrong. */}
      <Container className="relative">
        <Reveal variant="rule">
          <div className="h-px w-full bg-hairline" />
        </Reveal>

        {/* Each figure is its own hover target: the rule above it draws in and
            the numeral lifts to the accent. It is the same gesture the nav and
            the project index already use, so the band reads as part of the
            interface rather than as a static infographic dropped into it. */}
        <dl className="grid grid-cols-2 gap-px pt-10 lg:grid-cols-4">
          {statistics.map((stat, i) => (
            <Reveal
              key={stat.id}
              delay={i * 0.08}
              className="group/stat relative flex flex-col gap-4 py-6 lg:border-l lg:border-hairline lg:first:border-l-0 lg:pl-8 lg:first:pl-0"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 block h-px origin-left scale-x-0 bg-accent transition-transform duration-[var(--dur-slow)] ease-out-soft group-hover/stat:scale-x-100 motion-reduce:transition-none lg:left-8 lg:first:left-0"
              />
              <dt className="order-2">
                <Eyebrow className="transition-colors duration-[var(--dur-base)] group-hover/stat:text-accent">
                  {stat.label}
                </Eyebrow>
              </dt>
              <dd className="order-1 text-h1 text-paper transition-[color,transform] duration-[var(--dur-slow)] ease-out-soft group-hover/stat:-translate-y-1 group-hover/stat:text-accent motion-reduce:transform-none motion-reduce:transition-none">
                <Counter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>

      {/* Full-bleed, so the names run edge to edge rather than stopping at the
          container — the band is the slider, not a box inside it. */}
      {brands.length > 0 && (
        <div className="mt-14 border-t border-hairline pt-12">
          <LogoMarquee brands={brands} />
        </div>
      )}
    </Section>
  );
}
