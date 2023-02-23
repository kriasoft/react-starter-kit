/* SPDX-FileCopyrightText: 2020-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { readFileSync } from "node:fs";
import { parse } from "toml";
import { defineConfig } from "vitest/config";

const config = parse(readFileSync("./wrangler.toml", "utf8"));

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
      ["__STATIC_CONTENT_MANIFEST"]: "./manifest.ts",
    },
  },

  define: {
    bindings: JSON.stringify(config.vars),
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
  },
});
