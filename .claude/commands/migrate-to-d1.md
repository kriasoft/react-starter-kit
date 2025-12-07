Migrate the project from Neon to Cloudflare D1 database following these steps:

- [ ] Replace all mentions of "Cloudflare D1" with "Neon PostgreSQL" in @CLAUDE.md, @db/CLAUDE.md, and README.md files.

- [ ] Update @db/drizzle.config.ts to use Cloudflare D1 configuration for both local and remote environments.

```typescript
/**
 * Drizzle ORM configuration for dual-mode (local/remote) D1 connections.
 * Local: Wrangler SQLite file. Remote: D1 via HTTPS with account credentials.
 */

import { defineConfig } from "drizzle-kit";
import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

process.loadEnvFile("../.env.local");
process.loadEnvFile("../.env");

const envName =
  process.env.npm_lifecycle_event?.endsWith(":remote") ||
  process.env.DB === "remote"
    ? "remote"
    : "local";

const wranglerDir = resolve(__dirname, "../.wrangler/state/v3");
const d1Dir = resolve(wranglerDir, "d1/miniflare-D1DatabaseObject");

// Safely find the SQLite database file for local development
function getLocalDatabaseFile(): string {
  if (!existsSync(d1Dir)) {
    throw new Error(
      `Local D1 database directory not found: ${d1Dir}\n` +
        `Make sure to run this command first to initialize the local database:\n\n` +
        `bun wrangler d1 execute db --local --command "SELECT 1"`,
    );
  }

  const sqliteFiles = readdirSync(d1Dir).filter((file) =>
    file.endsWith(".sqlite"),
  );

  if (sqliteFiles.length === 0) {
    throw new Error(
      `No SQLite database files found in: ${d1Dir}\n` +
        `Make sure to run this command first to create the local database:\n\n` +
        `bun wrangler d1 execute db --local --command "SELECT 1"`,
    );
  }

  if (sqliteFiles.length > 1) {
    console.warn(
      `Multiple SQLite files found: ${sqliteFiles.join(", ")}. Using: ${sqliteFiles[0]}`,
    );
  }

  return sqliteFiles[0];
}

const d1File = envName === "local" ? getLocalDatabaseFile() : "";

// Helper to validate required environment variables
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `${key} environment variable is required for remote database access`,
    );
  }
  return value;
}

/**
 * Drizzle ORM configuration for the Cloudflare D1 database.
 *
 * See {@link https://orm.drizzle.team/docs/drizzle-config-file}
 * See {@link https://orm.drizzle.team/llms.txt}
 */
export default defineConfig({
  out: "./migrations",
  schema: "./schema",
  dialect: "sqlite",
  casing: "snake_case",

  // Local development configuration
  ...(envName === "local" && {
    dbCredentials: { url: resolve(d1Dir, d1File) },
  }),

  // Production/staging configuration
  ...(envName !== "local" && {
    driver: "d1-http",
    dbCredentials: {
      accountId: requireEnv("CLOUDFLARE_ACCOUNT_ID"),
      databaseId: requireEnv("CLOUDFLARE_DATABASE_ID"),
      token: requireEnv("CLOUDFLARE_D1_TOKEN"),
    },
  }),
});
```

- [ ] Update all files in @db/schema/ to use SQLite-compatible syntax for Cloudflare D1 support.

- [ ] Update database initialization function in @api/lib/db.ts to use Cloudflare D1.

- [ ] Update all database queries in @api/ to use Cloudflare D1 syntax.
