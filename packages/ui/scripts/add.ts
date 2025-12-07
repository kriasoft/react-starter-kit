#!/usr/bin/env bun
import { execCommand, formatGeneratedFiles } from "./format-utils.js";

async function addComponent(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log("📋 shadcn/ui Component Installer");
    console.log("=================================\n");
    console.log("Usage:");
    console.log("  bun run ui:add <component>     Add a single component");
    console.log("  bun run ui:add <comp1> <comp2> Add multiple components");
    console.log(
      "  bun run ui:add --all           Add all available components",
    );
    console.log("\nExamples:");
    console.log("  bun run ui:add button");
    console.log("  bun run ui:add button card input");
    console.log("  bun run ui:add dialog alert-dialog toast");

    if (args.length === 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  }

  console.log("🚀 Adding shadcn/ui components...");

  try {
    const shadcnArgs = ["shadcn@latest", "add", ...args, "--yes"];

    console.log(`Running: bunx ${shadcnArgs.join(" ")}`);
    await execCommand("bunx", shadcnArgs);

    await formatGeneratedFiles();

    console.log("✅ Components added successfully!");
  } catch (error) {
    console.error("❌ Failed to add components:", error);
    process.exit(1);
  }
}

addComponent().catch(console.error);
