#!/usr/bin/env bun
import {
  execCommand,
  installedComponents,
  postprocessComponents,
} from "./postprocess.js";

const usage = [
  "Usage: bun ui:update [component]...",
  "",
  "Re-fetches installed components from the registry, overwriting them in",
  "place. Local edits are lost – review `git diff` afterwards.",
  "",
  "  bun ui:update             Update every installed component",
  "  bun ui:update button card Refresh the named components",
  "",
  "Refreshes what is already installed; use `bun ui:add` for new components.",
  "Naming a component also refreshes its registry dependencies, so the diff can",
  "be wider than the names given.",
].join("\n");

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(usage);
  process.exit(0);
}

const installed = await installedComponents();

if (installed.length === 0) {
  throw new Error("No components installed – add one with `bun ui:add`.");
}

// Refuse names that aren't installed: `shadcn add --overwrite` would happily
// install them, turning a typo (or a stray flag) into a silent addition.
const unknown = args.filter((arg) => !installed.includes(arg));

if (unknown.length > 0) {
  console.error(
    `Not installed: ${unknown.join(", ")}\n\n` +
      `Add with \`bun ui:add ${unknown.join(" ")}\`, or update one of:\n` +
      `  ${installed.join(", ")}`,
  );
  process.exit(1);
}

const components = args.length > 0 ? args : installed;

// One `shadcn add` call rather than one per component: `bunx` re-resolves the
// CLI every invocation, which costs more than the downloads, and the dependency
// graph is resolved once. Not atomic – the CLI may have written files before a
// later failure.
//
// `shadcn@latest` is unpinned on purpose: these are manual upgrade commands, so
// they should pull the current CLI and registry.
await execCommand("bunx", [
  "shadcn@latest",
  "add",
  ...components,
  "--overwrite",
  "--yes",
]);
await postprocessComponents();

console.log(`Updated ${components.length} components – review \`git diff\`.`);
