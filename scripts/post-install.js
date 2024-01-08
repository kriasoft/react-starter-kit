/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { execa } from "execa";
import fs from "node:fs";
import { EOL } from "node:os";

// Create Git-ignored files for environment variable overrides
if (!fs.existsSync("./.env.local")) {
  await fs.writeFile(
    "./.env.local",
    [
      `# Overrides for the \`.env\` file in the root folder.`,
      "#",
      "# CLOUDFLARE_API_TOKEN=xxxxx",
      "# GOOGLE_CLOUD_CREDENTIALS=xxxxx",
      "# SENDGRID_API_KEY=xxxxx",
      "#",
      "",
      "API_URL=http://localhost:8080",
      "",
    ].join(EOL),
    "utf-8",
  );
}

try {
  await execa("yarn", ["tsc", "--build"], { stdin: "inherit" });
} catch (err) {
  console.error(err);
}
