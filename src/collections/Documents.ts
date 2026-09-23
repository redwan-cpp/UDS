import path from "path";

import type { CollectionConfig } from "payload";

import { revalidateMedia } from "./hooks/revalidate";

/** PDF uploads are intentionally limited to the same practical size as video. */
const MAX_BYTES = 12 * 1024 * 1024;
const PDF_SIGNATURE = "%PDF-";

/**
 * Downloadable supporting documents.
 *
 * This is separate from `Media`: the image collection sends files through
 * Sharp and creates image derivatives, neither of which makes sense for a
 * PDF. The checks are deliberately redundant (extension, claimed MIME type,
 * and file signature) because an upload picker alone is not a security
 * boundary. Served as an attachment so the browser does not execute content
 * from an uploaded file in the site context.
 */
export const Documents: CollectionConfig = {
  slug: "documents",
  labels: { singular: "Document", plural: "Documents" },
  hooks: {
    beforeValidate: [
      ({ req, data }) => {
        const file = req.file;
        if (!file) return data;

        const filename = file.name.toLowerCase();
        const startsWithPdf =
          file.data.subarray(0, PDF_SIGNATURE.length).toString("ascii") ===
          PDF_SIGNATURE;

        if (
          file.mimetype !== "application/pdf" ||
          !filename.endsWith(".pdf") ||
          !startsWithPdf
        ) {
          throw new Error("Documents must be valid PDF files.");
        }

        if (file.size > MAX_BYTES) {
          throw new Error("PDF files must be 12 MB or smaller.");
        }

        return data;
      },
    ],
    afterChange: [revalidateMedia],
  },
  admin: {
    group: "Library",
    useAsTitle: "filename",
    description: "PDF documents only. Maximum file size: 12 MB.",
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === "admin",
  },
  upload: {
    staticDir: process.env.MEDIA_DIR
      ? path.join(process.env.MEDIA_DIR, "document")
      : path.resolve(process.cwd(), "media/document"),
    mimeTypes: ["application/pdf"],
    pasteURL: false,
    modifyResponseHeaders: ({ headers }) => {
      headers.set("Content-Disposition", "attachment");
      headers.set("X-Content-Type-Options", "nosniff");
      return headers;
    },
  },
  fields: [],
};
