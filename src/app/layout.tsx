import type { Metadata, Viewport } from "next";
import { Archivo, Newsreader } from "next/font/google";

import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/footer/SiteFooter";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { LoadingSequence } from "@/components/motion/LoadingSequence";
import { PageTransition } from "@/components/motion/PageTransition";
import { MotionFailsafe } from "@/components/motion/MotionFailsafe";
import { navigation } from "@/data/navigation";
import { studio } from "@/data/studio";

import "./globals.css";

/**
 * Two families only, self-hosted at build time. No external font request keeps
 * a strict CSP achievable in Phase 4 and removes a render-blocking origin.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-newsreader",
});

/**
 * Phase 1 carries only the metadata the UI itself needs. Canonicals, Open Graph,
 * Twitter cards and JSON-LD are Phase 5 — see architecture.md §3.7.
 */
export const metadata: Metadata = {
  title: {
    default: "Uthan Design Studio — Architecture / Design / Space",
    template: "%s — Uthan Design Studio",
  },
  description:
    "Uthan Design Studio is an architecture and design practice working across architecture, interior design and spatial strategy.",
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
 */
const BOOT = `(function(){try{var d=document.documentElement;
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
d.classList.add('js-motion');
if(!sessionStorage.getItem('uds-intro'))d.classList.add('js-intro');
}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // suppressHydrationWarning on <html>: the boot script deliberately adds
  // `js-motion` / `js-intro` before React hydrates — that is the entire point
  // of it — so server and client class lists differ by design.
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${newsreader.variable}`}
    >
      <body className="bg-ink text-paper antialiased">
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />

        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <LoadingSequence />
        <SmoothScroll />
        <MotionFailsafe />

        <SiteHeader items={navigation} studioName={studio.name} />

        <main id="main" tabIndex={-1} className="outline-none">
          <PageTransition>{children}</PageTransition>
        </main>

        <SiteFooter studio={studio} items={navigation} />
      </body>
    </html>
  );
}
