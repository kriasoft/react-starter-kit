/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { loadEnv } from "envars";
import { defineConfig } from "vitest/config";

/**
 * Vite configuration for the server-side bundle.
 *
 * @see https://vitejs.dev/config/
 */
export default defineConfig(async ({ mode }) => {
  await loadEnv(mode, {
    root: "..",
    schema: "./core/env.ts",
    mergeTo: process.env,
  });

  return {
    cacheDir: "../.cache/vite-server",

    build: {
      ssr: "./index.ts",
      sourcemap: true,
    },

    ssr: {
      ...(mode === "production" && {
        noExternal: ["http-errors"],
      }),
    },

    test: {
      environment: "node",
      testTimeout: 20000,
    },
  };
});
