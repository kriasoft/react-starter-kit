import { defineConfig } from "vitest/config";

/**
 * Vitest configuration.
 *
 * @see https://vitest.dev/config/
 * @see https://vitest.dev/guide/coverage
 */
export default defineConfig({
  cacheDir: "./.cache/vite",
  test: {
    projects: ["apps/api", "apps/app", "db"],

    // `coverage` runs Vitest on Node while `test` runs it on Bun: merging this
    // suite's v8 coverage overflows the stack inside `@bcoe/v8-coverage`.
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],

      // Without `include`, a module no test imported is absent from the report
      // rather than 0%. Limited to the workspaces that have tests.
      include: ["apps/api/**/*.ts", "apps/app/**/*.{ts,tsx}", "db/**/*.ts"],

      // Generated code, build output and test scaffolding only – untested
      // source stays in and reports 0%.
      exclude: [
        "**/*.config.{ts,mts}",
        "**/*.test.{ts,tsx}",
        "**/*.d.ts",
        "**/dist/**",
        "apps/app/lib/routeTree.gen.ts",
        "apps/app/vitest.setup.ts",
        "db/migrations/**",
      ],
    },
  },
});
