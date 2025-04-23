/* SPDX-FileCopyrightText: 2020-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { resolve } from "node:path";
import { defineConfig } from "vite";

/**
 * Vite configuration.
 * https://vitejs.dev/config/
 */
export default defineConfig({
  resolve: {
    alias: {
      "@root/api": resolve(__dirname, "../api"),
      "@root/core": resolve(__dirname, "../core"),
      "@root/db": resolve(__dirname, "../db"),
    },
  },

  build: {
    lib: {
      entry: "./index.ts",
      name: "example",
      formats: ["es"],
      fileName: "index",
    },
    sourcemap: true,
  },

  assetsInclude: ["**/*.wasm"],

  // test: {
  //   poolOptions: {
  //     workers: {
  //       wrangler: {
  //         configPath: "../wrangler.jsonc",
  //       },
  //     },
  //   },
  // },
});
