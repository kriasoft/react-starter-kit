---
url: /auth.md
---

# Authentication Overview

Authentication is handled by [Better Auth](https://www.better-auth.com/) – a TypeScript-native auth framework that runs entirely in the API worker. The project ships with multiple sign-in methods, organization-based multi-tenancy, and Stripe billing integration out of the box.

## What's Included

| Method                             | Description                               |
| ---------------------------------- | ----------------------------------------- |
| [Email & OTP](./email-otp)         | Passwordless 6-digit code via email       |
| [Google OAuth](./social-providers) | Social login with redirect flow           |
| [Passkeys](./passkeys)             | WebAuthn biometric / security key         |
| Anonymous                          | Guest sessions that can be upgraded later |

All methods produce the same session format. Users can link multiple methods to one account.

## Plugins

Better Auth's functionality is extended through plugins. The server and client must enable matching plugins:

| Plugin         | Server           | Client                 | Purpose                     |
| -------------- | ---------------- | ---------------------- | --------------------------- |
| `emailOTP`     | `emailOTP()`     | `emailOTPClient()`     | Passwordless OTP sign-in    |
| `organization` | `organization()` | `organizationClient()` | Multi-tenant orgs and roles |
| `passkey`      | `passkey()`      | `passkeyClient()`      | WebAuthn authentication     |
| `anonymous`    | `anonymous()`    | `anonymousClient()`    | Guest sessions              |
| `stripe`       | `stripe()`       | `stripeClient()`       | Subscription billing        |

The Stripe plugin is conditionally loaded – it only activates when `STRIPE_SECRET_KEY` and related env vars are set. Without them, the app works normally but billing endpoints return 404.

## Server Configuration

The auth instance is created per-request in `apps/api/lib/auth.ts`:

```ts
// apps/api/lib/auth.ts
export function createAuth(db: DB, env: AuthEnv) {
  return betterAuth({
    baseURL: `${env.APP_ORIGIN}/api/auth`,
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, { provider: "pg", schema: { ... } }),

    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },

    plugins: [
      anonymous(),
      organization({ organizationLimit: 5, creatorRole: "owner" }),
      passkey({ rpID, rpName: env.APP_NAME, origin: env.APP_ORIGIN }),
      emailOTP({ otpLength: 6, expiresIn: 300, allowedAttempts: 3 }),
      ...stripePlugin(db, env),
    ],
  });
}
```

The `account` model is renamed to `identity` to better describe its purpose (OAuth provider credentials):

```ts
account: { modelName: "identity" },
```

### ID Generation

All auth tables use prefixed CUID2 IDs generated at the application level:

```ts
advanced: {
  database: {
    generateId: ({ model }) => generateAuthId(model),
  },
},
```

This produces IDs like `usr_cm...`, `ses_cm...`, `org_cm...` – making it easy to identify what kind of record an ID refers to.

## Client Configuration

The auth client lives in `apps/app/lib/auth.ts`:

```ts
// apps/app/lib/auth.ts
import { createAuthClient } from "better-auth/react";

export const auth = createAuthClient({
  baseURL: baseURL + "/api/auth",
  plugins: [
    anonymousClient(),
    emailOTPClient(),
    organizationClient(),
    passkeyClient(),
    stripeClient({ subscription: true }),
  ],
});
```

::: warning
Do not use `auth.useSession()` directly. Session state is managed exclusively through TanStack Query – see [Sessions & Protected Routes](./sessions).
:::

## Auth Routes

Better Auth exposes HTTP endpoints at `/api/auth/*`. These are mounted in the Hono app alongside tRPC:

```
/api/auth/sign-in/*        Sign-in endpoints (email, social, passkey)
/api/auth/sign-up/*        Sign-up endpoints
/api/auth/sign-out         Session termination
/api/auth/get-session      Current session data
/api/auth/callback/*       OAuth callbacks
/api/auth/email-otp/*      OTP send and verify
/api/auth/passkey/*        WebAuthn registration and authentication
/api/auth/organization/*   Organization CRUD and membership
```

See the [Better Auth API reference](https://www.better-auth.com/docs/api-reference) for the full endpoint list.

## Database Tables

Authentication uses 9 database tables defined in `db/schema/`:

| Table          | File              | Description                                                |
| -------------- | ----------------- | ---------------------------------------------------------- |
| `user`         | `user.ts`         | User accounts with profile info                            |
| `session`      | `user.ts`         | Active sessions with `activeOrganizationId`                |
| `identity`     | `user.ts`         | OAuth provider credentials (Better Auth's `account` model) |
| `verification` | `user.ts`         | Email verification and OTP tokens                          |
| `organization` | `organization.ts` | Tenant organizations                                       |
| `member`       | `organization.ts` | Organization memberships with roles                        |
| `invitation`   | `invitation.ts`   | Pending org invitations                                    |
| `passkey`      | `passkey.ts`      | WebAuthn credential store                                  |
| `subscription` | `subscription.ts` | Stripe subscription state                                  |

## Auth Hint Cookie

The API worker sets a lightweight cookie (`__Host-auth` in HTTPS, `auth` in HTTP dev) on sign-in and clears it on sign-out. The web edge worker reads this cookie to route `/` – authenticated users get the app, anonymous users get the marketing page. This cookie is a routing hint only, not a security boundary. See [ADR-001](/adr/001-auth-hint-cookie) for the full rationale.

## Environment Variables

| Variable               | Required | Description                                       |
| ---------------------- | -------- | ------------------------------------------------- |
| `BETTER_AUTH_SECRET`   | Yes      | Secret for signing sessions and tokens            |
| `GOOGLE_CLIENT_ID`     | Yes      | Google OAuth client ID                            |
| `GOOGLE_CLIENT_SECRET` | Yes      | Google OAuth client secret                        |
| `RESEND_API_KEY`       | Yes      | API key for sending OTP emails                    |
| `RESEND_EMAIL_FROM`    | Yes      | Sender address for auth emails                    |
| `APP_NAME`             | Yes      | Display name (used in emails and passkey prompts) |
| `APP_ORIGIN`           | Yes      | Full origin URL (e.g., `https://example.com`)     |
