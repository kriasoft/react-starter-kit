/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { readFileSync } from "node:fs";
import { defineWorkspace } from "vitest/config";
// import { workspaces } from "./package.json";

const { workspaces } = JSON.parse(readFileSync("./package.json", "utf-8"));

/**
 * Inline Vitest configuration for all workspaces.
 *
 * @see https://vitest.dev/guide/workspace
 */
export default defineWorkspace(
  workspaces
    .filter((name) => !["scripts"].includes(name))
    .map((name) => ({
      extends: `./${name}/vite.config.ts`,
      test: {
        name,
        root: `./${name}`,
      },
    })),
);
