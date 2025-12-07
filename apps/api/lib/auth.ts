import { schema as Db } from "@repo/db";
import { betterAuth } from "better-auth";
import type { DB } from "better-auth/adapters/drizzle";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { passkey } from "@better-auth/passkey";
import { anonymous, organization } from "better-auth/plugins";
import { emailOTP } from "better-auth/plugins/email-otp";
import { sendOTP, sendPasswordReset, sendVerificationEmail } from "./email";
import type { Env } from "./env";

/**
 * Environment variables required for authentication configuration.
 * Extracted from the main Env type for better type safety and documentation.
 */
type AuthEnv = Pick<
  Env,
  | "APP_NAME"
  | "APP_ORIGIN"
  | "BETTER_AUTH_SECRET"
  | "GOOGLE_CLIENT_ID"
  | "GOOGLE_CLIENT_SECRET"
  | "RESEND_API_KEY"
  | "RESEND_EMAIL_FROM"
>;

/**
 * Creates a Better Auth instance configured for multi-tenant SaaS with organization support.
 *
 * Key behaviors:
 * - Uses custom 'identity' table instead of default 'account' model for OAuth accounts
 * - Allows users to create up to 5 organizations with 'owner' role as creator
 * - Delegates ID generation to database (schema defaults to gen_random_uuid)
 * - Supports anonymous authentication alongside email/password and Google OAuth
 *
 * @param db Drizzle database instance - must include all required auth tables (user, session, identity, organization, member, invitation, verification)
 * @param env Environment variables containing auth secrets and OAuth credentials
 * @returns Configured Better Auth instance with email/password and Google OAuth
 * @throws Will fail silently if required database tables are missing from schema
 *
 * @example
 * ```ts
 * const auth = createAuth(database, {
 *   BETTER_AUTH_SECRET: "your-secret",
 *   GOOGLE_CLIENT_ID: "google-id",
 *   GOOGLE_CLIENT_SECRET: "google-secret"
 * });
 * ```
 */
export function createAuth(
  db: DB,
  env: AuthEnv,
): ReturnType<typeof betterAuth> {
  // Extract domain from APP_ORIGIN for passkey rpID
  const appUrl = new URL(env.APP_ORIGIN);
  const rpID = appUrl.hostname;

  return betterAuth({
    baseURL: `${env.APP_ORIGIN}/api/auth`,
    trustedOrigins: [env.APP_ORIGIN],
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, {
      provider: "pg",

      schema: {
        identity: Db.identity,
        invitation: Db.invitation,
        member: Db.member,
        organization: Db.organization,
        passkey: Db.passkey,
        session: Db.session,
        user: Db.user,
        verification: Db.verification,
      },
    }),

    account: {
      modelName: "identity",
    },

    // Email and password authentication
    emailAndPassword: {
      enabled: true,
      sendResetPassword: async ({ user, url }) => {
        await sendPasswordReset(env, { user, url });
      },
    },

    // Email verification
    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        await sendVerificationEmail(env, { user, url });
      },
    },

    // OAuth providers
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },

    plugins: [
      anonymous(),
      organization({
        allowUserToCreateOrganization: true,
        organizationLimit: 5,
        creatorRole: "owner",
      }),
      passkey({
        // rpID: Relying Party ID - domain name in production, 'localhost' for dev
        rpID,
        // rpName: Human-readable name for your app
        rpName: env.APP_NAME,
        // origin: URL where auth occurs (no trailing slash)
        origin: env.APP_ORIGIN,
      }),
      emailOTP({
        async sendVerificationOTP({ email, otp, type }) {
          await sendOTP(env, { email, otp, type });
        },
        otpLength: 6,
        expiresIn: 300, // 5 minutes
        allowedAttempts: 3,
      }),
    ],

    advanced: {
      database: {
        generateId: false,
      },
    },
  });
}

export type Auth = ReturnType<typeof betterAuth>;
