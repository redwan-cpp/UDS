import type { Metadata, Viewport } from "next";
import { Barlow, Newsreader } from "next/font/google";

import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/footer/SiteFooter";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { LoadingSequence } from "@/components/motion/LoadingSequence";
import { PageTransition } from "@/components/motion/PageTransition";
import { MotionFailsafe } from "@/components/motion/MotionFailsafe";
import { CrosshairCursor } from "@/components/ui/CrosshairCursor";
import { getNavigation, getStudio, getCopy } from "@/data/content.cms";
import { getSearchIndex } from "@/data/search";
import { SITE_URL, SHARE_IMAGE, organizationJsonLd } from "@/lib/share";

import "./globals.css";

/**
 * Two families only, self-hosted at build time. No external font request keeps
 * a strict CSP achievable in Phase 4 and removes a render-blocking origin.
 *
 * Barlow is the primary, as briefed — it replaces Archivo as the structural
 * family. The brief's second family was Aeonik Pro, which is a commercial
 * licence (CoType Foundry) and cannot be fetched or bundled here; the studio
 * confirmed the existing secondary stays, so Newsreader keeps the editorial
 * register the statement and lead type is built on.
 */
//
// Only the faces the public site actually sets. Measured on the live homepage:
// seven font files, 350 KB, every one preloaded at high priority ahead of the
// hero. Two were 144 KB and 129 KB of Newsreader, the second the italic, which
// nothing uses: no `italic` class, no `<em>`, and the one element italic by
// default (`<address>`) is set `not-italic`. Barlow 700 is the same: no bold
// class, no `<strong>`, no CSS weight above 600. The admin panel's layout
// declares its own set and is unaffected.
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-barlow",
});

// Not preloaded. Every serif use is below the first screen of the homepage —
// the statement, the about copy, the closing line — so it should not jump the
// queue ahead of the hero and Barlow. The stylesheet still declares it, so it
// loads as soon as a serif line is laid out, just at normal priority.
const newsreader = Newsreader({
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal"],
  display: "swap",
  preload: false,
  variable: "--font-newsreader",
});

/**
 * Canonicals and Open Graph landed ahead of their phase, because a site that is
 * live is a site whose links get shared. JSON-LD is still Phase 5 — see
 * architecture.md §3.7.
 */
export const metadata: Metadata = {
  /**
   * The base every relative URL in metadata resolves against.
   *
   * Without it, an OpenGraph image given as `/media/x.jpg` is resolved by
   * Facebook against `facebook.com` and the share card comes back blank. Next
   * warns about this in the build log and falls back to localhost, which is
   * worse than blank — it produces cards pointing at a machine nobody else can
   * reach. Empty in development, where nothing is scraping anything.
   */
  metadataBase: SITE_URL ? new URL(SITE_URL) : undefined,
  title: {
    default: "Uthan Design Studio — Architecture / Design / Space",
    template: "%s — Uthan Design Studio",
  },
  description:
    "Uthan Design Studio is an architecture and design practice working across architecture, interior design and spatial strategy.",

  /**
   * The share card every page starts from.
   *
   * Inherited by any route that does not declare its own `openGraph`, which is
   * what gives the homepage a card and what stops a new page ever shipping
   * without one. Routes that *do* declare one replace this block wholesale —
   * Next merges metadata a key at a time, not field by field — which is why
   * `pageMetadata` in `lib/share.ts` always writes a complete block rather than
   * expecting to inherit half of this.
   */
  openGraph: {
    type: "website",
    title: "Uthan Design Studio — Architecture / Design / Space",
    description:
      "An architecture and design practice working across architecture, interior design and spatial strategy.",
    url: SITE_URL || undefined,
    siteName: "Uthan Design Studio",
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Uthan Design Studio — Architecture / Design / Space",
    description:
      "An architecture and design practice working across architecture, interior design and spatial strategy.",
    images: [SHARE_IMAGE.url],
  },

  /**
   * Google Search Console site-ownership proof, as a meta tag — the
   * alternative to `public/google646612664bfaa0c8.html`, which is left in
   * place rather than removed: Google allows more than one verification
   * method at once, and keeping both means losing one later (an accidental
   * file deletion, say) does not drop verification on its own.
   *
   * Not a secret — its only job is to be publicly visible, which is exactly
   * what the file-based version already is, committed the same way.
   */
  verification: {
    google: "Nqmpb1YTimeV8j2dVg6NCIR61kmjbohyTqBllTouDMw",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
};

/**
 * Boot script. Runs synchronously as the first thing in the body, before any
 * paint, and is the gate for the whole motion system:
 *
 *   `js-motion` — JavaScript is running and reduced motion is NOT requested, so
 *                 reveal targets may be armed into their hidden start state.
 *                 Without this class every reveal renders in its final state.
 *   `js-intro`  — additionally, this session has not seen the intro yet.
 *
 * Deciding both here, synchronously, is what avoids a flash of an overlay or of
 * content that is about to be hidden. Authored in-repo; no external input.
 *
 * **The escape hatch lives here too, not only in React.** Both classes hide
 * things until the app's JavaScript runs. If it never does — a browser older
 * than Next's baseline (Safari < 16.4), a script blocker, a dropped chunk on a
 * bad connection — `MotionFailsafe` never mounts either, and the visitor sat on
 * the intro's "000" forever with every reveal invisible. Reproduced by blocking
 * the JS chunks in Chromium. This inline ES5 runs where the bundle cannot: if
 * nothing has marked the page `data-hydrated` within 6s, both classes come off
 * and the page is shown complete, unanimated.
 */
const BOOT = `(function(){try{var d=document.documentElement;
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
d.classList.add('js-motion');
if(!sessionStorage.getItem('uds-intro'))d.classList.add('js-intro');
setTimeout(function(){if(!d.hasAttribute('data-hydrated')){d.classList.remove('js-motion');d.classList.remove('js-intro');}},6000);
}catch(e){}})();`;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { footerCopy } = await getCopy();
  // The footer, the menu overlay and the wordmark all read the studio profile,
  // and the layout is the one place above all three — so it is fetched once
  // here rather than three times below. `cache` would dedupe it anyway; this
  // also keeps the header a client component that is handed its data.
  const [studio, navigation] = await Promise.all([getStudio(), getNavigation()]);

  // suppressHydrationWarning on <html>: the boot script deliberately adds
  // `js-motion` / `js-intro` before React hydrates — that is the entire point
  // of it — so server and client class lists differ by design.
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${barlow.variable} ${newsreader.variable}`}
    >
      <body className="bg-ink text-paper antialiased">
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        {/* `<` escaped so no CMS-entered string (name, address line, tagline)
            can close this script tag early — JSON.stringify does not do that
            on its own. Content itself is safe as JSON: every value here is
            editor-authored through the CMS, not public input. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd(studio)).replace(/</g, "\\u003c"),
          }}
        />

        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <LoadingSequence />
        <SmoothScroll />
        <MotionFailsafe />
        <CrosshairCursor />

        <SiteHeader
          items={navigation}
          studio={studio}
          searchIndex={await getSearchIndex()}
        />

        <main id="main" tabIndex={-1} className="outline-none">
          <PageTransition>{children}</PageTransition>
        </main>

        <SiteFooter studio={studio} items={navigation} headings={footerCopy} />
      </body>
    </html>
  );
}
