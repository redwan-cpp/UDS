/**
 * Check that the crawl rules block what they claim to block.
 *
 * This exists because the obvious rule is the wrong rule. The rough-work
 * sheets are never referenced in the markup as `/media/process-01.jpg` —
 * `next/image` rewrites them to `/_next/image?url=%2Fmedia%2Fprocess-01.jpg`,
 * so a `Disallow: /media/process-` reads correctly in review and blocks
 * nothing a crawler actually fetches. That failure is completely silent: the
 * robots.txt is well formed, the rule is real, and the sheets stay crawlable.
 *
 * So this walks the whole chain rather than the rule on its own. It scrapes a
 * project page for the image URLs the page really emits, fetches the generated
 * robots.txt, and applies the disallow rules to those URLs — asserting that
 * the rough work is blocked AND that the finished photography is not, since
 * over-blocking would quietly cost the studio image search.
 *
 * Development only, never shipped. Needs the dev server running.
 *
 *   node scripts/check-robots.mjs
 */

const ORIGIN = process.env.ORIGIN ?? "http://localhost:3000";
const PAGE = "/projects/courtyard-house";

/** robots.txt matching: prefix match, `*` is a wildcard. */
function matches(rule, url) {
  const escaped = rule
    .split("*")
    .map((part) => part.replace(/[.?+^$(){}|[\]\\]/g, "\\$&"))
    .join(".*");
  return new RegExp("^" + escaped).test(url);
}

async function main() {
  const res = await fetch(ORIGIN + "/robots.txt");
  if (!res.ok) {
    console.error(`robots.txt returned ${res.status} — is the dev server up?`);
    return 1;
  }

  const disallow = (await res.text())
    .split("\n")
    .filter((line) => line.toLowerCase().startsWith("disallow:"))
    .map((line) => line.slice(line.indexOf(":") + 1).trim())
    .filter(Boolean);

  const blocked = (url) => disallow.some((rule) => matches(rule, url));

  // The URLs the page actually emits, not the ones we assume it emits.
  const html = await fetch(ORIGIN + PAGE).then((r) => r.text());
  const rendered = [...html.matchAll(/src="([^"]+)"/g)]
    .map((m) => m[1].replace(/&amp;/g, "&"))
    .filter((src) => src.includes("/media/") || src.includes("%2Fmedia%2F"));

  const isRough = (url) => /process-/.test(url);
  const rough = rendered.filter(isRough);
  const finished = rendered.filter((url) => !isRough(url));

  const failures = [];
  if (rough.length === 0) {
    failures.push(
      `No rough-work images found on ${PAGE}. Either the page changed or the ` +
        `assets were renamed — the rule now guards nothing.`,
    );
  }
  for (const url of rough) {
    if (!blocked(url)) failures.push(`NOT blocked but should be: ${url}`);
  }
  for (const url of finished) {
    if (blocked(url)) failures.push(`Blocked but should be indexable: ${url}`);
  }

  console.log(`rules:     ${disallow.length}`);
  console.log(`rough:     ${rough.length} (expect all blocked)`);
  console.log(`finished:  ${finished.length} (expect all allowed)`);

  if (failures.length) {
    console.error("\n" + failures.map((f) => "  ✗ " + f).join("\n"));
    return 1;
  }
  console.log("\nOK — rough work blocked, finished work indexable.");
  return 0;
}

// `process.exitCode`, not `process.exit()`: forcing exit while `fetch` still
// holds an open handle trips a libuv assertion on Windows and reports 127,
// which reads as a crashed script rather than as a failed check.
process.exitCode = await main();
