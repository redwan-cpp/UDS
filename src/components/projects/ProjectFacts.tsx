import { Eyebrow } from "@/components/typography";
import { Reveal } from "@/components/motion/Reveal";
import type { ProjectFact } from "@/types/content";

/**
 * The project information table.
 *
 * A real `<dl>` in two columns, rules between rows. This appears twice on a
 * project page — once near the top as orientation and once at the end as a
 * summary — which is how printed project monographs handle it: you should
 * never have to scroll back to find the area or the year.
 */
export function ProjectFacts({
  facts,
  title = "Project information",
  id,
}: {
  facts: ProjectFact[];
  title?: string;
  id?: string;
}) {
  if (facts.length === 0) return null;

  return (
    <div>
      <Eyebrow as="h2" id={id} className="pb-5">
        {title}
      </Eyebrow>

      <Reveal as="dl" stagger={0.05} className="grid grid-cols-1 sm:grid-cols-2">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="flex items-baseline justify-between gap-6 border-t border-hairline py-3.5 sm:odd:sm:pr-8 sm:even:sm:pl-8"
          >
            <dt className="shrink-0 text-meta uppercase text-secondary">
              {fact.label}
            </dt>
            <dd className="text-right text-small">{fact.value}</dd>
          </div>
        ))}
      </Reveal>
    </div>
  );
}
