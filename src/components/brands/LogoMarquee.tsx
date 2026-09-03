import Image from "next/image";

import type { Brand } from "@/types/content";

/**
 * The collaborator slider, on the dark band beneath the figures.
 *
 * It renders a mark where `Brand.logo` exists and the name set in type where it
 * does not — which today is all of them, on purpose: inventing logos for real
 * companies would be forging their identity, and the studio has not supplied
 * permissions or assets. The component does not need changing when they do.
 *
 * The motion is a CSS animation on a duplicated track, not a JS ticker: the
 * list is rendered twice and translated by exactly -50%, so the second copy
 * lands where the first began and the loop has no seam. Nothing measures
 * anything, nothing runs per frame in JavaScript, and under reduced motion the
 * animation simply does not apply — the row becomes a static, scrollable strip.
 */
export function LogoMarquee({ brands }: { brands: Brand[] }) {
  if (brands.length === 0) return null;

  // Two identical passes. The second is hidden from assistive technology so the
  // names are not announced twice.
  const track = [
    { items: brands, hidden: false },
    { items: brands, hidden: true },
  ];

  return (
    <div className="uds-marquee" aria-label="Collaborators and consultants">
      <div className="uds-marquee__track">
        {track.map((pass, passIndex) => (
          <ul
            key={passIndex}
            className="uds-marquee__pass"
            aria-hidden={pass.hidden || undefined}
          >
            {pass.items.map((brand) => (
              <li key={`${passIndex}-${brand.id}`} className="uds-marquee__item">
                {brand.logo ? (
                  <Image
                    src={brand.logo.src}
                    alt={brand.logo.alt}
                    width={brand.logo.width}
                    height={brand.logo.height}
                    className="h-8 w-auto object-contain"
                  />
                ) : (
                  <span className="text-h3 whitespace-nowrap text-paper/70">
                    {brand.name}
                  </span>
                )}
                <span
                  aria-hidden="true"
                  className="ml-10 block h-1.5 w-1.5 shrink-0 rounded-full bg-pistachio/60 lg:ml-14"
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
