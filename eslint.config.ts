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
  {
    ignores: [".cache", ".venv", "**/dist", "**/node_modules"],
  },
  {
    ignores: ["app/**/*"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  prettierConfig,
  {
    files: ["app/**/*.ts", "**/*.tsx"],
    ...react.configs["recommended-typescript"],
    rules: {
      ...react.configs["recommended-typescript"].rules,
      "@eslint-react/dom/no-missing-iframe-sandbox": "off",
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
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
);
