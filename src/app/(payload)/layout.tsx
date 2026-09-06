/* The admin panel's own root layout.
 *
 * It is a sibling of `(frontend)`, not a child of it, and that is the whole
 * reason the site was moved into a route group. A single root layout would
 * wrap the admin in the marketing site's chrome: its fonts, the Lenis smooth
 * scroll, the crosshair cursor that hides the system pointer, the header and
 * the footer. An editor would be filling in a form with the system cursor
 * hidden and a scroll engine fighting the panel.
 *
 * Route groups do not appear in URLs, so nothing the site serves moved. */
import type { ReactNode } from "react";
import type { ServerFunctionClient } from "payload";
import { Barlow, Newsreader } from "next/font/google";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import config from "@payload-config";

import { importMap } from "./admin/importMap.js";

/* Payload's compiled admin stylesheet. Omitting this is what made the panel
   unnavigable rather than merely unstyled: the whole UI — the sidebar, the
   document list, every control — is laid out by these rules, so without them
   the nav collapses into unpositioned text and there is nothing to click.
   Measured before the fix: 168 CSS rules on the page in total, where the
   admin's own sheet carries thousands. */
import "@payloadcms/next/css";

/* Ours, loaded after Payload's so it can override. */
import "./custom.scss";

/* The admin's server actions all arrive through this one entry point, which is
 * why it is declared here rather than inside the panel: `'use server'` has to
 * sit in a module the App Router owns. */
const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({ ...args, config, importMap });
};

/* The site's families, declared again here rather than shared with the frontend
   layout. next/font generates a scoped variable per call site, and the two
   layouts are siblings with no common ancestor to hang one on — so the admin
   asks for the same faces in its own right. Identical arguments mean the
   browser reuses the same cached files. */
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-barlow",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-newsreader",
});

export default function PayloadLayout({ children }: { children: ReactNode }) {
  return (
    <RootLayout
      config={config}
      importMap={importMap}
      serverFunction={serverFunction}
      htmlProps={{ className: `${barlow.variable} ${newsreader.variable}` }}
    >
      {children}
    </RootLayout>
  );
}
