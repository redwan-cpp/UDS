import type { CollectionConfig } from "payload";
import { APIError } from "payload";

/**
 * Enquiries from the contact form.
 *
 * Saved first, emailed second — and the order is the point. An email that
 * fails (a changed Gmail password, a network blip, a spam filter) must not
 * lose the enquiry, so the record is written before anything is sent, and the
 * panel is the place to look if a message never reached the inbox.
 *
 * **Anyone may create; only staff may read.** Creating is public because the
 * form is public. Reading, editing and deleting need a login, so a stranger
 * can post an enquiry but cannot list everybody else's.
 *
 * Public create is a spam surface, so defences sit in front of it: length
 * limits on every field, a hidden field only a bot fills in, a per-address
 * rate limit, a site-wide one, and Turnstile against a determined attacker —
 * see `turnstileOk` below, dormant until `TURNSTILE_SECRET_KEY` is set.
 *
 * **Kept for 10 days, then deleted, read or not.** The studio reads enquiries
 * here and declined email, so this is the only copy — deleting unread ones was
 * their explicit choice (`memory.md`). The email code below stays dormant until
 * `SMTP_USER` / `SMTP_PASS` are set.
 */

/** Per visitor address, within the window. Generous for a person, useless for a script. */
const RATE_LIMIT = 5;
/**
 * Across all visitors, within the same window. A botnet sends from thousands of
 * addresses, so the per-address limit alone would let it fill the database and
 * burn through Gmail's daily sending quota, which would get the studio's account
 * suspended. The cost is that during a flood a real visitor may be turned away
 * for a few minutes; the message tells them to email instead.
 */
const GLOBAL_LIMIT = 20;
const WINDOW_MS = 10 * 60 * 1000;
/** Enquiries older than this are deleted, read or not. */
const RETENTION_MS = 10 * 24 * 60 * 60 * 1000;
// ponytail: in-memory, per process — right for this single-instance server,
// but it resets on restart and needs a shared store if the site ever runs as
// more than one process.
const recent = new Map<string, number[]>();

/**
 * Verifies a Turnstile token against Cloudflare's own endpoint.
 *
 * Dormant until `TURNSTILE_SECRET_KEY` is set — same pattern as the SMTP
 * email code below: a studio that has not configured Cloudflare yet still
 * gets a working form, guarded by the honeypot and rate limits alone, rather
 * than one that silently rejects every submission.
 */
async function turnstileOk(
  token: unknown,
  remoteAddress: string,
  logger: { error: (obj: Record<string, unknown>) => void },
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (typeof token !== "string" || !token) return false;

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
        ...(remoteAddress !== "unknown" ? { remoteip: remoteAddress } : {}),
      }),
    });
    const result = (await res.json()) as { success?: boolean };
    return result.success === true;
  } catch (error) {
    // Cloudflare being unreachable is not the visitor's fault. Logged, not
    // blocked — the honeypot and rate limits are still standing guard.
    logger.error({ err: error, msg: "Turnstile verification failed" });
    return true;
  }
}

