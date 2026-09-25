/**
 * The upload picker tells us a filename and a claimed MIME type. Neither is a
 * security boundary, but making them agree prevents confusing files from ever
 * entering the library. Payload then independently identifies the bytes and
 * rejects a mismatch or unsafe SVG — see `scripts/verify-upload-security.mts`.
 */
export type UploadFile = {
  name: string;
  mimetype: string;
  size: number;
};

export type UploadTypes = Readonly<Record<string, readonly string[]>>;

export const IMAGE_UPLOAD_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/avif": [".avif"],
  "image/svg+xml": [".svg"],
} as const satisfies UploadTypes;

export const VIDEO_UPLOAD_TYPES = {
  "video/mp4": [".mp4"],
  "video/webm": [".webm"],
} as const satisfies UploadTypes;

export const DOCUMENT_UPLOAD_TYPES = {
  "application/pdf": [".pdf"],
} as const satisfies UploadTypes;

const extensionOf = (filename: string) => {
  const finalDot = filename.lastIndexOf(".");
  return finalDot === -1 ? "" : filename.slice(finalDot).toLowerCase();
};

/** Returns a visitor-safe message when the declared upload metadata is invalid. */
export function validateUploadDeclaration(
  file: UploadFile,
  allowed: UploadTypes,
  maxBytes: number,
  label: string,
) {
  if (!Number.isSafeInteger(file.size) || file.size < 1) {
    return `A valid ${label.toLowerCase()} file is required.`;
  }

  if (file.size > maxBytes) {
    return `${label} files must be ${(maxBytes / 1024 / 1024).toFixed(0)} MB or smaller.`;
  }

  const extensions = allowed[file.mimetype];
  if (!extensions?.includes(extensionOf(file.name))) {
    return `Use a supported ${label.toLowerCase()} file type.`;
  }

  return undefined;
}
