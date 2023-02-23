/* SPDX-FileCopyrightText: 2020-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { readFileSync } from "node:fs";
import { parse } from "toml";
import { defineConfig } from "vitest/config";

const config = parse(readFileSync("./wrangler.toml", "utf8"));

export default defineConfig({
  cacheDir: "../.cache/vite-api",
  build: {
    lib: {
      name: "api",
      entry: "index.ts",
      fileName: "index",
      formats: ["es"],
    },
  },
  define: {
    bindings: JSON.stringify(config.vars),
  },
});
