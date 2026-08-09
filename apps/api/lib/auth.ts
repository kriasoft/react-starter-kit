import { passkey } from "@better-auth/passkey";
import { stripe } from "@better-auth/stripe";
import { schema as Db, generateAuthId, type AuthModel } from "@repo/db";
import { betterAuth, type BetterAuthOptions } from "better-auth";
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
export type AuthEnv = Pick<
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
 * Google OAuth — enabled only when both credentials are present. Sign-in works
 * without it via email OTP and passkeys.
 *
 * Setting only one credential signals a broken deployment, so fail instead of
 * silently hiding the Google button.
 */
function googleProvider(env: AuthEnv) {
  const { GOOGLE_CLIENT_ID: clientId, GOOGLE_CLIENT_SECRET: clientSecret } =
    env;

  if (!clientId && !clientSecret) return {};

  if (!clientId || !clientSecret) {
    throw new Error(
      `Google OAuth needs both GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (missing ${
        clientId ? "GOOGLE_CLIENT_SECRET" : "GOOGLE_CLIENT_ID"
      }). Set both to enable it, or neither to disable it.`,
    );
  }

  return { google: { clientId, clientSecret } };
}

/**
 * Social provider names this deployment can actually complete a sign-in with.
 *
 * Read by the SPA so it renders only buttons that work. Derived from the same
 * call that configures Better Auth, so the button and the provider cannot
 * disagree – a separate flag would eventually drift from the credentials.
 */
export function configuredSocialProviders(env: AuthEnv): string[] {
  return Object.keys(googleProvider(env));
}

/**
 * Stripe billing plugin. Set all four required values to turn billing on, or
 * none to leave it off.
 *
 * Partial configuration fails loudly; otherwise missing subscription routes
 * would look like an application bug rather than a missing Stripe value.
 */
function stripePlugin(db: DB, env: AuthEnv) {
  const {
    STRIPE_WEBHOOK_SECRET: webhookSecret,
    STRIPE_STARTER_PRICE_ID: starterPriceId,
    STRIPE_PRO_PRICE_ID: proPriceId,
    STRIPE_SECRET_KEY: secretKey,
  } = env;

  if (!secretKey && !webhookSecret && !starterPriceId && !proPriceId) return [];

  if (!secretKey || !webhookSecret || !starterPriceId || !proPriceId) {
    const missing = (
      [
        ["STRIPE_SECRET_KEY", secretKey],
        ["STRIPE_WEBHOOK_SECRET", webhookSecret],
        ["STRIPE_STARTER_PRICE_ID", starterPriceId],
        ["STRIPE_PRO_PRICE_ID", proPriceId],
      ] as const
    )
      .filter(([, value]) => !value)
      .map(([name]) => name)
      .join(", ");

    throw new Error(
      `Stripe billing needs all four of STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, ` +
        `STRIPE_STARTER_PRICE_ID and STRIPE_PRO_PRICE_ID (missing ${missing}). ` +
        `Set all four to enable billing, or none to disable it. ` +
        `STRIPE_PRO_ANNUAL_PRICE_ID stays optional either way.`,
    );
  }

  return [
    stripe({
      stripeClient: createStripeClient(env),
      stripeWebhookSecret: webhookSecret,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "starter",
            priceId: starterPriceId,
            limits: planLimits.starter,
          },
          {
            name: "pro",
            priceId: proPriceId,
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
  ];
}

/**
 * Creates a Better Auth instance configured for multi-tenant SaaS with organization support.
 *
 * Key behaviors:
 * - Uses custom 'identity' table instead of default 'account' model for OAuth accounts
 * - Allows users to create up to 5 organizations with 'owner' role as creator
 * - Generates prefixed CUID2 IDs at application level (e.g. usr_..., ses_...)
 * - Supports anonymous, email/password, email OTP, passkeys, and optional Google OAuth
 *
 * @param db Drizzle database instance - must include all required auth tables (user, session, identity, organization, member, invitation, verification)
 * @param env Authentication and integration configuration
 * @returns Configured Better Auth instance
 * @remarks Missing database tables will cause runtime errors when auth endpoints are called.
 */
export function createAuth(db: DB, env: AuthEnv): Auth {
  // Extract domain from APP_ORIGIN for passkey rpID
  const appUrl = new URL(env.APP_ORIGIN);
  const rpID = appUrl.hostname;

  // Widen options to prevent declaration emit from inferring `Auth<O>` through
  // non-portable Stripe internals (TS2742). Plugin factories remain typechecked;
  // AuthSession below restores the organization field omitted by widening.
  const options: BetterAuthOptions = {
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
    socialProviders: googleProvider(env),

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
      ...stripePlugin(db, env),
    ],

    advanced: {
      database: {
        generateId: ({ model }) => generateAuthId(model as AuthModel),
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
  };

  return betterAuth(options);
}

export type Auth = ReturnType<typeof betterAuth>;

// Base session types from Better Auth - plugin-specific fields added at runtime
type SessionResponse = Auth["$Infer"]["Session"];
export type AuthUser = SessionResponse["user"];
// Organization plugin adds activeOrganizationId at runtime
export type AuthSession = SessionResponse["session"] & {
  activeOrganizationId?: string;
};
