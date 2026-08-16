#!/usr/bin/env bun
import { execCommand, postprocessComponents } from "./postprocess.js";

const usage = [
  "Usage: bun ui:add <component>...",
  "",
  "Adds shadcn/ui components to packages/ui, along with their registry",
  "dependencies, and refreshes the barrel export.",
  "",
  "  bun ui:add button card   Add the named components",
  "",
  "Takes shadcn item names only; CLI options are not supported. This wrapper",
  "always writes to packages/ui and postprocesses afterwards, which would defeat",
  "the read-only flags. For those, or for blocks and custom registries, run the",
  "CLI directly and point it at the workspace:",
  "",
  "  bunx shadcn@latest add button --dry-run --cwd packages/ui",
].join("\n");

const args = process.argv.slice(2);

if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  console.log(usage);
  process.exit(args.length === 0 ? 1 : 0);
}

const flags = args.filter((arg) => arg.startsWith("-"));

if (flags.length > 0) {
  console.error(`Unsupported option(s): ${flags.join(", ")}\n`);
  console.error(usage);
  process.exit(1);
}

await execCommand("bunx", ["shadcn@latest", "add", ...args, "--yes"]);
await postprocessComponents();
