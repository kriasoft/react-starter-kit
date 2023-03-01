/* SPDX-FileCopyrightText: 2020-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { resolve } from "node:path";
import { defineConfig } from "vitest/config";
import { getCloudflareBindings } from "../scripts/utils.js";

export default defineConfig({
  cacheDir: "../.cache/vite-edge",

  // Production build configuration
  // https://vitejs.dev/guide/build
  build: {
    lib: {
      entry: "index.ts",
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["__STATIC_CONTENT_MANIFEST"],
    },
  },

  resolve: {
    alias: {
      ["__STATIC_CONTENT_MANIFEST"]: resolve("./core/manifest.ts"),
    },
  },

  // Unit testing configuration
  // https://vitest.dev/config/
  test: {
    cache: {
      dir: "../.cache/vitest-edge",
    },
    deps: {
      registerNodeLoader: true,
      external: ["__STATIC_CONTENT_MANIFEST"],
    },
    environment: "miniflare",
    environmentOptions: {
      bindings: getCloudflareBindings(),
    },
  },
});
