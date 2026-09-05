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
    // The `public/__*` glob covers the temporary copy of the audit script that
    // gets served there so a headless browser can fetch it — it was pinned to
    // one exact filename, which silently stopped matching the moment the copy
    // was made under any other name.
    "scripts/audit.js",
    "public/__*.js",
    "src/data/media.generated.ts",
  ]),
  {
    // Ships as a warning in `eslint-config-next`, which means `npm run lint`
    // exits 0 with dead imports still in the tree — a rule that reports but
    // cannot fail is one nobody acts on, and this project's gate is "lint
    // must pass clean". The tree is at zero today, so promoting it costs no
    // cleanup and only holds the line from here.
    //
    // The `^_` escapes are the price of the promotion: a positional argument
    // that must exist to reach the one after it cannot be deleted, so it needs
    // a way to say "deliberately unused" other than turning the rule off.
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
]);

export default eslintConfig;
