import { Reveal } from "@/components/motion/Reveal";
import type { Brand } from "@/types/content";

/**
 * Collaborators, set in type.
 *
 * No logo wall. A grid of real company marks would be false proof of
 * relationships that do not exist, and invented marks would be worthless —
 * so names are set typographically with the nature of the relationship beside
 * them, which is how practices actually credit their consultant teams anyway.
 *
 * When the studio supplies real partners and permission to show their marks,
 * `Brand.logo` is already in the content contract and this component takes it.
 */
export function BrandIndex({ brands }: { brands: Brand[] }) {
  if (brands.length === 0) return null;

  return (
    <Reveal as="ul" stagger={0.05} className="grid grid-cols-1 sm:grid-cols-2">
      {brands.map((brand, i) => (
        <li
          key={brand.id}
          className="group flex items-baseline justify-between gap-6 border-t border-hairline py-5 transition-colors duration-[var(--dur-base)] sm:odd:sm:pr-8 sm:even:sm:pl-8"
        >
          <span className="flex items-baseline gap-4">
            <span data-numeric className="text-meta uppercase text-secondary">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-h3">{brand.name}</span>
          </span>
          <span className="shrink-0 text-meta uppercase text-secondary">
            {brand.relationship}
          </span>
        </li>
      ))}
    </Reveal>
  );
}
