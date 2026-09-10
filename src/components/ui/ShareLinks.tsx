"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

import { Eyebrow } from "@/components/typography";

/**
 * Share this page to Facebook or LinkedIn.
 *
 * Plain links to each network's share endpoint, opened in a new tab. No SDK,
 * no embedded button, no script from either company — which keeps the privacy
 * page's claim true: the only third-party content this site loads is the
 * contact map. An official share widget would load their JavaScript on every
 * article and set cookies before anyone clicked anything.
 *
 * **What the reader sees on the other side is decided here, not there.** Both
 * networks scrape the shared URL for its OpenGraph tags, so the card's picture
 * and headline come from `articleMetadata` in `src/lib/share.ts`. A page
 * without those tags shares as a bare link with the domain and nothing else,
 * which is what this site did until now.
 *
 * Only Facebook and LinkedIn, because those are the two the studio asked for.
 * Adding a network means adding its endpoint here and nothing else.
 *
 * **The URL is resolved in the browser, not from configuration.** It was built
 * from `NEXT_PUBLIC_SERVER_URL`, which is empty in development — so the share
 * href came out as `?u=%2Fknowledge%2F...`, a relative path, and a network
 * handed a relative path shares its own domain. Reading `location.origin`
 * cannot be unset, cannot be stale after a domain change, and needs nothing in
 * an `.env` to be correct. The OpenGraph tags still depend on `metadataBase`,
 * as they must — a scraper never runs this code.
 */
const NETWORKS = [
  {
    label: "Facebook",
    href: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    label: "LinkedIn",
    href: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
];

export function ShareLinks({
  title,
  label = "Share",
}: {
  /** Used only for the accessible name — the card's title comes from the page's own tags. */
  title: string;
  label?: string;
}) {
  const pathname = usePathname();

  // `useSyncExternalStore` is the hook built for exactly this: a value the
  // server cannot know and the client can.
  //
  // Reading `window` during render was the first attempt and it silently did
  // not work — the server renders the relative path, the client computes an
  // absolute one, and that mismatch is reported but not patched, so the
  // anchors kept the server's href. Measured in a browser, not assumed. An
  // effect with `setState` fixes it but trips the cascading-render rule; this
  // gives the same two-pass result as the hook designed for the job, with the
  // server snapshot stated explicitly rather than inferred.
  const origin = useSyncExternalStore(
    () => () => {},
    () => window.location.origin,
    () => "",
  );

  const url = origin ? origin + pathname : pathname;

  return (
    <div className="border-t border-hairline pt-5">
      <Eyebrow as="h2">{label}</Eyebrow>
      <ul className="mt-4 flex flex-wrap gap-3">
        {NETWORKS.map((network) => (
          <li key={network.label}>
            <a
              href={network.href(url)}
              target="_blank"
              // `noopener` is the one that matters: without it the opened tab
              // gets a handle on this one and can navigate it elsewhere.
              rel="noopener noreferrer"
              aria-label={`Share “${title}” on ${network.label}`}
              className="flex min-h-11 items-center border border-hairline px-5 text-meta uppercase transition-colors duration-[var(--dur-base)] hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent"
            >
              {network.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
