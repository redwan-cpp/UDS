import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  /**
   * A self-contained server bundle, for the VPS.
   *
   * Without this, running the site in production needs the whole 900MB
   * `node_modules` tree on the server. `standalone` traces what the server
   * actually imports and copies only that, which matters on a 20GB disk and
   * shortens every deploy. `deployment.md` Part 8 runs the output directly.
   */
  output: "standalone",

  // The practice page moved from /studio to /about. Permanent, so a search
  // engine or a bookmark from before the rename lands on the current page
  // instead of a 404.
  async redirects() {
    return [{ source: "/studio", destination: "/about", permanent: true }];
  },

  /**
   * Cache the media that is not fingerprinted.
   *
   * `/_next/static` is already cached for a year, because its filenames carry
   * a content hash. These paths do not: `public/` files were served
   * `max-age=0` and CMS uploads with no `Cache-Control` at all, so a returning
   * visitor re-checked the hero video, its poster and every logo on each page
   * load — measured on the live site.
   *
   * A day, then revalidated in the background for a week. Not `immutable` and
   * not a year: these names are not hashed, and the shipped hero clip keeps
   * its filename when it is re-encoded, so a much longer lifetime would pin an
   * old file in returning visitors' browsers. A day removes nearly all repeat
   * requests and stays safe.
   */
  async headers() {
    const cached = [
      {
        key: "Cache-Control",
        value: "public, max-age=86400, stale-while-revalidate=604800",
      },
    ];
    return [
      { source: "/media/:path*", headers: cached },
      { source: "/brand/:path*", headers: cached },
      { source: "/illustration/:path*", headers: cached },
      { source: "/api/media/file/:path*", headers: cached },
      { source: "/api/videos/file/:path*", headers: cached },
    ];
  },

  images: {
    // AVIF first, WebP as the fallback. On photography this is the single
    // largest reduction in bytes decoded per scroll, and decode cost is what
    // actually stutters a scroll on a media-heavy page.
    formats: ["image/avif", "image/webp"],

    // Next offers derivatives up to 3840w by default. Nothing here benefits:
    // the demo sources are 2400px, and the widest container the design allows
    // is 1680px. Offering sizes the source cannot fill only invites the browser
    // to pick a larger candidate and decode more pixels than the layout uses.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],

    // Thumbnail tier, matched to the grid and index cards.
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Payload builds media `url`s as absolute (via `NEXT_PUBLIC_SERVER_URL`,
    // see payload.config.ts), not relative paths. The image optimizer treats
    // any absolute URL as remote and rejects it with a 400 unless the
    // hostname is allow-listed here — even when it's the site's own domain.
    remotePatterns: [
      { protocol: "https", hostname: "uthandesignstudio.com" },
      { protocol: "https", hostname: "www.uthandesignstudio.com" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

/* `withPayload` is what lets the admin panel live inside this app: it wires
   Payload's server-only packages through the bundler and keeps them out of the
   marketing pages' client graph. The public site's dependency profile is the
   condition of the ruler.md §5 exemption, so that separation is the thing to
   re-check on every Payload upgrade. */
export default withPayload(nextConfig);
