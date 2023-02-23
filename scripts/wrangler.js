/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import envars from "envars";
import { execa } from "execa";
import { template } from "lodash-es";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as toml from "toml";
import { $, fs } from "zx";
import { getArgs } from "./utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const [args, envName = "test"] = getArgs();

// Load environment variables from `env/*.env` file(s)
envars.config({ cwd: path.resolve(__dirname, "../env"), env: envName });

// Load Wrangler CLI configuration file
let config = toml.parse(await fs.readFile("./wrangler.toml", "utf-8"));

// Interpolate environment variables
config = JSON.parse(JSON.stringify(config), (key, value) => {
  return typeof value === "string"
    ? template(value, {
        interpolate: /\$\{?([\w]+)\}?/,
      })($.env)
    : value;
});

// Serialize and save Wrangler configuration to ./dist/wrangler.json
config = JSON.stringify(config, null, 2);
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
