#!/usr/bin/env bun

import { execa } from "execa";
import { globby } from "globby";

/**
 * Execute a command using execa with proper error handling
 */
export async function execCommand(
  command: string,
  args: string[],
): Promise<void> {
  try {
    await execa(command, args, {
      stdio: "inherit",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Command failed: ${command} ${args.join(" ")} - ${message}`,
    );
  }
}

/**
 * Format generated UI component files with Prettier
 */
export async function formatGeneratedFiles(): Promise<void> {
  try {
    const componentFiles = await globby("components/ui/**/*.{ts,tsx}", {
      absolute: true,
    });

    if (componentFiles.length === 0) {
      return;
    }

    console.log("🎨 Formatting generated files with Prettier...");

    await execa("bunx", ["prettier", "--write", ...componentFiles], {
      stdio: "inherit",
    });

    console.log("✨ Files formatted successfully");
  } catch (error) {
    console.warn("⚠️  Failed to format files with Prettier:", error);
  }
}
