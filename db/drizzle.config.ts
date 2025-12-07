import { configDotenv } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { resolve } from "node:path";

// Environment detection: ENVIRONMENT var takes priority, then NODE_ENV mapping
const envName = (() => {
  if (process.env.ENVIRONMENT) return process.env.ENVIRONMENT;
  if (process.env.NODE_ENV === "production") return "prod";
  if (process.env.NODE_ENV === "staging") return "staging";
  if (process.env.NODE_ENV === "test") return "test";
  return "dev";
})();

// Load .env files in priority order: environment-specific → local → base
for (const file of [`.env.${envName}.local`, ".env.local", ".env"]) {
  configDotenv({ path: resolve(__dirname, "..", file), quiet: true });
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Validate DATABASE_URL format (accepts both postgres:// and postgresql://)
if (!/^postgre(s|sql):\/\/.+/.test(process.env.DATABASE_URL)) {
  throw new Error("DATABASE_URL must be a valid PostgreSQL connection string");
}

/**
 * Drizzle ORM configuration for Neon PostgreSQL database
 *
 * @see https://orm.drizzle.team/docs/drizzle-config-file
 * @see https://orm.drizzle.team/llms.txt
 */
export default defineConfig({
  out: "./migrations",
  schema: "./schema",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
