#!/usr/bin/env bun
import { execCommand, formatGeneratedFiles } from "./format-utils.js";

// Essential components for most applications
const ESSENTIAL_COMPONENTS = [
  // Forms & Inputs
  "button",
  "input",
  "textarea",
  "select",
  "checkbox",
  "radio-group",
  "switch",
  "label",
  "form",
  // Layout & Structure
  "card",
  "separator",
  "skeleton",
  "scroll-area",
  // Navigation
  "navigation-menu",
  "breadcrumb",
  "tabs",
  // Feedback & Communication
  "dialog",
  "alert-dialog",
  "toast",
  "alert",
  "badge",
  "progress",
  // Data Display
  "avatar",
  "tooltip",
  "popover",
];

async function installEssentials(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log("🎯 shadcn/ui Essential Components Installer");
    console.log("===========================================\n");
    console.log(
      "Installs a curated set of essential shadcn/ui components for most applications.\n",
    );
    console.log("Essential components include:");
    console.log(
      "• Forms: button, input, textarea, select, checkbox, radio-group, switch, label, form",
    );
    console.log("• Layout: card, separator, skeleton, scroll-area");
    console.log("• Navigation: navigation-menu, breadcrumb, tabs");
    console.log(
      "• Feedback: dialog, alert-dialog, toast, alert, badge, progress",
    );
    console.log("• Data Display: avatar, tooltip, popover\n");
    console.log("Usage:");
    console.log(
      "  bun run ui:essentials          Install all essential components",
    );
    console.log(
      "  bun run ui:essentials --list   List essential components without installing",
    );
    process.exit(0);
  }

  if (args.includes("--list")) {
    console.log("📋 Essential shadcn/ui Components");
    console.log("==================================\n");
    console.log(`Total: ${ESSENTIAL_COMPONENTS.length} components\n`);

    ESSENTIAL_COMPONENTS.forEach((component, index) => {
      console.log(`${(index + 1).toString().padStart(2)}. ${component}`);
    });

    console.log("\n💡 To install these components, run:");
    console.log("  bun run ui:essentials");
    return;
  }

  console.log("🎯 Installing Essential shadcn/ui Components");
  console.log("=============================================\n");
  console.log(
    `Installing ${ESSENTIAL_COMPONENTS.length} essential components...\n`,
  );

  try {
    const shadcnArgs = [
      "shadcn@latest",
      "add",
      ...ESSENTIAL_COMPONENTS,
      "--yes",
    ];

    await execCommand("bunx", shadcnArgs);

    await formatGeneratedFiles();

    console.log("\n🎉 Essential components installed successfully!");
    console.log("\n📊 Summary:");
    console.log(`✅ Installed ${ESSENTIAL_COMPONENTS.length} components`);
    console.log("\n💡 View installed components with:");
    console.log("  bun run ui:list");
  } catch (error) {
    console.error("❌ Failed to install essential components:", error);
    process.exit(1);
  }
}

installEssentials().catch(console.error);
