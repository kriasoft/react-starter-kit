import { z } from "zod";

/** Environment contract and source for the inferred `Env` type. */
export const envSchema = z.object({
  // The database arrives via Hyperdrive bindings, not a connection string, so no
  // DATABASE_URL here – that belongs to `db/`'s drizzle-kit process.
  ENVIRONMENT: z.enum(["production", "staging", "development"]),
  // Required: the SPA build fails without it and every Wrangler env sets it.
  APP_NAME: z.string(),
  APP_ORIGIN: z.url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  // Email OTP is the primary sign-in method, so mail delivery is not optional.
  RESEND_API_KEY: z.string(),
  RESEND_EMAIL_FROM: z.email(),
  // Google OAuth (optional – both or neither; see `googleProvider` in auth.ts).
  // Without them sign-in still works through email OTP and passkeys.
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  // Stripe billing (optional – app works without these, billing features disabled)
  STRIPE_SECRET_KEY: z.string().startsWith("sk_").optional(),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_").optional(),
  STRIPE_STARTER_PRICE_ID: z.string().startsWith("price_").optional(),
  STRIPE_PRO_PRICE_ID: z.string().startsWith("price_").optional(),
  STRIPE_PRO_ANNUAL_PRICE_ID: z.string().startsWith("price_").optional(),
});

// Do not parse `Bun.env` at module load: production bindings arrive on `c.env`,
// while local development combines Wrangler bindings with `process.env`.

/**
 * Type-safe environment variables interface.
 * Inferred from the Zod schema to ensure type safety.
 */
export type Env = z.infer<typeof envSchema>;
