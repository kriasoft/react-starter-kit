import { z } from "zod";

/**
 * Zod schema for validating environment variables.
 * Ensures all required configuration values are present and correctly formatted.
 *
 * @throws {ZodError} When environment variables don't match the schema
 */
export const envSchema = z.object({
  ENVIRONMENT: z.enum(["production", "staging", "preview", "development"]),
  APP_NAME: z.string().default("Example"),
  APP_ORIGIN: z.url(),
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  OPENAI_API_KEY: z.string(),
  RESEND_API_KEY: z.string(),
  RESEND_EMAIL_FROM: z.email(),
});

/**
 * Runtime environment variables accessor.
 *
 * @remarks
 * - In Bun runtime: Variables are accessed via `Bun.env`
 * - In Cloudflare Workers: Variables must be accessed via request context
 * - Falls back to empty object when Bun global is unavailable
 *
 * @example
 * // In Bun runtime
 * const dbUrl = env.DATABASE_URL;
 *
 * // In Cloudflare Workers (must use context)
 * const dbUrl = context.env.DATABASE_URL;
 */
export const env =
  typeof Bun === "undefined" ? ({} as Env) : envSchema.parse(Bun.env);

/**
 * Type-safe environment variables interface.
 * Inferred from the Zod schema to ensure type safety.
 */
export type Env = z.infer<typeof envSchema>;
