/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import envars from "envars";
import { template } from "lodash-es";
import { readFileSync } from "node:fs";
import fs from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseToml } from "toml";
import { $ } from "zx";

export const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
export const envDir = resolve(rootDir, "env");

/**
 * Get the arguments passed to the script.
 *
 * @returns {[args: string[], envName: string | undefined]}
 */
export function getArgs() {
  const args = process.argv.slice(2);
  /** @type {String} */
  let envName;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--env") {
      envName = args[i + 1];
      args.splice(i, 2);
      break;
    }

    if (args[i]?.startsWith("--env=")) {
      envName = args[i].slice(6);
      args.splice(i, 1);
      break;
    }
  }

  return [args, envName];
}

/**
 * Load environment variables used in the Cloudflare Worker.
 */
export function getCloudflareBindings(file = "wrangler.toml", envName) {
  const env = envars.config({ cwd: envDir, env: envName });
  let config = parseToml(readFileSync(file, "utf-8"));

  return {
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    GOOGLE_CLOUD_CREDENTIALS: process.env.GOOGLE_CLOUD_CREDENTIALS,
    ...JSON.parse(JSON.stringify(config.vars), (key, value) => {
      return typeof value === "string"
        ? value.replace(/\$\{?([\w]+)\}?/g, (_, key) => env[key])
        : value;
    }),
  };
}

export async function readWranglerConfig(file, envName = "test") {
  // Load environment variables from `env/*.env` file(s)
  envars.config({ cwd: resolve(rootDir, "env"), env: envName });

  // Load Wrangler CLI configuration file
  let config = parseToml(await fs.readFile(file, "utf-8"));

  // Interpolate environment variables
  return JSON.parse(JSON.stringify(config), (key, value) => {
    return typeof value === "string"
      ? template(value, {
          interpolate: /\$\{?([\w]+)\}?/,
        })($.env)
      : value;
  });
}
