/* SPDX-FileCopyrightText: 2020-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { defineConfig } from "vitest/config";
import { getCloudflareBindings } from "../scripts/utils.js";

export default defineConfig({
  cacheDir: "../.cache/vite-api",
  build: {
    lib: {
      entry: "index.ts",
      fileName: "index",
      formats: ["es"],
    },
  },
  define: {
    bindings: JSON.stringify(getCloudflareBindings()),
  },
  test: {
    cache: {
      dir: "../.cache/vitest-api",
    },
  },
});
