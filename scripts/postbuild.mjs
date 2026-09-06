/**
 * Complete the standalone build.
 *
 * `output: "standalone"` traces the server's imports and writes a self-contained
 * bundle — 52MB against the 805MB `node_modules` tree, which is what makes it
 * worth having on a 20GB VPS. What it does **not** copy is `public/` and
 * `.next/static`, because Next assumes a CDN is serving those.
 *
 * There is no CDN here. Caddy proxies everything to the Node server, so the
 * server has to hold the assets itself — and without this step a deployment
 * starts, answers 200, and renders unstyled HTML with broken images. Every
 * stylesheet and script 404s while the page itself looks like it worked, which
 * is a genuinely confusing first deploy.
 *
 * Runs automatically: npm invokes `postbuild` after `build`, so nobody has to
 * remember it and no runbook step can be skipped. Written in Node rather than
 * as a shell `cp` so it behaves the same on Windows and on Ubuntu.
 */
import fs from "fs";
import path from "path";

const root = process.cwd();
const standalone = path.join(root, ".next", "standalone");

if (!fs.existsSync(standalone)) {
  // Not a standalone build — nothing to complete, and not an error.
  process.exit(0);
}

const copies = [
  { from: path.join(root, "public"), to: path.join(standalone, "public") },
  {
    from: path.join(root, ".next", "static"),
    to: path.join(standalone, ".next", "static"),
  },
];

for (const { from, to } of copies) {
  if (!fs.existsSync(from)) continue;
  fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true });
  console.log(`postbuild: copied ${path.relative(root, from)} → standalone`);
}
