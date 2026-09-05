import type { StudioProfile } from "@/types/content";

/**
 * The studio location panel.
 *
 * Rendered in the site's own register rather than Google's: the tile layer is
 * flattened to a warm monochrome by `.uds-map` and sits behind the same
 * hairline frame the rest of the interface uses, so it reads as a drawing
 * rather than as a third-party widget dropped into the page.
 *
 * This is a Google Maps embed. A previous version of this note claimed it was
 * OpenStreetMap and that it therefore set no third-party cookies, which was
 * false in both halves and contradicted the site's own privacy page — that
 * page correctly discloses the Google embed as the only third-party content on
 * the site, and is the accurate one. Anyone swapping the provider should
 * update the privacy page with it.
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
  const { mapEmbedUrl, addressLines } = contact;

  if (!mapEmbedUrl) {
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

  // The written address is still a placeholder while the pin is real, so the
  // accessible name is built from whichever is actually true rather than
  // reading out "Studio address to be confirmed" as if it were an address.
  const hasRealAddress = !addressLines.some((line) =>
    /to be confirmed|on request|placeholder/i.test(line),
  );
  const title = hasRealAddress
    ? `Map showing the studio location: ${addressLines.join(", ")}`
    : "Map showing the studio location in Dhaka, Bangladesh";

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden border border-hairline bg-paper-dim lg:aspect-auto lg:h-full lg:min-h-[26rem]">
      <iframe
        // The title is the accessible name — an untitled iframe is announced
        // as "frame" and nothing else.
        title={title}
        src={mapEmbedUrl}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        // `uds-map` flattens Google's stock palette to warm monochrome. The
        // width/height attributes on the supplied embed are dropped in favour
        // of filling the panel, so the map is responsive rather than a fixed
        // 600×450 block that overflows its column.
        className="uds-map h-full w-full"
      />
    </div>
  );
}
