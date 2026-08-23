#!/usr/bin/env bun

/**
 * @file Builds and deploys the three workers to one environment.
 *
 * The same command runs from a laptop and from `deploy.yml`, so a release from
 * either cannot drift in order or in environment selection. CI passes
 * `--skip-build` because it deploys the artifact it already verified.
 *
 * Migrations are not here. They run before the workers in CI, under a
 * credential this script never sees, and applying them from a laptop is a
 * separate deliberate act – `bun db:migrate:staging`.
 */

import { access } from "node:fs/promises";
import { resolve } from "node:path";

const USAGE =
  "Usage: bun scripts/deploy.ts <staging|production> [--skip-build]";

const repoRoot = resolve(import.meta.dir, "..");
const [environment, ...options] = Bun.argv.slice(2);

if (environment === "--help" || environment === "-h") {
  console.log(USAGE);
  process.exit(0);
}

// Unknown flags are rejected rather than ignored: a mistyped `--skip-builds`
// that silently rebuilt would waste minutes, and one that silently skipped
// would deploy a stale `dist`.
if (
  (environment !== "staging" && environment !== "production") ||
  options.some((option) => option !== "--skip-build")
) {
  console.error(USAGE);
  process.exit(1);
}

const skipBuild = options.includes("--skip-build");

async function run(command: string[]): Promise<void> {
  console.log(`\n$ ${command.map((part) => JSON.stringify(part)).join(" ")}`);

  const child = Bun.spawn(command, {
    cwd: repoRoot,
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });

  const exitCode = await child.exited;
  if (exitCode !== 0) process.exit(exitCode);
}

if (!skipBuild) {
  await run(["bun", "run", "build"]);
}

// Wrangler resolves `./dist` relative to each `wrangler.jsonc` and uploads an
// empty asset directory without complaint, so a missing build surfaces as a
// blank site rather than a failed deploy.
for (const artifact of ["apps/email/dist", "apps/app/dist", "apps/web/dist"]) {
  try {
    await access(resolve(repoRoot, artifact));
  } catch {
    console.error(
      `Missing ${artifact}; build first, or omit --skip-build to build automatically.`,
    );
    process.exit(1);
  }
}

// No `--env-file`, deliberately. Wrangler already loads `.env`, `.env.local`
// and – when `--env` names one – `.env.<env>.local` relative to the working
// directory, which is why `cwd` above is the repo root. Listing the first two
// explicitly, as the per-worker `*:deploy` scripts do, would only suppress the
// third on a staging deploy. Real credentials stay safe either way: Wrangler
// merges the files under `process.env`, so an exported value wins over the
// placeholders in the committed `.env`.

// Production is Wrangler's top-level environment, which is selected by an empty
// `--env`. Mapping it here, once, is why nothing downstream has to remember
// that an absent value deploys production.
const wranglerEnvironment = environment === "production" ? "" : environment;

console.log(
  `\nDeploying to ${environment}. Sequential and not atomic: a failure partway ` +
    `leaves some workers on the new version.`,
);

// Order matters. A service binding resolves its target by name at deploy time,
// so api and app must exist before web binds to them, and web holds the only
// public route – flipping it last moves user traffic after the workers behind
// it are new.
for (const config of [
  "apps/api/wrangler.jsonc",
  "apps/app/wrangler.jsonc",
  "apps/web/wrangler.jsonc",
]) {
  await run([
    "bun",
    "wrangler",
    "deploy",
    "--config",
    config,
    "--env",
    wranglerEnvironment,
  ]);
}
