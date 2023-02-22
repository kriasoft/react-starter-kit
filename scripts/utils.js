/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

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
