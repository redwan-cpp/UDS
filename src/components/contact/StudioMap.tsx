import type { StudioProfile } from "@/types/content";

/**
 * The studio location panel.
 *
 * Rendered in the site's own register rather than Google's: the tile layer is
 * desaturated to black and white and sits behind the same hairline frame the
 * rest of the interface uses, so it reads as a drawing rather than as a
 * third-party widget dropped into the page.
 *
 * OpenStreetMap, not Google Maps: the embed needs no API key, no billing
 * account and sets no advertising cookies — which keeps the privacy page's
 * claim that this build loads no third-party trackers true.
 *
 * When `coordinates` are absent — which is the case today, because the studio
 * address is still a placeholder — the panel says so rather than centring on a
 * plausible-looking city. A map is a factual claim about where a business is;
 * inventing one would send people to a real address that is not the studio's.
 */
export function StudioMap({
  contact,
}: {
  contact: StudioProfile["contact"];
}) {
  const { coordinates, addressLines } = contact;

  if (!coordinates) {
    return (
      <div className="relative flex aspect-[4/3] w-full flex-col justify-between overflow-hidden border border-hairline bg-ink-soft p-6 lg:aspect-auto lg:h-full lg:min-h-[26rem]">
        {/* A drawing grid, so the empty state still belongs to the site. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid grid-cols-6 grid-rows-6"
        >
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="border-r border-b border-paper/5" />
          ))}
        </div>

        <p className="relative text-meta uppercase text-secondary">Location</p>

        <div className="relative">
          <p className="text-h3 text-paper">Address to be confirmed</p>
          <p className="mt-3 max-w-[38ch] text-small text-secondary">
            The studio&rsquo;s address has not been supplied yet, so there is no
            pin to place. This panel becomes a live map the moment coordinates
            are added.
          </p>
        </div>
      </div>
    );
  }

  const { lat, lon } = coordinates;
  const delta = 0.008;
  const bbox = [lon - delta, lat - delta, lon + delta, lat + delta].join("%2C");
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden border border-hairline bg-ink-soft lg:aspect-auto lg:h-full lg:min-h-[26rem]">
      <iframe
        // The title is the accessible name — an untitled iframe is announced
        // as "frame" and nothing else.
        title={`Map showing the studio location: ${addressLines.join(", ")}`}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full grayscale contrast-125"
      />
    </div>
  );
}
