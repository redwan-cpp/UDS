import type { GlobalConfig } from "payload";

import { paragraphs, stringList } from "../collections/fields";

/**
 * The studio itself — one record, not a collection.
 *
 * Everything here is a fact about Uthan Design Studio, which makes this the
 * single most dangerous file in the CMS to fill in carelessly. `memory.md` is
 * unambiguous: every business fact is currently a placeholder, and nothing
 * about the studio may be invented to fill a layout. The field descriptions
 * below say so where it matters, because the person typing into them will not
 * have read `memory.md`.
 *
 * Two fields carry consequences beyond their own page:
 *
 * - **`mapEmbedUrl`** loads Google content and sets Google cookies. The privacy
 *   page discloses that as the site's only third-party content. Clearing or
 *   changing this field means revisiting that page — it is a factual claim
 *   about what the site does, not a caption.
 * - **`social[].href`** is optional on purpose. An unsupplied profile renders
 *   as an unlinked label; `ruler.md` forbids a link that goes nowhere, and a
 *   guessed profile URL either 404s or lands on a stranger.
 */
export const Studio: GlobalConfig = {
  slug: "studio",
  admin: {
    group: "Settings",
    description:
      "Facts about the studio. Nothing here may be invented to fill a layout — leave a field empty rather than guessing.",
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Identity",
          fields: [
            { name: "name", type: "text", required: true },
            {
              name: "tagline",
              type: "text",
              required: true,
              admin: {
                description:
                  "The hero setting. Short — it is display type, not a paragraph.",
              },
            },
            stringList("disciplines", {
              singular: "Discipline",
              plural: "Disciplines",
              required: true,
            }),
            {
              name: "services",
              type: "array",
              required: true,
              minRows: 1,
              labels: { singular: "Service line", plural: "Service lines" },
              admin: {
                description:
                  "Set along the hero's baseline rule. Each carries where it goes — which work stands for which service is a content decision, so the destination lives here rather than in the component.",
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "label", type: "text", required: true },
                    { name: "href", type: "text", required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Words",
          fields: [
            paragraphs("statement", {
              required: true,
              description: "The editorial About statement. Set in the serif.",
            }),
            paragraphs("approach", {
              required: true,
              description: "Supporting paragraphs below the statement.",
            }),
            {
              name: "closing",
              type: "textarea",
              required: true,
              admin: {
                description:
                  "The homepage's closing line, immediately before the footer. Kept apart from the statement because it does a different job: those introduce the studio, this closes the page.",
              },
            },
          ],
        },
        {
          label: "Contact",
          fields: [
            {
              name: "contact",
              type: "group",
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "email", type: "email", required: true },
                    { name: "phone", type: "text", required: true },
                  ],
                },
                stringList("addressLines", {
                  singular: "Address line",
                  plural: "Address lines",
                  required: true,
                }),
                { name: "hours", type: "text" },
                {
                  name: "coordinates",
                  type: "group",
                  admin: {
                    description:
                      "The canonical location record. Kept alongside the embed URL, which is an opaque Google string that cannot be read back for a directions link or structured data.",
                  },
                  fields: [
                    {
                      type: "row",
                      fields: [
                        { name: "lat", type: "number" },
                        { name: "lon", type: "number" },
                      ],
                    },
                  ],
                },
                {
                  name: "mapEmbedUrl",
                  type: "text",
                  admin: {
                    description:
                      "Google Maps embed URL. THIS LOADS GOOGLE CONTENT AND SETS GOOGLE COOKIES — the privacy page discloses it as the site's only third-party content, so changing or clearing this means revisiting that page. Leave empty and the panel states that the location is pending rather than dropping a pin somewhere plausible.",
                  },
                },
              ],
            },
          ],
        },
        {
          label: "Links",
          fields: [
            {
              name: "social",
              type: "array",
              labels: { singular: "Channel", plural: "Channels" },
              admin: {
                description:
                  "Leave the URL empty until the studio supplies a real profile — the label then renders as plain text instead of a link that goes nowhere.",
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "label", type: "text", required: true },
                    { name: "href", type: "text" },
                  ],
                },
              ],
            },
            {
              name: "legal",
              type: "array",
              labels: { singular: "Legal link", plural: "Legal links" },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "label", type: "text", required: true },
                    { name: "href", type: "text", required: true },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
