import type { CollectionConfig } from "payload";

import {
  revalidateCollection,
  revalidateCollectionDelete,
} from "./hooks/revalidate";

import { publishedOnlyAccess, richParagraphs, seoGroup } from "./fields";

/**
 * Major Projects — the publication-grade case study.
 *
 * Modelled field-for-field against `Project` in `src/types/content.ts`. That
 * type is not documentation of this collection; it is the contract this
 * collection has to satisfy, because every route already renders against it and
 * `architecture.md` §2.5 promises the return types do not move when the CMS
 * lands. Where the two ever disagree, this file is the bug.
 *
 * Drafts are on. A studio publishing a case study wants to write it over a week
 * without the half-finished version being live, which is the whole reason
 * `project-requirement.md` §9 lists a draft/publish workflow as a MUST.
 *
 * `isDemo` is carried through deliberately. It is how the site keeps demo
 * content honest — the footer notice and the per-page disclaimers key off it —
 * so it stays an editable field rather than being dropped as scaffolding.
 */
export const Projects: CollectionConfig = {
  slug: "projects",
  hooks: {
    afterChange: [revalidateCollection("projects")],
    afterDelete: [revalidateCollectionDelete("projects")],
  },
  // Autosave, because losing typing is the complaint that makes people stop
  // trusting a CMS. Payload only offers autosave on a drafts-enabled
  // collection, so drafts are on everywhere rather than on the four that
  // happened to have them — a consistent rule beats a remembered exception.
  // The interval is short: it is saving a row of a form, not a document.
  versions: { drafts: { autosave: { interval: 800 } } },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "year", "status", "featured"],
    group: "Work",
  },
  access: publishedOnlyAccess,
  fields: [
    {
      type: "row",
      fields: [
        { name: "title", type: "text", required: true },
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
          index: true,
          admin: { description: "The URL segment: /projects/<slug>." },
        },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "location", type: "text", required: true },
        { name: "year", type: "text", required: true },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "category",
          type: "relationship",
          relationTo: "categories",
          hasMany: true,
          required: true,
          // Only the categories scoped to this side of the site. Without the
          // filter an editor picking a project category is offered "Custom
          // doors", which is how a project ends up in a filter row that does
          // not render it.
          filterOptions: { scope: { equals: "project" } },
        },
        {
          name: "status",
          type: "select",
          required: true,
          defaultValue: "completed",
          // Payload auto-names a select field's Postgres enum type from the
          // field name — "status" collided with the enum it generates for its
          // own internal `_status` draft/publish field (versions.drafts adds
          // that automatically), landing both on `enum_projects_status`. SQLite
          // has no native enum type, so this only ever surfaced against real
          // Postgres: the very first deploy failed with
          // `invalid input value for enum enum_projects_status: "completed"`,
          // because the shared type had been built for draft/published values.
          // An explicit name is the fix Payload documents for exactly this.
          enumName: "project_status",
          options: ["completed", "in-progress", "concept"].map((v) => ({
            label: v,
            value: v,
          })),
        },
      ],
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
      admin: { description: "One line. Used on cards and in the index." },
    },
    // Rows of rich text, not a single rich-text blob: the site renders each
    // row as its own <p> and gives each its own scroll reveal (CLAUDE.md rule
    // 5), so the paragraph boundaries have to survive the round trip. See
    // `richParagraphs` for exactly which inline marks an editor can use.
    richParagraphs("description", {
      description:
        "The case study. Leave this empty and the project is a card in the index with no page of its own — which is what most work is until somebody writes it up. Fill it in and the card starts linking to a full project page.",
    }),
    richParagraphs("uniqueness", {
      description: "What makes this project unique. Optional.",
    }),
    richParagraphs("concept", { description: "Our concept. Optional." }),
    {
      type: "row",
      fields: [
        { name: "area", type: "text" },
        { name: "client", type: "text" },
      ],
    },
    {
      name: "services",
      type: "array",
      labels: { singular: "Service", plural: "Services" },
      fields: [{ name: "value", type: "text", required: true }],
    },
    {
      name: "facts",
      type: "array",
      labels: { singular: "Fact", plural: "Facts" },
      admin: {
        description:
          "The project information table. Order is meaningful — it is the order they appear. Every row needs both a label and a value; half a row will refuse to publish.",
      },
      fields: [
        {
          type: "row",
          fields: [
            { name: "label", type: "text", required: true },
            { name: "value", type: "text", required: true },
          ],
        },
      ],
    },
    {
      name: "symbol",
      type: "group",
      admin: {
        description:
          "The project's own mark. Leave empty and the card draws a section mark instead. Supply a monochrome SVG — marks are painted through a mask so they take the surface's colour, and a full-colour logo will be flattened.",
      },
      fields: [
        { name: "asset", type: "upload", relationTo: "media" },
        {
          name: "label",
          type: "text",
          admin: { description: "What the mark depicts, for assistive technology." },
        },
      ],
    },
    {
      name: "hero",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: {
        description:
          "The card image in the index, and the opening image of the project page. Required — a project with no photograph has nothing to show in the grid.",
      },
    },
    {
      name: "gallery",
      type: "upload",
      relationTo: "media",
      hasMany: true,
      admin: {
        description:
          "The image sequence on the project page. Leave empty on a project that is only a card.",
      },
    },
    {
      name: "process",
      type: "upload",
      relationTo: "media",
      hasMany: true,
      admin: {
        description:
          "Rough work: sketches, working drawings, site photography. These render in a guarded strip that does not enlarge, and the crawl rules keep them out of image search — see src/app/robots.ts.",
      },
    },
    {
      name: "videos",
      type: "upload",
      relationTo: "videos",
      hasMany: true,
      admin: {
        description:
          "Optional short video sequence. Upload web-ready videos in Library → Videos first.",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "featured",
          type: "checkbox",
          defaultValue: false,
          admin: { description: "Show on the homepage work band." },
        },
        {
          name: "order",
          type: "number",
          required: true,
          defaultValue: 0,
          admin: { description: "Lower sorts first." },
        },
        {
          name: "isDemo",
          type: "checkbox",
          defaultValue: false,
          admin: {
            description:
              "Placeholder content, not the studio's real work. Drives the demo notices.",
          },
        },
      ],
    },
    seoGroup,
  ],
};
