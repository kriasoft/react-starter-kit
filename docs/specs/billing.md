# Stripe Billing Integration

## Overview

Integrate Stripe billing using the `@better-auth/stripe` plugin. This keeps billing tightly coupled with auth — customer lifecycle, subscription state, and webhook handling are managed by the same system that manages sessions and organizations.

**Non-goals:** Usage-based billing, metered pricing, one-time payments, invoicing, Stripe Elements/embedded checkout, tax calculation, multi-currency. These can be added incrementally.

## Decision Rationale

**Better Auth plugin over raw Stripe SDK:** RSK already uses Better Auth for auth, organizations, and sessions. The `@better-auth/stripe` plugin handles customer sync, subscription lifecycle, webhook verification, and org-level billing — eliminating significant glue code.

**Hosted Checkout over embedded Elements:** Stripe Checkout is PCI-compliant out of the box, requires no `@stripe/stripe-js` client dependency, and handles payment method selection, 3D Secure, and receipts. The upgrade path to embedded Elements exists but isn't needed initially.

## Architecture

```text
┌─────────────┐     POST /api/auth/subscription/upgrade      ┌───────────────┐
│   Browser   │ ──────────────────────────────────────────→  │  API Worker   │
│    (app)    │                                              │    (Hono)     │
│             │  ←── 302 redirect                            │               │
│             │──→ Stripe Checkout (hosted)                  │  Better Auth  │
│             │                                              │  + stripe()   │
│             │    POST /api/auth/stripe/webhook             │  plugin       │
│             │                                              │               │
│             │                              Stripe ────────→│  webhook ──→  │
│             │                                              │  update DB    │
│             │    GET  /api/trpc/billing.subscription       │               │
│             │ ──────────────────────────────────────────→  │  tRPC router  │
└─────────────┘  ←── subscription data (TanStack Query)      └───────────────┘
```

**Data flow:**

1. User clicks "Upgrade" → Better Auth client calls `auth.subscription.upgrade()`
2. Plugin creates Stripe Checkout session → redirects browser (302) to Stripe
3. User completes payment on Stripe → Stripe sends webhook to `/api/auth/stripe/webhook`
4. Plugin verifies signature, updates `subscription` table → client refetches via tRPC

**Why tRPC for reads, Better Auth client for mutations:**
Subscription queries benefit from TanStack Query caching, batching, and stale-while-revalidate. Mutations (upgrade, cancel, portal) go through the auth client because the plugin handles Stripe API calls, session validation, and org authorization internally.

## Billing Reference

Billing is tied to `session.activeOrganizationId` when present; otherwise falls back to `user.id` for personal use. The plugin enforces one active subscription per reference ID.

- **Organization context:** `referenceId = activeOrganizationId` — only org owner/admin can manage billing
- **No organization:** `referenceId = user.id` — user manages their own subscription
- UI must clearly indicate whether the user is upgrading personal or org billing

## Database Schema

The plugin adds `stripeCustomerId` to `user` and `organization` tables, and creates a `subscription` table.

**Schema must match plugin expectations exactly.** After adding the stripe plugin to auth config, run `bun db:generate-auth-schema` to verify field names, types, and nullability against what the plugin produces. The existing `db/scripts/generate-auth-schema.ts` tooling handles this.

### `user` table — add column

```ts
// db/schema/user.ts
export const user = pgTable("user", {
  // ... existing columns
  stripeCustomerId: text(),
});
```

### `organization` table — add column

```ts
// db/schema/organization.ts
export const organization = pgTable("organization", {
  // ... existing columns
  stripeCustomerId: text(),
});
```

### `subscription` table — new

```ts
// db/schema/subscription.ts
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const subscription = pgTable(
  "subscription",
  {
    id: text()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    plan: text().notNull(),
    referenceId: text().notNull(), // userId or organizationId
    stripeCustomerId: text(),
    stripeSubscriptionId: text().unique(),
    status: text().default("incomplete").notNull(),
    periodStart: timestamp({ withTimezone: true, mode: "date" }),
    periodEnd: timestamp({ withTimezone: true, mode: "date" }),
    trialStart: timestamp({ withTimezone: true, mode: "date" }),
    trialEnd: timestamp({ withTimezone: true, mode: "date" }),
    cancelAtPeriodEnd: boolean().default(false),
    cancelAt: timestamp({ withTimezone: true, mode: "date" }),
    canceledAt: timestamp({ withTimezone: true, mode: "date" }),
    endedAt: timestamp({ withTimezone: true, mode: "date" }),
    seats: integer(),
    billingInterval: text(), // "day" | "week" | "month" | "year"
    groupId: text(),
    createdAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("subscription_reference_id_idx").on(table.referenceId),
    index("subscription_stripe_customer_id_idx").on(table.stripeCustomerId),
  ],
);
```

