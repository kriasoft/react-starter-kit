import { execa } from "execa";
import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { EOL } from "node:os";

// Create Git-ignored files for environment variable overrides
if (!existsSync("./.env.local")) {
  await writeFile(
    "./.env.local",
    [
      `# Overrides for the \`.env\` file in the root folder.`,
      "#",
      "# CLOUDFLARE_API_TOKEN=xxxxx",
      "#",
      "",
      "API_URL=http://localhost:8080",
      "",
    ].join(EOL),
    "utf-8",
  );
}

try {
  await execa("bun", ["run", "tsc", "--build"], { stdin: "inherit" });
} catch {
  // A fresh clone may not typecheck yet; post-install must not fail the install.
}
