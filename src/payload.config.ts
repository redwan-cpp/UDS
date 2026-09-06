import path from "path";
import { fileURLToPath } from "url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Brands } from "./collections/Brands";
import { Categories } from "./collections/Categories";
import { Careers } from "./collections/Careers";
import { Expertise } from "./collections/Expertise";
import { Media } from "./collections/Media";
import { News } from "./collections/News";
import { Portfolio } from "./collections/Portfolio";
import { Products } from "./collections/Products";
import { Projects } from "./collections/Projects";
import { Statistics } from "./collections/Statistics";
import { Sustainability } from "./collections/Sustainability";
import { Team } from "./collections/Team";
import { Users } from "./collections/Users";
import { Navigation } from "./globals/Navigation";
import { SiteCopy } from "./globals/SiteCopy";
import { Studio } from "./globals/Studio";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Payload, adopted in Phase 2 — see `memory.md`.
 *
 * **SQLite, and that is a deliberate deviation from `architecture.md` §3.2**,
 * which specifies PostgreSQL. Recorded rather than quietly taken: there is no
 * Postgres on this machine and no Docker to run one (checked: nothing on 5432,
 * neither binary installed), so the Postgres adapter would have produced a CMS
 * that could not boot on the machine it is being built on. SQLite runs with no
 * external service, and Payload's adapters are a config swap plus a migration —
 * so the choice defers infrastructure rather than replacing the decision. The
 * production database is still Postgres until the studio says otherwise.
 *
 * `secret` has no fallback on purpose. A default would mean a deploy that
 * forgot the variable still boots, signing sessions with a value that is in the
 * repository — which is exactly the failure the check is here to prevent.
 */
const secret = process.env.PAYLOAD_SECRET;
if (!secret) {
  throw new Error(
    "PAYLOAD_SECRET is not set. It signs admin sessions; there is no safe default. Add it to .env.local.",
  );
}

/**
 * The site's own origin in production.
 *
 * Empty in development, which is correct — Payload derives what it needs from
 * the request. In production it has to be set, and two things depend on it
 * rather than one: absolute URLs in transactional email, and the CSRF
 * allowlist below. A deploy that forgets it gets working pages and a login
 * that fails from a browser, which is a confusing way to find out.
 */
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL ?? "";

/** Postgres when a Postgres URL is given, SQLite otherwise. See `db` below. */
const dbURI = process.env.DATABASE_URI || "file:./uthan.db";

export default buildConfig({
  secret,
  serverURL,

  /**
   * Cookie-authenticated requests are accepted only from these origins.
   *
   * Payload's default is an empty list, which is safe by accident rather than
   * by design: with no origins allowed, cross-site requests are refused, and a
   * foreign origin asking for `/api/projects` gets no
   * `access-control-allow-origin` back — verified against a request carrying
   * `Origin: https://evil.example`. Naming the site's own origin keeps that
   * true once the app is not on localhost, instead of someone later widening
   * it to `*` to make a deploy work.
   */
  cors: serverURL ? [serverURL] : [],
  csrf: serverURL ? [serverURL] : [],

  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " — Uthan Design Studio",
    },
  },

  // Grouped in the admin sidebar by what an editor is doing: Work is the
  // portfolio, Studio is everything about the practice, Library is media,
  // Settings holds the two globals that change how the whole site reads.
  collections: [
    Projects,
    Portfolio,
    Products,
    News,
    Team,
    Expertise,
    Sustainability,
    Statistics,
    Brands,
    Careers,
    Categories,
    Media,
    Users,
  ],

  globals: [Studio, Navigation, SiteCopy],

  editor: lexicalEditor(),

  /**
   * Postgres in production, SQLite in development — chosen by the connection
   * string rather than by an environment name.
   *
   * `architecture.md` §3.2 specifies PostgreSQL, and the deployed server runs
   * it. SQLite stays the local default because there is no Postgres on the
   * development machine and requiring one would mean nobody can run the site
   * without provisioning a database first.
   *
   * Keyed off the URL rather than `NODE_ENV` deliberately: the thing that
   * decides which driver can read a database is the database, and a machine
   * with `DATABASE_URI` pointing at Postgres wants the Postgres adapter
   * whether or not it thinks it is in production. Setting the variable is the
   * whole switch.
   */
  db: dbURI.startsWith("postgres")
    ? postgresAdapter({ pool: { connectionString: dbURI } })
    : sqliteAdapter({ client: { url: dbURI } }),

  // Generated types land beside the hand-written contract so the two can be
  // diffed. `src/types/content.ts` stays the type the site renders against;
  // this file is what Payload believes it is storing. They must agree.
  typescript: {
    outputFile: path.resolve(dirname, "types/payload-types.ts"),
  },

  // Payload uses sharp for the derivative sizes declared on Media. It was
  // already a dev dependency here for the media pipeline scripts.
  sharp,

  telemetry: false,
});