The plugin manages this table — no manual inserts/updates needed. Drizzle migration: `bun db:generate && bun db:migrate`.

## Server-Side Implementation

### Plan Limits

Single source of truth for plan limits, imported by both auth plugin config and tRPC router.

```ts
// apps/api/lib/plans.ts

export const planLimits = {
  free: { members: 1 },
  starter: { members: 5 },
  pro: { members: 50 },
} as const;

export type PlanName = keyof typeof planLimits;
```

### Stripe Client Factory

```ts
// apps/api/lib/stripe.ts
import Stripe from "stripe";
import type { Env } from "./env";

export function createStripeClient(env: Env) {
  return new Stripe(env.STRIPE_SECRET_KEY, {
    appInfo: { name: "React Starter Kit" },
  });
}
```

### Better Auth Plugin Config

```ts
// apps/api/lib/auth.ts
import { stripe } from "@better-auth/stripe";
import { and, eq } from "drizzle-orm";
import { schema as Db } from "@repo/db";
import { createStripeClient } from "./stripe";
import { planLimits } from "./plans";

export function createAuth(db: DB, env: AuthEnv) {
  const stripeClient = createStripeClient(env);

  return betterAuth({
    // ... existing config
    plugins: [
      // ... existing plugins
      stripe({
        stripeClient,
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
          // Personal billing allowed for self.
          // Organization billing requires owner/admin role.
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
    ],
  });
}
```

### tRPC Billing Router

Read-only query for subscription data. Mutations go through the Better Auth client directly.

```ts
// apps/api/routers/billing.ts
import { protectedProcedure, router } from "../lib/trpc";
import { planLimits, type PlanName } from "../lib/plans";

export const billingRouter = router({
  // Active subscription + limits for the current billing reference
  subscription: protectedProcedure.query(async ({ ctx }) => {
    const referenceId = ctx.session.activeOrganizationId ?? ctx.user.id;

    const sub = await ctx.db.query.subscription.findFirst({
      where: (s, { eq, and, inArray }) =>
        and(
          eq(s.referenceId, referenceId),
          inArray(s.status, ["active", "trialing"]),
        ),
    });

    const plan = sub?.plan ?? "free";

    return {
      plan,
      status: sub?.status ?? null,
      periodEnd: sub?.periodEnd ?? null,
      cancelAtPeriodEnd: sub?.cancelAtPeriodEnd ?? false,
      limits:
        plan in planLimits ? planLimits[plan as PlanName] : planLimits.free,
    };
  }),
});
```

Register in the app router:

```ts
// apps/api/lib/app.ts
import { billingRouter } from "../routers/billing";

const appRouter = router({
  user: userRouter,
  organization: organizationRouter,
  billing: billingRouter,
});
```

## Client-Side Implementation

### Auth Client Plugin

```ts
// apps/app/lib/auth.ts
import { stripeClient } from "@better-auth/stripe/client";

export const auth = createAuthClient({
  baseURL: baseURL + authConfig.api.basePath,
  plugins: [
    // ... existing plugins
    stripeClient({ subscription: true }),
  ],
});
```

### Billing Query

```ts
// apps/app/lib/queries/billing.ts
import { queryOptions } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const billingQueries = {
  subscription: (referenceId: string) =>
    queryOptions({
      queryKey: ["billing", "subscription", referenceId],
      queryFn: () => trpc.billing.subscription.query(),
    }),
};
```

### Billing Page

```tsx
// apps/app/routes/_app/settings/billing.tsx
import { useSuspenseQuery } from "@tanstack/react-query";
import { auth } from "~/lib/auth";
import { billingQueries } from "~/lib/queries/billing";

function BillingPage() {
  const session = Route.useRouteContext({ select: (s) => s.session });
  const referenceId = session.activeOrganizationId ?? session.user.id;
  const { data: billing } = useSuspenseQuery(
    billingQueries.subscription(referenceId),
  );

  // Plugin handles redirect internally — browser navigates to Stripe Checkout
  async function handleUpgrade(plan: string) {
    await auth.subscription.upgrade({
      plan,
      successUrl: window.location.href,
      cancelUrl: window.location.href,
    });
  }

  async function handleManage() {
    await auth.subscription.createBillingPortal({
      returnUrl: window.location.href,
    });
  }

  return (
    <div>
      {billing.status ? (
        <div>
          <p>Current plan: {billing.plan}</p>
          <p>Status: {billing.status}</p>
          <Button onClick={handleManage}>Manage Billing</Button>
        </div>
      ) : (
        <div>
          <Button onClick={() => handleUpgrade("starter")}>
            Upgrade to Starter
          </Button>
          <Button onClick={() => handleUpgrade("pro")}>Upgrade to Pro</Button>
        </div>
      )}
    </div>
  );
}
```

