import react from "@eslint-react/eslint-plugin";
import js from "@eslint/js";
import * as tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import { defineConfig } from "eslint/config";
import globals from "globals";
import ts from "typescript-eslint";

/**
 * ESLint configuration.
 * @see https://eslint.org/docs/latest/use/configure/
 */
export default defineConfig(
  // Global ignores
  {
    ignores: [
      ".cache",
      ".venv",
      "**/.astro",
      "**/.react-email",
      "**/dist",
      "**/node_modules",
      "docs/.vitepress/cache",
      "docs/.vitepress/dist",
    ],
  },

  // Base configs for all files
  js.configs.recommended,
  ...ts.configs.recommended,

  // TypeScript parser for all .ts/.tsx files
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
    },
  },

  // Node.js environment (servers, scripts, config files)
  {
    files: [
      "**/*.config.{js,ts,mjs}",
      "**/scripts/**/*",
      "apps/api/**/*",
      "apps/email/**/*",
      "db/**/*",
      "infra/**/*",
      "packages/core/**/*",
      "packages/ws-protocol/**/*",
    ],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // React environment (frontend apps, email templates)
  {
    ...react.configs["recommended-typescript"],
    files: [
      "apps/app/**/*.{ts,tsx}",
      "apps/email/**/*.tsx",
      "apps/web/**/*.{ts,tsx}",
      "packages/ui/**/*.tsx",
    ],
    rules: {
      ...react.configs["recommended-typescript"].rules,
      "@eslint-react/dom/no-missing-iframe-sandbox": "off",
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        jsxImportSource: "react",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
  },

  // Email templates: add Node globals (server-side rendering)
  {
    files: ["apps/email/**/*.tsx"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // UI package specific overrides
  {
    files: ["packages/ui/**/*.tsx"],
    rules: {
      "@eslint-react/no-forward-ref": "off",
    },
  },

  // Prettier must be last to override any formatting rules
  prettierConfig,
);
