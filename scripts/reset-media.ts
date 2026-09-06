/**
 * Empty the media library.
 *
 * One-off repair for duplicates left by a seed whose upload dedupe was
 * in-memory only: each run re-uploaded every file, so the library grew by 35
 * rows a pass while the documents pointed at whichever copy the latest run
 * created. Rather than untangle which rows are orphans, this clears the library
 * and lets `seed.ts` rebuild it — the seed updates every document with fresh
 * ids on the same pass, so nothing is left dangling.
 *
 * Users are untouched. Only media rows go.
 *
 *   npx payload run scripts/reset-media.ts && npx payload run scripts/seed.ts
 */
import { getPayload } from "payload";
import config from "@payload-config";

const payload = await getPayload({ config });

const before = await payload.count({ collection: "media" });

// Looped, because a single bulk delete does not clear the collection: Payload
// caps how many documents one call touches, so the first attempt took 95 rows
// down to 15 and reported success. Deleting until the count stops falling is
// the only honest way to know it is empty.
let remaining = before.totalDocs;
let guard = 0;
while (remaining > 0 && guard < 50) {
  await payload.delete({ collection: "media", where: { id: { exists: true } } });
  const next = (await payload.count({ collection: "media" })).totalDocs;
  if (next === remaining) break; // no progress — stop rather than spin
  remaining = next;
  guard++;
}

const after = await payload.count({ collection: "media" });

console.log(`\nmedia: ${before.totalDocs} -> ${after.totalDocs}`);
console.log("Now run: npx payload run scripts/seed.ts\n");

process.exit(0);
