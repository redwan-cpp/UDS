import type { CollectionConfig } from "payload";

/**
 * Editors of the site.
 *
 * This is the only authentication surface the project has, and it is
 * deliberately behind the admin panel rather than on the marketing site —
 * `architecture.md` §3.3 keeps the public site with no login of its own, which
 * removes an entire attack class by design.
 *
 * Three roles, matching §3.3: an Editor writes and edits, an Author is scoped
 * to their own drafts, an Admin manages people. The distinction that matters
 * is the last one: `admin` is the only role that can create or delete users,
 * so an editor who is phished cannot mint themselves a colleague.
 */
export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "role"],
    group: "Studio",
  },
  access: {
    // Only an admin manages people. Everyone signed in can read the list, so
    // "last edited by" can render a name rather than an id.
    create: ({ req }) => req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "admin",
    read: ({ req }) => Boolean(req.user),
    // An admin edits anyone; anyone else edits only themselves.
    update: ({ req }) =>
      req.user?.role === "admin" ? true : { id: { equals: req.user?.id } },
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      admin: { description: "Shown against the work this person publishes." },
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Editor — writes and publishes", value: "editor" },
        { label: "Author — writes, publishes own work", value: "author" },
        { label: "Admin — manages people", value: "admin" },
      ],
      access: {
        // A user must not be able to promote themselves.
        update: ({ req }) => req.user?.role === "admin",
      },
    },
  ],
};
