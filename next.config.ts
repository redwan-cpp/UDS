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
  },
};

/* `withPayload` is what lets the admin panel live inside this app: it wires
   Payload's server-only packages through the bundler and keeps them out of the
   marketing pages' client graph. The public site's dependency profile is the
   condition of the ruler.md §5 exemption, so that separation is the thing to
   re-check on every Payload upgrade. */
export default withPayload(nextConfig);
