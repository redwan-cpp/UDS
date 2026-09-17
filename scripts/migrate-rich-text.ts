/**
 * Move paragraphs written before rich text into the rich-text editor.
 *
 * `richParagraphs()` added a `content` column beside each row's old plain
 * `text` instead of converting it (see the note there). This copies every row
 * that still only has `text` into `content` as an unformatted paragraph and
 * clears `text`, so an editor opening the item sees their words in the new
 * editor rather than an empty box. Safe to re-run: rows with `content` are
 * left alone.
 *
 * Publish or discard any unsaved drafts first — each migrated document is
 * saved from its current published state.
 *
 *   npx payload run scripts/migrate-rich-text.ts
 */
import { buildEditorState } from "@payloadcms/richtext-lexical";
import { getPayload } from "payload";
import config from "@payload-config";

const FIELDS = {
  projects: ["description", "uniqueness", "concept"],
  news: ["body"],
  knowledge: ["body"],
  products: ["description"],
} as const;

type Row = { id?: string; text?: string | null; content?: unknown };

/** A legacy value that is already Lexical JSON — a local database pushed mid-change. */
const asState = (text: string) => {
  try {
    const parsed = JSON.parse(text);
    if (parsed?.root) return parsed;
  } catch {}
  return buildEditorState({ text });
};

const payload = await getPayload({ config });
let moved = 0;

for (const [collection, fields] of Object.entries(FIELDS)) {
  const { docs } = await payload.find({
    collection: collection as keyof typeof FIELDS,
    limit: 0,
    depth: 0,
    pagination: false,
  });

  for (const doc of docs as unknown as Record<string, Row[] | undefined>[]) {
    const data: Record<string, Row[]> = {};
    let rows = 0;
    for (const field of fields) {
      const value = doc[field];
      if (!value?.some((r) => r.text && !r.content)) continue;
      data[field] = value.map((r) => {
        if (!r.text || r.content) return r;
        rows++;
        return { id: r.id, content: asState(r.text), text: null };
      });
    }
    if (!rows) continue;

    await payload.update({
      collection: collection as keyof typeof FIELDS,
      id: doc.id as unknown as string,
      data,
    });
    console.log(`${collection}/${doc.slug}: ${rows} paragraph(s)`);
    moved += rows;
  }
}

console.log(`\n${moved} paragraph(s) moved into the rich-text editor.`);
process.exit(0);
