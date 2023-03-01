/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { execa } from "execa";
import getPort, { portNumbers } from "get-port";
import { debounce } from "lodash-es";
import { Log, LogLevel, Miniflare } from "miniflare";
import { getArgs, getCloudflareBindings, readWranglerConfig } from "./utils.js";

const [args, envName = "local"] = getArgs();
const edgeConfig = await readWranglerConfig("edge/wrangler.toml", envName);

// Build the "edge" (CDN edge endpoint) package in "watch" mode using Vite
const edge = execa(
  "yarn",
  ["workspace", "edge", "build", "--mode=development", "--watch", ...args],
  { stdio: ["inherit", "pipe", "inherit"], env: { FORCE_COLOR: 1 } },
);

// Start listening for the (re)build events
/** @type {Miniflare} */ let mf;
await new Promise((resolve, reject) => {
  edge.then(resolve, reject);
  const reload = debounce(() => {
    mf?.reload();
    resolve();
  }, 300);
  edge.stdout.on("data", (data) => {
    if (!mf) process.stdout.write(data);
    if (data.toString().includes("built in")) reload();
  });
});

// Configure Cloudflare dev server
// https://miniflare.dev/get-started/api
const port = await getPort({ port: portNumbers(8080, 8090) });
mf = new Miniflare({
  name: edgeConfig.name,
  log: new Log(LogLevel.INFO),
  scriptPath: "edge/dist/index.js",
  sitePath: "app/dist",
  wranglerConfigPath: false,
  modules: true,
  modulesRules: [
    { type: "ESModule", include: ["**/*.js"], fallthrough: true },
    { type: "Text", include: ["**/*.md"] },
  ],
  upstream: process.env.APP_ORIGIN,
  routes: ["*/*"],
  logUnhandledRejections: true,
  bindings: getCloudflareBindings("edge/wrangler.toml", envName),
  port,
});

const server = await mf.createServer();
await new Promise((resolve) => server.listen(port, resolve));
process.env.LOCAL_API_ORIGIN = `http://localhost:${port}`;
mf.log.info(`API listening on ${process.env.LOCAL_API_ORIGIN}/`);

// Launch the front-end app using Vite dev server
execa("yarn", ["workspace", "app", "run", "start", ...args], {
  stdio: "inherit",
}).on("close", () => cleanUp());

async function cleanUp() {
  await mf?.dispose();
  edge.kill();
  setTimeout(() => process.exit(), 500);
}
