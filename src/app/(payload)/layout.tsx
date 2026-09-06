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
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import config from "@payload-config";

import { importMap } from "./admin/importMap.js";

import "./custom.scss";

/* The admin's server actions all arrive through this one entry point, which is
 * why it is declared here rather than inside the panel: `'use server'` has to
 * sit in a module the App Router owns. */
const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({ ...args, config, importMap });
};

export default function PayloadLayout({ children }: { children: ReactNode }) {
  return (
    <RootLayout
      config={config}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  );
}
