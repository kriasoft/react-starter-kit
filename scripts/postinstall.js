/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { execa } from "execa";
import fs from "node:fs";
import { EOL } from "node:os";

const environments = [
  { name: "local", description: "development" },
  { name: "test", description: "staging/QA" },
  { name: "prod", description: "production" },
];

// Create Git-ignored files for environment variable overrides
for (const env of environments) {
  const filename = `./env/.${env.name}.override.env`;

  if (!fs.existsSync(filename)) {
    await fs.writeFile(
      filename,
      [
        `# Overrides for the "${env.name}" (${env.description}) environment`,
        "#",
        "# CLOUDFLARE_API_TOKEN=xxxxx",
        "# GOOGLE_CLOUD_CREDENTIALS=xxxxx",
        "# SENDGRID_API_KEY=xxxxx",
        "#",
        "",
      ].join(EOL),
      "utf-8",
    );
  }
}

try {
  await execa("yarn", ["tsc", "--build"], { stdin: "inherit" });
} catch (err) {
  console.error(err);
}
