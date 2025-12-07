#!/usr/bin/env bun
import { join } from "node:path";
import { Glob } from "bun";

/**
 * Execute a command with inherited stdio
 */
export async function execCommand(
  command: string,
  args: string[],
): Promise<void> {
  const proc = Bun.spawn([command, ...args], {
    stdio: ["inherit", "inherit", "inherit"],
  });

  const exitCode = await proc.exited;
  if (exitCode !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }
}

/**
 * Format generated UI component files with Prettier
 */
export async function formatGeneratedFiles(): Promise<void> {
  try {
    const componentsDir = join(import.meta.dirname, "../components");

    const glob = new Glob("**/*.{ts,tsx}");
    const componentFiles: string[] = [];

    for await (const file of glob.scan({
      cwd: componentsDir,
      absolute: true,
    })) {
      componentFiles.push(file);
    }

    if (componentFiles.length === 0) {
      return;
    }

    console.log("🎨 Formatting generated files with Prettier...");

    await execCommand("bunx", ["prettier", "--write", ...componentFiles]);

    console.log("✨ Files formatted successfully");
  } catch (error) {
    console.warn("⚠️  Failed to format files with Prettier:", error);
  }
}
