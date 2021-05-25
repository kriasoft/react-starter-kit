/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

/**
 * ESLint configuration.
 *
 * @see https://eslint.org/docs/user-guide/configuring
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  root: true,

  env: { es6: true },

  extends: ["eslint:recommended", "prettier"],

  parserOptions: { ecmaVersion: 2020 },

  overrides: [
    {
      files: ["*.ts", ".tsx"],
      parser: "@typescript-eslint/parser",
      extends: ["plugin:@typescript-eslint/recommended"],
      plugins: ["@typescript-eslint"],
      parserOptions: {
        sourceType: "module",
        warnOnUnsupportedTypeScriptVersion: true,
      },
    },
    {
      files: ["*.test.js"],
      env: { jest: true },
    },
    {
      files: [
        ".eslintrc.js",
        "babel.config.js",
        "relay.config.js",
        "scripts/**/*.js",
        "webpack.config.js",
      ],
      env: { node: true },
    },
  ],

  ignorePatterns: [
    "/.build",
    "/.cache",
    "/.git",
    "/.husky",
    "/.yarn",
    "/**/__snapshots__",
  ],
};