function clientAddress(headers: Headers) {
  // Caddy terminates the connection, so the visitor's address arrives in the
  // forwarded header rather than on the socket. Caddy replaces any forwarded
  // header a client sends, and the app port is closed by the firewall, so the
  // first entry cannot be forged to dodge the limit.
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/** Records a hit against `key`; false when the key is already at `limit`. */
function allow(key: string, limit: number, now: number) {
  const hits = (recent.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= limit) return false;
  recent.set(key, [...hits, now]);
  return true;
}

export const Enquiries: CollectionConfig = {
  slug: "enquiries",
  admin: {
    group: "Inbox",
    useAsTitle: "name",
    defaultColumns: ["name", "email", "phone", "budget", "topic", "createdAt"],
    description:
      "Every message sent through the contact form, newest first. This is the only copy: enquiries are deleted automatically after 10 days, read or not.",
  },
  defaultSort: "-createdAt",
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeOperation: [
      async ({ args, operation, req }) => {
        if (operation !== "create" || req.user) return args;

        const data = args.data as Record<string, unknown> | undefined;

        // The hidden field. People never see it; form-filling bots fill every
        // input they find. Refused with the same message as any other failure,
        // so the bot learns nothing about why.
        if (data?.website) {
          throw new APIError("The enquiry could not be sent.", 400);
        }

        const address = clientAddress(req.headers);
        if (!(await turnstileOk(data?.["cf-turnstile-response"], address, req.payload.logger))) {
          throw new APIError("The enquiry could not be sent.", 400);
        }
        // Never stored — verified once above, has no further use, and Payload
        // would otherwise reject the create with an unknown-field error since
        // no field on this collection is named `cf-turnstile-response`.
        if (data) delete data["cf-turnstile-response"];

        const now = Date.now();
        // One entry per address, so a botnet grows the map; drop stale ones.
        if (recent.size > 1000) {
          for (const [k, hits] of recent) {
            if (hits.every((t) => now - t >= WINDOW_MS)) recent.delete(k);
          }
        }
        // Per address first, so one noisy visitor cannot use up the shared allowance.
        if (!allow(address, RATE_LIMIT, now) || !allow("*", GLOBAL_LIMIT, now)) {
          throw new APIError(
            "Too many enquiries right now. Please try again in a few minutes, or email the studio directly.",
            429,
          );
        }
        return args;
      },
    ],
    afterChange: [
      ({ doc, operation, req }) => {
        if (operation !== "create") return doc;

        // Retention. Swept whenever a new enquiry arrives rather than on a
        // timer: nothing grows unless enquiries arrive, so no scheduler is
        // needed. Not awaited and not in this request's transaction, so a
        // failed sweep never fails the visitor's submission.
        void req.payload
          .delete({
            collection: "enquiries",
            where: {
              createdAt: { less_than: new Date(Date.now() - RETENTION_MS).toISOString() },
            },
            overrideAccess: true,
          })
          .catch((error: unknown) =>
            req.payload.logger.error({ err: error, msg: "Old enquiries could not be deleted" }),
          );

        const to = process.env.ENQUIRY_TO || process.env.SMTP_USER;
        if (!to) return doc;

        const panel = process.env.NEXT_PUBLIC_SERVER_URL
          ? `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/enquiries/${doc.id}`
          : undefined;

        // Not awaited. Gmail can take seconds to answer, and the visitor should
        // see their confirmation as soon as the enquiry is safely saved — which
        // it already is here. A failure is logged, not shown: the record in the
        // panel is the fallback.
        void req.payload
          .sendEmail({
            to,
            // A reply goes straight to the person who wrote, not back to the
            // studio's own sending address.
            replyTo: doc.email,
            subject: `Website enquiry — ${doc.name}${doc.topic ? ` (${doc.topic})` : ""}`,
            text: [
              `Name: ${doc.name}`,
              `Email: ${doc.email}`,
              doc.phone ? `Phone: ${doc.phone}` : "",
              doc.budget ? `Budget: ${doc.budget}` : "",
              doc.topic ? `Topic: ${doc.topic}` : "",
              doc.area ? `Area: ${doc.area}` : "",
              doc.size ? `Approximate size: ${doc.size} sq ft` : "",
              "",
              doc.message || "(No message.)",
              "",
              panel ? `Open in the panel: ${panel}` : "",
            ].join("\n"),
          })
          .catch((error: unknown) =>
            req.payload.logger.error({
              err: error,
              msg: `Enquiry ${doc.id} was saved, but the notification email failed`,
            }),
          );

        return doc;
      },
    ],
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true, maxLength: 200 },
        { name: "email", type: "email", required: true },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "phone", type: "text", maxLength: 40 },
        { name: "budget", type: "text", maxLength: 40 },
        { name: "topic", type: "text", maxLength: 200 },
        { name: "area", type: "text", maxLength: 200 },
        {
          name: "size",
          type: "text",
          maxLength: 40,
          admin: { description: "Square feet, as the visitor typed it." },
        },
      ],
    },
    { name: "message", type: "textarea", maxLength: 5000 },
  ],
};
