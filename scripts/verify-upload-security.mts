import assert from "node:assert/strict";

import { checkFileRestrictions } from "../node_modules/payload/dist/uploads/checkFileRestrictions.js";
import {
  DOCUMENT_UPLOAD_TYPES,
  IMAGE_UPLOAD_TYPES,
  validateUploadDeclaration,
  VIDEO_UPLOAD_TYPES,
  type UploadTypes,
} from "../src/collections/upload-validation.ts";
import { authoredContentAccess, stampAuthor } from "../src/collections/access.ts";

type TestFile = {
  data: Buffer;
  mimetype: string;
  name: string;
  size: number;
};

const MEBIBYTE = 1024 * 1024;
const quietRequest = {
  payload: { logger: { error: () => undefined, warn: () => undefined } },
};

const file = (name: string, mimetype: string, data: Buffer): TestFile => ({
  name,
  mimetype,
  data,
  size: data.length,
});

async function expectPayloadRejection(
  label: string,
  candidate: TestFile,
  mimeTypes: readonly string[],
) {
  await assert.rejects(
    checkFileRestrictions({
      collection: { upload: { mimeTypes } },
      file: candidate,
      req: quietRequest,
    } as never),
  );
  console.log(`PASS ${label}`);
}

function expectDeclarationRejection(
  label: string,
  candidate: Pick<TestFile, "name" | "mimetype" | "size">,
  allowed: UploadTypes,
  maxBytes: number,
  type: string,
) {
  assert.notEqual(validateUploadDeclaration(candidate, allowed, maxBytes, type), undefined);
  console.log(`PASS ${label}`);
}

// A harmless PNG signature must remain acceptable; the hostile cases below
// prove the checks are not merely a blanket upload denial.
assert.equal(
  validateUploadDeclaration(
    file("plate.png", "image/png", Buffer.from([0x89, 0x50, 0x4e, 0x47])),
    IMAGE_UPLOAD_TYPES,
    12 * MEBIBYTE,
    "Image",
  ),
  undefined,
);
console.log("PASS valid image declaration");

expectDeclarationRejection(
  "image extension cannot disagree with its claimed type",
  file("drawing.jpg", "image/webp", Buffer.from("RIFFxxxxWEBP")),
  IMAGE_UPLOAD_TYPES,
  12 * MEBIBYTE,
  "Image",
);
expectDeclarationRejection(
  "oversized video is refused before processing",
  { name: "camera.mp4", mimetype: "video/mp4", size: 12 * MEBIBYTE + 1 },
  VIDEO_UPLOAD_TYPES,
  12 * MEBIBYTE,
  "Video",
);
expectDeclarationRejection(
  "non-PDF extension is refused for a document",
  file("document.html", "application/pdf", Buffer.from("%PDF-")),
  DOCUMENT_UPLOAD_TYPES,
  12 * MEBIBYTE,
  "PDF",
);

await expectPayloadRejection(
  "an executable renamed as an image is rejected by byte signature",
  file("site-plan.jpg", "image/jpeg", Buffer.from([0x4d, 0x5a, 0x90, 0x00])),
  Object.keys(IMAGE_UPLOAD_TYPES),
);
await expectPayloadRejection(
  "an SVG with an event handler is rejected",
  file(
    "brand.svg",
    "image/svg+xml",
    Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"/>'),
  ),
  Object.keys(IMAGE_UPLOAD_TYPES),
);
await expectPayloadRejection(
  "a false PDF is rejected by its bytes",
  file("handbook.pdf", "application/pdf", Buffer.from("%PDF-not-a-real-document")),
  Object.keys(DOCUMENT_UPLOAD_TYPES),
);
await expectPayloadRejection(
  "an image renamed as a video is rejected by byte signature",
  file("film.mp4", "video/mp4", Buffer.from("GIF89a")),
  Object.keys(VIDEO_UPLOAD_TYPES),
);

const authorRequest = { req: { user: { id: "writer-1", role: "author" } } };
assert.deepEqual(authoredContentAccess.update(authorRequest), {
  author: { equals: "writer-1" },
});
assert.deepEqual(
  stampAuthor({ data: { author: "somebody-else", title: "Draft" }, ...authorRequest } as never),
  { author: "writer-1", title: "Draft" },
);
assert.equal(
  authoredContentAccess.update({ req: { user: { id: "editor-1", role: "editor" } } }),
  true,
);
console.log("PASS Author ownership is enforced server-side");

console.log("Upload security checks passed.");
