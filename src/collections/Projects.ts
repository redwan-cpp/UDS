import type { CollectionConfig } from "payload";

import { publishedOnlyAccess } from "./fields";

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
  versions: { drafts: true },
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
          type: "select",
          required: true,
          // Mirrors `ProjectCategory`. Adding one here means adding it there.
          options: [
            "residential",
            "commercial",
            "hospitality",
            "interior",
            "institutional",
            "urban",
            "landscape",
            "other",
          ].map((v) => ({ label: v, value: v })),
        },
        {
          name: "status",
          type: "select",
          required: true,
          defaultValue: "completed",
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
    {
      // `description: string[]` — an array of paragraphs, not rich text. The
      // site renders each as its own <p> and gives each its own scroll reveal
      // (CLAUDE.md rule 5), so the paragraph boundaries have to survive the
      // round trip. A rich-text blob would flatten them into one node.
      name: "description",
      type: "array",
      required: true,
      minRows: 1,
      labels: { singular: "Paragraph", plural: "Paragraphs" },
      fields: [{ name: "text", type: "textarea", required: true }],
    },
    {
      name: "uniqueness",
      type: "array",
      labels: { singular: "Paragraph", plural: "Paragraphs" },
      admin: { description: "What makes this project unique. Optional." },
      fields: [{ name: "text", type: "textarea", required: true }],
    },
    {
      name: "concept",
      type: "array",
      labels: { singular: "Paragraph", plural: "Paragraphs" },
      admin: { description: "Our concept. Optional." },
      fields: [{ name: "text", type: "textarea", required: true }],
    },
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
      required: true,
      minRows: 1,
      labels: { singular: "Fact", plural: "Facts" },
      admin: {
        description:
          "The project information table. Order is meaningful — it is the order they appear.",
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
    },
    {
      name: "gallery",
      type: "upload",
      relationTo: "media",
      hasMany: true,
      required: true,
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
  ],
};
