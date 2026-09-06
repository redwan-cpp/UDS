/**
 * What is actually in the CMS.
 *
 * Runs through Payload's Local API — server-side, against the config directly,
 * with no HTTP and no login. That is the honest way to inspect the database:
 * it answers "is there content" without anybody's password.
 *
 *   npx payload run scripts/counts.ts
 */
import { getPayload } from "payload";
import config from "@payload-config";

const payload = await getPayload({ config });

const collections = [
  "projects",
  "portfolio",
  "products",
  "news",
  "team",
  "expertise",
  "sustainability",
  "statistics",
  "brands",
  "careers",
  "media",
  "users",
] as const;

let total = 0;
console.log("\ncollection        documents");
console.log("--------------------------");
for (const slug of collections) {
  const { totalDocs } = await payload.count({ collection: slug });
  total += totalDocs;
  console.log(`${slug.padEnd(18)}${String(totalDocs).padStart(6)}`);
}
console.log("--------------------------");
console.log(`${"total".padEnd(18)}${String(total).padStart(6)}\n`);

process.exit(0);
