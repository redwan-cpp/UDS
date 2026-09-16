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
 * Public create is a spam surface, so three cheap defences sit in front of it:
 * length limits on every field, a hidden field only a bot fills in, and a
 * per-address rate limit. None is sophisticated; together they stop the
 * scripted noise that finds every open form within weeks of launch.
 */

/** Per visitor address, within the window. Generous for a person, useless for a script. */
const RATE_LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;
// ponytail: in-memory, per process — right for this single-instance server,
// but it resets on restart and needs a shared store if the site ever runs as
// more than one process.
const recent = new Map<string, number[]>();

function clientAddress(headers: Headers) {
  // Caddy terminates the connection, so the visitor's address arrives in the
  // forwarded header rather than on the socket.
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export const Enquiries: CollectionConfig = {
  slug: "enquiries",
  admin: {
    group: "Inbox",
    useAsTitle: "name",
    defaultColumns: ["name", "email", "topic", "createdAt"],
    description:
      "Every message sent through the contact form, newest first. Each one is also emailed to the studio; if an email never arrived, it is still here.",
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
      ({ args, operation, req }) => {
        if (operation !== "create" || req.user) return args;

        // The hidden field. People never see it; form-filling bots fill every
        // input they find. Refused with the same message as any other failure,
        // so the bot learns nothing about why.
        if ((args.data as Record<string, unknown> | undefined)?.website) {
          throw new APIError("The enquiry could not be sent.", 400);
        }

        const key = clientAddress(req.headers);
        const now = Date.now();
        const hits = (recent.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
        if (hits.length >= RATE_LIMIT) {
          throw new APIError(
            "Too many enquiries from this connection. Please try again in a few minutes, or email the studio directly.",
            429,
          );
        }
        recent.set(key, [...hits, now]);
        return args;
      },
    ],
    afterChange: [
      ({ doc, operation, req }) => {
        if (operation !== "create") return doc;

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
