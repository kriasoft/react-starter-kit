/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { execa } from "execa";
import { copyFile, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(fileURLToPath(import.meta.url), "../..");
const rootPkg = JSON.parse(await readFile(`${rootDir}/package.json`, "utf-8"));
const pkg = JSON.parse(await readFile("./package.json", "utf-8"));

pkg.packageManager = rootPkg.packageManager;
delete pkg.scripts;
delete pkg.devDependencies;
delete pkg.dependencies.db;

// Create ./dist/package.json
await writeFile("./dist/package.json", JSON.stringify(pkg, null, 2), "utf-8");

// Create ./dist/yarn.lock
await copyFile(`${rootDir}/yarn.lock`, "./dist/yarn.lock");

// Install production dependencies
await execa("yarn", ["install", "--mode=update-lockfile"], {
  env: {
    ...process.env,
    NODE_OPTIONS: undefined,
    YARN_ENABLE_IMMUTABLE_INSTALLS: "false",
  },
  cwd: "./dist",
  stdio: "inherit",
});
