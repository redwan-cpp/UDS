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
  //
  // /pricing, /services and /team are not renames of anything in this build —
  // they are what Google still has indexed from the studio's previous site,
  // from before this rebuild. They currently 404. A stale search result
  // pointing at a dead page is worse than one pointing at the closest real
  // page this site actually has; these are best-effort landings, not URLs
  // this project ever served itself.
  async redirects() {
    return [
      { source: "/studio", destination: "/about", permanent: true },
      { source: "/team", destination: "/about#team", permanent: true },
      { source: "/services", destination: "/about#expertise", permanent: true },
      { source: "/pricing", destination: "/contact", permanent: true },
    ];
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

    /**
     * Security headers — Phase 4 (`project-requirement.md` §11). Static,
     * not middleware: this site's own inline scripts (the motion boot
     * script, `application/ld+json` structured data) are either fixed or
     * CSP-exempt by type, so nothing here is genuinely per-request — a
     * nonce would have forced every route dynamic (verified: it did,
     * before this was rewritten) for no real gain.
     *
     * `script-src` carries `'unsafe-inline'`, and that was not the first
     * attempt. A hash-only policy (covering just this site's own fixed
     * boot script) was built, shipped through a real production build, and
     * loaded in a browser against the actual output — and Next's own App
     * Router turned out to inject several inline scripts of its own for
     * RSC/streaming payload delivery, a different one on every render, with
     * no way to hash them statically and no supported way to turn the
     * mechanism off. Blocking them didn't just lose structured data or
     * animation — it broke hydration outright (`React error #412`) on
     * every route tested. A nonce would cover them, correctly, at the cost
     * of the dynamic-rendering regression above. Given this app's own
     * performance requirements (`project-requirement.md` §13) and how much
     * of this project's effort has gone into keeping routes static/ISR
     * (`generateStaticParams` on every `[slug]` route, the whole `memory.md`
     * record of image/bundle work), `'unsafe-inline'` on this one directive
     * is the deliberate trade, not an oversight — every other directive
     * below stays strict.
     *
     * Scoped to the public site only (`/admin` and `/api` excluded):
     * Payload's own admin UI is not audited against this policy, and a
     * strict `frame-ancestors`/`form-action` here could silently break the
     * panel on something this config has no visibility into. Tightening
     * the admin surface's headers too is worth doing, but as a checked
     * follow-up against what the panel actually loads, not a guess that
     * risks the studio's only way to manage the site.
     */
    // React's dev mode uses eval() to reconstruct stack traces across the
    // Turbopack/HMR boundary — "React will never use eval() in production
    // mode" per its own warning when this is missing. Dev-only so the
    // production policy stays as strict as it can actually be.
    // Turnstile.tsx loads Cloudflare's widget script and renders its
    // challenge in an iframe from this same origin; ContactForm.tsx's own
    // fetch to /api/enquiries stays same-origin (Cloudflare's verification
    // call happens server-side in Enquiries.ts, which is never subject to
    // the browser's CSP at all). Present in the policy even while the
    // studio's Turnstile keys are unset — Turnstile.tsx renders nothing
    // without a site key, so the allowance is simply unused until then,
    // not a live gap.
    const CLOUDFLARE = "https://challenges.cloudflare.com";
    const scriptSrc =
      process.env.NODE_ENV === "production"
        ? `script-src 'self' 'unsafe-inline' ${CLOUDFLARE}`
        : `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${CLOUDFLARE}`;

    const csp = [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      `connect-src 'self' ${CLOUDFLARE}`,
      // The studio's Google Maps embed (StudioMap.tsx) and the Turnstile
      // challenge iframe are the only third-party content on the site —
      // the privacy page discloses the Maps embed as such and should be
      // updated to name Turnstile too once it's actually configured.
      `frame-src 'self' https://www.google.com ${CLOUDFLARE}`,
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; ");

    const security = [
      { key: "Content-Security-Policy", value: csp },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value:
          "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
      },
      // A promise to the browser, not the server: Caddy terminates TLS in
      // front of this app (`deployment.md` Part 9), but the header still
      // has to come from the app the browser is actually talking to.
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
    ];

    return [
      { source: "/media/:path*", headers: cached },
      { source: "/brand/:path*", headers: cached },
      { source: "/illustration/:path*", headers: cached },
      { source: "/api/media/file/:path*", headers: cached },
      { source: "/api/videos/file/:path*", headers: cached },
      { source: "/((?!admin|api).*)", headers: security },
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
