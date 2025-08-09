#!/usr/bin/env bun

import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execCommand, formatGeneratedFiles } from "./format-utils.js";

async function getInstalledComponents(): Promise<string[]> {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const componentsDir = join(__dirname, "../components");

  if (!existsSync(componentsDir)) {
    throw new Error(`Components directory not found: ${componentsDir}`);
  }

  const files = await readdir(componentsDir);
  const tsxFiles = files.filter((file) => file.endsWith(".tsx"));

  return tsxFiles.map((file) => basename(file, ".tsx"));
}

async function updateComponents(): Promise<void> {
  console.log("🔍 Finding installed shadcn/ui components...");

  try {
    const components = await getInstalledComponents();

    if (components.length === 0) {
      console.log("❌ No shadcn/ui components found in packages/ui/components");
      process.exit(1);
    }

    console.log(`📦 Found ${components.length} components:`);
    components.forEach((component) => console.log(`  • ${component}`));

    console.log("\n🚀 Updating components...");

    for (const component of components) {
      console.log(`\n⏳ Updating ${component}...`);

      try {
        await execCommand("bunx", [
          "shadcn@latest",
          "add",
          component,
          "--overwrite",
          "--yes",
        ]);
        console.log(`✅ ${component} updated successfully`);
      } catch (error) {
        console.error(`❌ Failed to update ${component}:`, error);
      }
    }

    await formatGeneratedFiles();

    console.log("\n🎉 All components update process completed!");
  } catch (error) {
    console.error("Error updating components:", error);
    process.exit(1);
  }
}

// Add option to update specific component
const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log("🔄 shadcn/ui Component Updater");
  console.log("===============================\n");
  console.log("Usage:");
  console.log(
    "  bun run ui:update              Update all installed components",
  );
  console.log("  bun run ui:update <component>  Update a specific component");
  console.log("\nExamples:");
  console.log("  bun run ui:update");
  console.log("  bun run ui:update button");
  process.exit(0);
}

if (args.length > 0) {
  console.log(`🚀 Updating specific component: ${args[0]}...`);
  execCommand("bunx", ["shadcn@latest", "add", args[0], "--overwrite", "--yes"])
    .then(async () => {
      await formatGeneratedFiles();
      console.log(`✅ ${args[0]} updated successfully`);
    })
    .catch((error) => {
      console.error(`❌ Failed to update ${args[0]}:`, error);
      process.exit(1);
    });
} else {
  updateComponents().catch(console.error);
}
