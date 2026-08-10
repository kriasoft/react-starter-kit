import { configDotenv } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { resolve } from "node:path";

const ENVIRONMENTS = ["dev", "test", "staging", "production"] as const;
type Environment = (typeof ENVIRONMENTS)[number];

// Validate the explicit selector so a typo cannot fall through to development
// and target the wrong database. Unknown NODE_ENV values remain development
// because tooling uses that variable for unrelated modes.
const envName: Environment = (() => {
  const requested = process.env.ENVIRONMENT;

  if (requested) {
    const name = requested === "development" ? "dev" : requested;
    if (!ENVIRONMENTS.includes(name as Environment)) {
      throw new Error(
        `Unknown ENVIRONMENT "${requested}". Expected one of: ${ENVIRONMENTS.join(", ")}.`,
      );
    }
    return name as Environment;
  }

  if (process.env.NODE_ENV === "production") return "production";
  if (process.env.NODE_ENV === "staging") return "staging";
  if (process.env.NODE_ENV === "test") return "test";
  return "dev";
})();

const envFile = (name: string) => resolve(__dirname, "..", name);

// Staging and production fail closed: read that environment's file and nothing
// else, and let it win over an inherited `DATABASE_URL`. The cascade below is
// convenient locally but dangerous here – a missing file or a value left
// exported by an earlier command would silently point an environment-named
// migration at a different database, with no output saying so.
if (envName === "staging" || envName === "production") {
  const { error, parsed } = configDotenv({
    path: envFile(`.env.${envName}.local`),
    override: true,
    quiet: true,
  });

  if (error) {
    throw new Error(
      `Missing .env.${envName}.local – refusing to target ${envName}. ` +
        `Create it with that environment's DATABASE_URL rather than letting ` +
        `the command fall through to another database.`,
    );
  }

  if (!parsed?.DATABASE_URL) {
    throw new Error(
      `.env.${envName}.local must define DATABASE_URL – refusing to reuse ` +
        `a value inherited from the shell or another tool.`,
    );
  }
} else {
  // Development: first value wins, so an explicit shell variable still beats
  // the files, matching Vite's convention.
  for (const name of [`.env.${envName}.local`, ".env.local", ".env"]) {
    configDotenv({ path: envFile(name), quiet: true });
  }
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
