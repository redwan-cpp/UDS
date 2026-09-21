"use client";

import Script from "next/script";

/**
 * Cloudflare Turnstile — the Phase 4 bot defence `Enquiries.ts` already names.
 *
 * Renders nothing when there is no site key, which is the normal state until
 * the studio's Cloudflare keys are added — same dormant-until-configured
 * pattern as the SMTP email code. Cloudflare's own script finds this `div` by
 * its `cf-turnstile` class and injects a hidden `cf-turnstile-response` input
 * into the surrounding `<form>` once a visitor completes the challenge;
 * `ContactForm` reads that field the same way it reads every other one, so
 * nothing here needs its own submit wiring.
 *
 * `appearance="interaction-only"` shows nothing until Cloudflare's own risk
 * scoring decides a visitor needs a challenge — most people never see it, and
 * the ones who do see the least intrusive form Turnstile offers.
 */
export function Turnstile({ siteKey }: { siteKey?: string }) {
  if (!siteKey) return null;

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      <div
        className="cf-turnstile"
        data-sitekey={siteKey}
        data-appearance="interaction-only"
      />
    </>
  );
}
