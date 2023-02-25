/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import envars from "envars";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseToml } from "toml";

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
export function getCloudflareBindings() {
  const env = envars.config({ cwd: envDir });
  let config = parseToml(readFileSync("./wrangler.toml", "utf-8"));

  return {
    SENDGRID_API_KEY: env.SENDGRID_API_KEY,
    GOOGLE_CLOUD_CREDENTIALS: env.GOOGLE_CLOUD_CREDENTIALS,
    ...JSON.parse(JSON.stringify(config.vars), (key, value) => {
      return typeof value === "string"
        ? value.replace(/\$\{?([\w]+)\}?/g, (_, key) => env[key])
        : value;
    }),
  };
}
