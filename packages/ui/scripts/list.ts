#!/usr/bin/env bun
import { existsSync } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import { basename, join } from "node:path";

interface ComponentInfo {
  name: string;
  size: number;
  modified: Date;
}

async function getComponentInfo(filePath: string): Promise<ComponentInfo> {
  const stats = await stat(filePath);
  const name = basename(filePath, ".tsx");

  return {
    name,
    size: stats.size,
    modified: stats.mtime,
  };
}

async function listComponents(): Promise<void> {
  console.log("📋 shadcn/ui Component Inventory");
  console.log("=============================\n");

  const componentsDir = join(import.meta.dirname, "../components");

  if (!existsSync(componentsDir)) {
    console.log(`❌ Components directory not found: ${componentsDir}`);
    console.log("💡 Run 'bunx shadcn@latest init' to set up shadcn/ui first");
    process.exit(1);
  }

  try {
    const files = await readdir(componentsDir);
    const tsxFiles = files.filter((file) => file.endsWith(".tsx"));

    if (tsxFiles.length === 0) {
      console.log("❌ No shadcn/ui components found");
      console.log("💡 Add components with: bun run ui:add <component-name>");
      return;
    }

    console.log("📦 Installed Components:\n");

    const components: ComponentInfo[] = [];

    for (const file of tsxFiles) {
      const filePath = join(componentsDir, file);
      const info = await getComponentInfo(filePath);
      components.push(info);
    }

    // Sort by name
    components.sort((a, b) => a.name.localeCompare(b.name));

    // Display components
    for (const component of components) {
      const formattedSize = component.size.toLocaleString();
      const formattedDate = component.modified
        .toISOString()
        .slice(0, 16)
        .replace("T", " ");
      console.log(
        `• ${component.name.padEnd(20)} ${formattedSize.padStart(8)} bytes  ${formattedDate}`,
      );
    }

    console.log("\n📊 Summary:");
    console.log(`Total components: ${components.length}`);

    console.log("\n🔄 To update all components, run:");
    console.log("  bun run ui:update");
  } catch (error) {
    console.error("Error reading components:", error);
    process.exit(1);
  }
}

listComponents().catch(console.error);