## Environment Variables

Add to `apps/api/lib/env.ts`:

```ts
export const envSchema = z.object({
  // ... existing vars
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
  STRIPE_STARTER_PRICE_ID: z.string().startsWith("price_"),
  STRIPE_PRO_PRICE_ID: z.string().startsWith("price_"),
  STRIPE_PRO_ANNUAL_PRICE_ID: z.string().startsWith("price_"),
});
```

Add to `.dev.vars` (local), Cloudflare dashboard (staging/prod), and Terraform secrets.

## Webhook Setup

The plugin registers `POST /api/auth/stripe/webhook` automatically. It handles:

- `checkout.session.completed` — activates subscription
- `customer.subscription.created` — records new subscription
- `customer.subscription.updated` — syncs status, cancellation scheduling
- `customer.subscription.deleted` — marks subscription canceled

### Stripe Dashboard Configuration

```
Endpoint URL: https://<domain>/api/auth/stripe/webhook
Events:
  - checkout.session.completed
  - customer.subscription.created
  - customer.subscription.updated
  - customer.subscription.deleted
```

### Local Development

```bash
# Forward to the dev server (web worker proxies /api/* to API worker)
stripe listen --forward-to localhost:5173/api/auth/stripe/webhook
# Copy the whsec_... signing secret to .dev.vars
```

### Raw Body Requirement

Stripe webhook verification requires the raw request body. The Better Auth plugin handles this internally via `request.text()` — no special Hono middleware needed. The API worker already has `nodejs_compat` enabled.

## Plan Configuration

Plan limits defined in `apps/api/lib/plans.ts` (single source of truth), referenced by both auth plugin config and tRPC router. Price IDs come from environment variables.

This is the simplest correct solution — plans rarely change and config-as-code makes them testable and version-controlled.

**Escape hatch:** The plugin accepts `plans: () => StripePlan[]` for dynamic plans fetched from a database or Stripe API. Switch to this only when a real use case requires runtime plan management (e.g., admin dashboard for plan CRUD).

**Limits enforcement:** The `limits` object is stored on the plan config and returned by the tRPC `billing.subscription` query. Enforce limits in application logic (tRPC middleware, UI guards), not in the plugin itself.

## Implementation Sequence

| Phase         | What                                                            | Files                                                                                               |
| ------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **1. Schema** | Add `stripeCustomerId` columns, `subscription` table            | `db/schema/user.ts`, `db/schema/organization.ts`, `db/schema/subscription.ts`, `db/schema/index.ts` |
| **2. Server** | Plan limits module, Stripe client, auth plugin config, env vars | `apps/api/lib/plans.ts`, `apps/api/lib/stripe.ts`, `apps/api/lib/auth.ts`, `apps/api/lib/env.ts`    |
| **3. Router** | tRPC billing router for subscription reads                      | `apps/api/routers/billing.ts`, `apps/api/lib/app.ts`                                                |
| **4. Client** | Auth client plugin, TanStack Query wrapper                      | `apps/app/lib/auth.ts`, `apps/app/lib/queries/billing.ts`                                           |
| **5. UI**     | Billing settings page, upgrade/manage flows                     | `apps/app/routes/_app/settings/billing.tsx`                                                         |
| **6. Infra**  | Webhook endpoint in Stripe dashboard, env vars in CF            | Stripe Dashboard, `.dev.vars`, Terraform                                                            |

## Dependencies

```bash
# API worker
bun add stripe @better-auth/stripe

# No new client dependencies — hosted checkout needs no @stripe/stripe-js
```

## Open Questions

- [ ] Should free-tier users get a Stripe customer record on signup (`createCustomerOnSignUp: true`) or only on first upgrade? Creating early simplifies the upgrade flow but creates unused Stripe records.
- [ ] Per-seat billing for organizations — the plugin supports `seatPriceId` with automatic member sync. Include in v1 or defer?
- [ ] Plan limits enforcement pattern — tRPC middleware (centralized) vs. per-procedure checks (explicit)?
- [ ] Subscription status badge in the app header/sidebar for visibility?
