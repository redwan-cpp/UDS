import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

export default nextConfig;
