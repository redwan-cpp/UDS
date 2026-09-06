import type { Field, GlobalConfig } from "payload";

/**
 * Every heading, label and standfirst the site displays that is not part of a
 * content entity.
 *
 * This mirrors `src/data/copy.ts`, which was created in Phase 1 for exactly
 * this moment: `ruler.md` forbids content literals outside `src/data`, and a
 * heading compiled into a component is one a CMS can never reach.
 * `project-requirement.md` §9 lists "Homepage" among the things editors must be
 * able to manage, and a homepage whose every heading is hard-coded does not
 * satisfy that however well the projects beneath it are modelled.
 *
 * **What is deliberately not here**, matching the line drawn in `copy.ts`:
 * accessible names, screen-reader-only headings, form field labels, validation
 * messages, and button chrome such as Close. Those are interface mechanics, not
 * studio copy. A validation message in a CMS is an invitation to break a form,
 * and an accessible name is a structural property of a control rather than
 * something to rewrite for tone.
 *
 * Page indices are absent on purpose too — those come from `navigation`, so the
 * menu stays the one place the site's numbering is decided.
 */
const head = (name: string, label: string, extra: Field[] = []): Field => ({
  name,
  type: "group",
  label,
  fields: [
    {
      type: "row",
      fields: [
        { name: "eyebrow", type: "text" },
        { name: "title", type: "text" },
      ],
    },
    ...extra,
  ],
});

export const SiteCopy: GlobalConfig = {
  slug: "copy",
  admin: {
    group: "Settings",
    description:
      "Headings and labels across the site. Content that belongs to a project, product or news item lives on that item instead.",
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
          label: "Homepage",
          description:
            "The five section heads, in the order they appear down the page. The figures band carries no head by design — it is a held pause between beats rather than another thing to read.",
          fields: [
            {
              name: "home",
              type: "group",
              label: " ",
              fields: [
                head("about", "01 — The studio"),
                head("expertise", "02 — What we do"),
                head("projects", "03 — Selected work", [
                  {
                    name: "aside",
                    type: "textarea",
                    admin: { description: "Sits opposite the title on wide screens." },
                  },
                ]),
                head("news", "04 — From the studio"),
                head("closing", "05 — Start a project"),
              ],
            },
          ],
        },
        {
          label: "Page heroes",
          description:
            "Keyed by route. The number beside each title comes from the menu, not from here.",
          fields: [
            {
              name: "heroes",
              type: "array",
              labels: { singular: "Page hero", plural: "Page heroes" },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "route",
                      type: "text",
                      required: true,
                      admin: { description: "e.g. /projects" },
                    },
                    { name: "eyebrow", type: "text" },
                    { name: "title", type: "text" },
                  ],
                },
                {
                  name: "intro",
                  type: "textarea",
                  admin: {
                    description:
                      "The standfirst. Leave empty where the page builds it from content instead — About opens with the studio statement.",
                  },
                },
              ],
            },
          ],
        },
        {
          label: "Sections",
          description: "Headings inside routes, keyed route.section.",
          fields: [
            {
              name: "sections",
              type: "array",
              labels: { singular: "Section head", plural: "Section heads" },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "key",
                      type: "text",
                      required: true,
                      admin: { description: "e.g. about.team" },
                    },
                    { name: "eyebrow", type: "text" },
                    { name: "title", type: "text" },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Footer & actions",
          fields: [
            {
              name: "footer",
              type: "group",
              label: "Footer column headings",
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "index", type: "text" },
                    { name: "contact", type: "text" },
                    { name: "location", type: "text" },
                    { name: "follow", type: "text" },
                  ],
                },
              ],
            },
            {
              name: "actions",
              type: "group",
              label: "Button labels",
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "allProjects", type: "text" },
                    { name: "allNews", type: "text" },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    { name: "aboutPractice", type: "text" },
                    { name: "startConversation", type: "text" },
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
