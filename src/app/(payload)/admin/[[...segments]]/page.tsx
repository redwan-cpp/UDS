/* Every admin screen. Payload routes them all through one optional catch-all,
 * so this file is the whole panel. */
import type { Metadata } from "next";
import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
import config from "@payload-config";

import { importMap } from "../importMap.js";

type Args = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
};

export const generateMetadata = ({
  params,
  searchParams,
}: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams });

export default function Page({ params, searchParams }: Args) {
  return RootPage({ config, params, searchParams, importMap });
}
