# Stripe Billing Integration

## Overview

Stripe billing via `@better-auth/stripe` plugin. Billing is tightly coupled with auth – customer lifecycle, subscription state, and webhook handling are managed by the same system that manages sessions and organizations.

**Non-goals:** Usage-based billing, metered pricing, one-time payments, invoicing, Stripe Elements/embedded checkout, tax calculation, multi-currency. These can be added incrementally.

## Decision Rationale

**Better Auth plugin over raw Stripe SDK:** RSK already uses Better Auth for auth, organizations, and sessions. The plugin handles customer sync, subscription lifecycle, webhook verification, and org-level billing – eliminating significant glue code.

**Hosted Checkout over embedded Elements:** Stripe Checkout is PCI-compliant out of the box, requires no `@stripe/stripe-js` client dependency, and handles payment method selection, 3D Secure, and receipts. The upgrade path to embedded Elements exists but isn't needed initially.

**`createCustomerOnSignUp: true`:** Creates Stripe customer records eagerly on signup. Simplifies the upgrade flow and enables Stripe-side analytics. Trade-off: creates unused records for users who never upgrade.

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

1. User clicks "Upgrade" – Better Auth client calls `auth.subscription.upgrade()`
2. Plugin creates Stripe Checkout session – redirects browser to Stripe
3. User completes payment – Stripe sends webhook to `/api/auth/stripe/webhook`
4. Plugin verifies signature, updates `subscription` table – client refetches via tRPC

**Why tRPC for reads, Better Auth client for mutations:**
Subscription queries benefit from TanStack Query caching, batching, and stale-while-revalidate. Mutations (upgrade, cancel, portal) go through the auth client because the plugin handles Stripe API calls, session validation, and org authorization internally.

## Billing Reference

Billing is tied to `session.activeOrganizationId` when present; otherwise falls back to `user.id` for personal use. The plugin enforces one active subscription per reference ID.

- **Organization context:** `referenceId = activeOrganizationId` – only org owner/admin can manage billing
- **No organization:** `referenceId = user.id` – user manages their own subscription
- The server derives `referenceId` from the session – no client-side param needed
- The billing query key includes `activeOrgId`, so switching organizations automatically fetches fresh billing data via TanStack Query

## Database Schema

The plugin uses `stripeCustomerId` on the `user` and `organization` tables, and a `subscription` table. The plugin manages the subscription table – no manual inserts/updates needed.

Schema must match plugin expectations. After auth config changes, update the schema in `db/schema/` and run `bun db:generate` to create migrations.

## Plan Configuration

Plan limits defined in `apps/api/lib/plans.ts` (single source of truth), referenced by both auth plugin config and tRPC router. Price IDs come from environment variables (`STRIPE_*_PRICE_ID`).

Config-as-code is the simplest correct approach – plans rarely change and this makes them testable and version-controlled.

**Escape hatch:** The plugin accepts `plans: () => StripePlan[]` for dynamic plans. Switch to this only when a real use case requires runtime plan management (e.g., admin dashboard for plan CRUD).

**Limits enforcement:** The `limits` object is returned by the `billing.subscription` tRPC query. Enforce limits in application logic (tRPC middleware, UI guards), not in the plugin itself.

## Environment Variables

| Variable                     | Prefix   |
| ---------------------------- | -------- |
| `STRIPE_SECRET_KEY`          | `sk_`    |
| `STRIPE_WEBHOOK_SECRET`      | `whsec_` |
| `STRIPE_STARTER_PRICE_ID`    | `price_` |
| `STRIPE_PRO_PRICE_ID`        | `price_` |
| `STRIPE_PRO_ANNUAL_PRICE_ID` | `price_` |

Set in `.env.local` (local dev), Cloudflare secrets (staging/prod).

## Webhook Setup

The plugin registers `POST /api/auth/stripe/webhook` automatically. It handles:

- `checkout.session.completed` – activates subscription
- `customer.subscription.created` – records new subscription
- `customer.subscription.updated` – syncs status, cancellation scheduling
- `customer.subscription.deleted` – marks subscription canceled

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
stripe listen --forward-to localhost:5173/api/auth/stripe/webhook
# Copy the whsec_... signing secret to .env.local
```

### Raw Body Requirement

Stripe webhook verification requires the raw request body. The plugin handles this via `request.text()` – no special Hono middleware needed.

## Testing

The plugin tests its own internals (webhooks, checkout, subscription lifecycle, authorization). App tests cover the seams we own:

- **Router** (`apps/api/routers/billing.test.ts`) – free plan fallback, plan limits mapping, unknown plan rejection, response shape
- **Query** (`apps/app/lib/queries/billing.test.ts`) – cache key includes org ID, null normalization, distinct keys per org, prefix for bulk invalidation

Checkout and webhook flows are not retested at app level – verified via `stripe listen` during development.

## File Map

| Layer  | Files                                                                                                  |
| ------ | ------------------------------------------------------------------------------------------------------ |
| Schema | `db/schema/subscription.ts`, `stripeCustomerId` in `db/schema/user.ts` and `db/schema/organization.ts` |
| Server | `apps/api/lib/plans.ts`, `apps/api/lib/stripe.ts`, stripe plugin in `apps/api/lib/auth.ts`             |
| Router | `apps/api/routers/billing.ts`, registered in `apps/api/lib/app.ts`                                     |
| Client | `stripeClient` in `apps/app/lib/auth.ts`, `apps/app/lib/queries/billing.ts`                            |
| UI     | Billing card in `apps/app/routes/(app)/settings.tsx`                                                   |
| Tests  | `apps/api/routers/billing.test.ts`, `apps/app/lib/queries/billing.test.ts`                             |
