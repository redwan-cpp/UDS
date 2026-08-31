import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Review tooling, not application code: `scripts/audit.js` is pasted into
    // a browser console, and the generated media library is machine-written.
    "scripts/audit.js",
    "public/__qa-audit.js",
    "src/data/media.generated.ts",
  ]),
]);

export default eslintConfig;
