import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/typography";
import type { Statistic } from "@/types/content";

/**
 * The figures band.
 *
 * Presented as a measured index rather than four boxes: each figure sits in its
 * own column separated by a vertical hairline, numerals set at heading scale
 * and tabular so nothing shifts while they count. On a dark surface, between two
 * light ones, so it reads as a held pause in the scroll.
 */
export function Numbers({ statistics }: { statistics: Statistic[] }) {
  if (statistics.length === 0) return null;

  return (
    <Section surface="dark" spacing="standard" label="The studio in figures">
      <Container>
        <Reveal variant="rule">
          <div className="h-px w-full bg-hairline" />
        </Reveal>

        <dl className="grid grid-cols-2 gap-px pt-10 lg:grid-cols-4">
          {statistics.map((stat, i) => (
            <Reveal
              key={stat.id}
              delay={i * 0.08}
              className="flex flex-col gap-4 py-6 lg:border-l lg:border-hairline lg:first:border-l-0 lg:pl-8 lg:first:pl-0"
            >
              <dt className="order-2">
                <Eyebrow>{stat.label}</Eyebrow>
              </dt>
              <dd className="order-1 text-h1 text-paper">
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
    </Section>
  );
}
