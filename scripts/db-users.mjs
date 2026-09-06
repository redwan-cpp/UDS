/**
 * Carry the studio's accounts across a schema rebuild.
 *
 * Enabling drafts and autosave everywhere changes the version tables, and
 * SQLite's push cannot tell an added `autosave` column from a renamed one, so
 * it stops and asks a question a script cannot answer. Dropping the file is the
 * honest fix for a development database whose content `seed.ts` reproduces —
 * but the login is not reproducible, so it travels separately.
 *
 * Plain Node rather than `payload run`: that runner opens the database when it
 * loads the config, and Windows will not delete a file with an open handle.
 *
 *   node scripts/db-users.mjs save     # dump accounts, then drop the database
 *   npx payload run scripts/seed.ts    # rebuild schema and content
 *   node scripts/db-users.mjs restore  # put the accounts back, hashes and all
 */
import fs from "fs";
import path from "path";
import { createClient } from "@libsql/client";

const DB = path.join(process.cwd(), "uthan.db");
const DUMP = path.join(process.cwd(), ".users-backup.json");
const mode = process.argv[2];

if (mode === "save") {
  let rows = [];
  if (fs.existsSync(DB)) {
    const c = createClient({ url: `file:${DB}` });
    rows = (await c.execute("select * from users")).rows.map((r) => ({ ...r }));
    c.close();
  }
  fs.writeFileSync(DUMP, JSON.stringify(rows, null, 2));
  console.log(`saved ${rows.length} account(s) to .users-backup.json`);

  for (const suffix of ["", "-journal", "-wal", "-shm"]) {
    const f = DB + suffix;
    if (fs.existsSync(f)) fs.rmSync(f);
  }
  console.log("database dropped");
} else if (mode === "restore") {
  const rows = JSON.parse(fs.readFileSync(DUMP, "utf8"));
  if (!rows.length) { console.log("nothing to restore"); process.exit(0); }
  const c = createClient({ url: `file:${DB}` });
  const cols = (await c.execute("select name from pragma_table_info('users')"))
    .rows.map((r) => String(r.name));
  let restored = 0;
  for (const row of rows) {
    // Only columns the new schema has, so a later field change does not turn
    // this into an insert that fails on a column nobody remembers removing.
    const keys = cols.filter((k) => k in row && row[k] !== null);
    try {
      await c.execute({
        sql: `insert or replace into users (${keys.join(", ")}) values (${keys.map(() => "?").join(", ")})`,
        args: keys.map((k) => row[k]),
      });
      restored++;
    } catch (e) { console.warn("  ! could not restore a row:", e.message); }
  }
  c.close();
  fs.rmSync(DUMP);
  console.log(`restored ${restored} account(s) — same passwords`);
} else {
  console.error("usage: node scripts/db-users.mjs save|restore");
  process.exit(1);
}
