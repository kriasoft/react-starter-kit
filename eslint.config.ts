/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import react from "@eslint-react/eslint-plugin";
import js from "@eslint/js";
import * as tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";
import ts from "typescript-eslint";

/**
 * ESLint configuration.
 * @see https://eslint.org/docs/latest/use/configure/
 */
export default ts.config(
  // Global ignores
  {
    ignores: [
      ".cache",
      ".venv",
      "**/.astro/**/*",
      "**/dist",
      "**/node_modules",
      "docs/.vitepress/cache",
      "docs/.vitepress/dist",
    ],
  },

  // Base configs for all files
  js.configs.recommended,
  ...ts.configs.recommended,
  prettierConfig,

  // TypeScript parser for all .ts files
  {
    files: ["**/*.ts"],
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
      "db/**/*",
      "infra/**/*",
    ],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // React/Browser environment (frontend apps)
  {
    files: [
      "apps/app/**/*.{ts,tsx}",
      "apps/web/**/*.{ts,tsx}",
      "packages/ui/**/*.tsx",
    ],
    ...react.configs["recommended-typescript"],
    rules: {
      "@eslint-react/dom/no-missing-iframe-sandbox": "off",
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        jsxImportSource: "react",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
  },

  // UI package specific overrides
  {
    files: ["packages/ui/**/*.tsx"],
    rules: {
      "@eslint-react/no-forward-ref": "off",
    },
  },
);
