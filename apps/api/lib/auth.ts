import { passkey } from "@better-auth/passkey";
import { stripe } from "@better-auth/stripe";
import { schema as Db } from "@repo/db";
import { betterAuth } from "better-auth";
import type { DB } from "better-auth/adapters/drizzle";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { anonymous, organization } from "better-auth/plugins";
import { emailOTP } from "better-auth/plugins/email-otp";
import { and, eq } from "drizzle-orm";
import { sendOTP, sendPasswordReset, sendVerificationEmail } from "./email";
import type { Env } from "./env";
import { planLimits } from "./plans";
import { createStripeClient } from "./stripe";

// Auth hint cookie for edge routing (see docs/adr/001-auth-hint-cookie.md)
// NOT a security boundary - false positives are acceptable (causes one redirect)
// __Host- prefix requires Secure; use plain name in HTTP dev
const AUTH_HINT_VALUE = "1";

/**
 * Environment variables required for authentication configuration.
 * Extracted from the main Env type for better type safety and documentation.
 */
type AuthEnv = Pick<
  Env,
  | "ENVIRONMENT"
  | "APP_NAME"
  | "APP_ORIGIN"
  | "BETTER_AUTH_SECRET"
  | "GOOGLE_CLIENT_ID"
  | "GOOGLE_CLIENT_SECRET"
  | "RESEND_API_KEY"
  | "RESEND_EMAIL_FROM"
  | "STRIPE_SECRET_KEY"
  | "STRIPE_WEBHOOK_SECRET"
  | "STRIPE_STARTER_PRICE_ID"
  | "STRIPE_PRO_PRICE_ID"
  | "STRIPE_PRO_ANNUAL_PRICE_ID"
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
 * @remarks Missing database tables will cause runtime errors when auth endpoints are called.
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
        subscription: Db.subscription,
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
      // Stripe billing — only enabled when all required env vars are set.
      // Without Stripe config, the app works but billing endpoints return 404.
      ...(env.STRIPE_SECRET_KEY &&
      env.STRIPE_WEBHOOK_SECRET &&
      env.STRIPE_STARTER_PRICE_ID &&
      env.STRIPE_PRO_PRICE_ID
        ? [
            stripe({
              stripeClient: createStripeClient(env),
              stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
              createCustomerOnSignUp: true,
              subscription: {
                enabled: true,
                plans: [
                  {
                    name: "starter",
                    priceId: env.STRIPE_STARTER_PRICE_ID,
                    limits: planLimits.starter,
                  },
                  {
                    name: "pro",
                    priceId: env.STRIPE_PRO_PRICE_ID,
                    annualDiscountPriceId: env.STRIPE_PRO_ANNUAL_PRICE_ID,
                    limits: planLimits.pro,
                    freeTrial: { days: 14 },
                  },
                ],
                // Personal billing: user can manage their own subscription.
                // Organization billing: only owner/admin can manage.
                authorizeReference: async ({ user, referenceId }) => {
                  if (referenceId === user.id) return true;
                  const [row] = await db
                    .select({ role: Db.member.role })
                    .from(Db.member)
                    .where(
                      and(
                        eq(Db.member.organizationId, referenceId),
                        eq(Db.member.userId, user.id),
                      ),
                    );
                  return row?.role === "owner" || row?.role === "admin";
                },
              },
              organization: { enabled: true },
            }),
          ]
        : []),
    ],

    advanced: {
      database: {
        generateId: false,
      },
    },

    // Set/clear auth hint cookie for edge routing
    hooks: {
      after: createAuthMiddleware(async (ctx) => {
        const isSecure = new URL(env.APP_ORIGIN).protocol === "https:";
        // __Host- prefix requires Secure; browsers reject it over HTTP
        const cookieName = isSecure ? "__Host-auth" : "auth";
        const cookieOpts = {
          path: "/",
          secure: isSecure,
          httpOnly: true,
          sameSite: "lax" as const,
        };

        // Set hint cookie on session creation (sign-in, sign-up, OAuth callback)
        if (ctx.context.newSession) {
          ctx.setCookie(cookieName, AUTH_HINT_VALUE, cookieOpts);
          return;
        }

        // Clear hint cookie on sign-out
        // ctx.path is normalized (base path stripped) by better-call router
        if (ctx.path.startsWith("/sign-out")) {
          ctx.setCookie(cookieName, "", { ...cookieOpts, maxAge: 0 });
          return;
        }

        // Clear stale hint cookie on session check when session is invalid
        // Only run on /get-session where ctx.context.session is reliably populated
        // This handles: expired sessions, revoked sessions, deleted users
        if (ctx.path === "/get-session" && !ctx.context.session) {
          const cookies = ctx.request?.headers.get("cookie") ?? "";
          const hasHintCookie = cookies
            .split(";")
            .some((c) => c.trim().startsWith(`${cookieName}=`));
          if (hasHintCookie) {
            ctx.setCookie(cookieName, "", { ...cookieOpts, maxAge: 0 });
          }
        }
      }),
    },
  });
}

export type Auth = ReturnType<typeof betterAuth>;

// Base session types from Better Auth - plugin-specific fields added at runtime
type SessionResponse = Auth["$Infer"]["Session"];
export type AuthUser = SessionResponse["user"];
// Organization plugin adds activeOrganizationId at runtime
export type AuthSession = SessionResponse["session"] & {
  activeOrganizationId?: string;
};
