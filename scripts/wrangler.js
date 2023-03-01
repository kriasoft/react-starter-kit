/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { execa } from "execa";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { $, fs } from "zx";
import { getArgs, readWranglerConfig } from "./utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const [args, envName = "test"] = getArgs();

// Interpolate and save Wrangler configuration to ./dist/wrangler.json
let config = await readWranglerConfig("./wrangler.toml", envName);
config = JSON.stringify(config, null, "  ");
await fs.writeFile("./dist/wrangler.json", config, "utf-8");

const wranglerBin = await execa("yarn", ["bin", "wrangler"], {
  cwd: __dirname,
}).then((p) => p.stdout);

// Check if there is a secret name, for example:
//   > yarn workspace edge wrangler secret put AUTH_KEY
const secret = args.find(
  (_, i) => args[i - 2] === "secret" && args[i - 1] === "put",
);

// Launch Wrangler CLI
const p = execa(
  "yarn",
  [
    "node",
    wranglerBin,
    "--experimental-json-config",
    "-c",
    "./dist/wrangler.json",
    envName === "prod" ? undefined : `--env=${envName}`,
    ...args,
  ].filter(Boolean),
  {
    stdio: secret && $.env[secret] ? ["pipe", "inherit", "inherit"] : "inherit",
  },
);

// Write secret values to stdin (in order to avoid typing them)
if (secret && $.env[secret] && p.stdin) {
  p.stdin.write($.env[args[2]]);
  p.stdin.end();
}

// Suppress the error message from the spawned process
await p.catch(() => {
  process.exitCode = process.exitCode ?? 1;
  return Promise.resolve();
});
