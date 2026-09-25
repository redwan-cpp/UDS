import type { CollectionBeforeChangeHook, Field } from "payload";

type AccessArgs = { req: { user?: { id?: string | number; role?: string } | null } };

/** Editors and admins manage the studio's shared content. */
export const canEditContent = ({ req }: AccessArgs) =>
  req.user?.role === "admin" || req.user?.role === "editor";

/** Authors can upload material while writing, but cannot alter shared library records. */
export const canCreateContent = ({ req }: AccessArgs) =>
  canEditContent({ req }) || req.user?.role === "author";

const published = { _status: { equals: "published" } };

/** A writer may see published work plus drafts that belong to them. */
export const authoredContentAccess = {
  create: canCreateContent,
  read: ({ req }: AccessArgs) => {
    if (canEditContent({ req })) return true;
    if (req.user?.role === "author" && req.user.id) {
      return { or: [published, { author: { equals: req.user.id } }] };
    }
    return published;
  },
  update: ({ req }: AccessArgs) => {
    if (canEditContent({ req })) return true;
    if (req.user?.role === "author" && req.user.id) {
      return { author: { equals: req.user.id } };
    }
    return false;
  },
  delete: ({ req }: AccessArgs) => req.user?.role === "admin",
};

/** Ownership is set by the server, never chosen by an Author in the panel. */
export const authoredByField = (): Field => ({
  name: "author",
  type: "relationship",
  relationTo: "users",
  index: true,
  admin: {
    position: "sidebar",
    description: "The staff member responsible for this entry.",
  },
  access: {
    update: ({ req }) => req.user?.role !== "author",
  },
});

/** An Author cannot claim, transfer, or overwrite somebody else's entry. */
export const stampAuthor: CollectionBeforeChangeHook = ({ data, req }) => {
  if (req.user?.role !== "author" || !req.user.id) return data;
  return { ...(data as Record<string, unknown>), author: req.user.id };
};

/** Published content is public; drafts stay visible to staff only. */
export const publishedOnlyAccess = {
  read: ({ req }: AccessArgs) => (canEditContent({ req }) ? true : published),
  create: canEditContent,
  update: canEditContent,
  delete: ({ req }: AccessArgs) => req.user?.role === "admin",
};
