/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

/**
 * Relay configuration.
 *
 * @see https://relay.dev/docs/installation-and-setup
 */
module.exports = {
  src: ".",
  schema: "./schema.graphql",
  language: require("relay-compiler-language-typescript"),
  watchman: false,
};
