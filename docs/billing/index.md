---
outline: [2, 3]
---

# Billing

Stripe subscriptions are integrated via the [`@better-auth/stripe`](https://www.better-auth.com/docs/plugins/stripe) plugin. The auth system manages the full subscription lifecycle – customer creation, checkout, webhooks, and status tracking – so billing state lives alongside sessions and organizations in the same database.

Billing is **optional** – without the `STRIPE_*` environment variables the app works normally, plugin mutation endpoints return 404, the subscription query reports the free plan with `enabled: false`, and the settings page hides billing controls. Configure all four required variables or none: a partial configuration throws when authentication initializes rather than silently disabling billing.

## What's Included

| Feature | Implementation |
| --- | --- |
| Three-tier plans (Free / Starter / Pro) | Config in `apps/api/lib/plans.ts` |
| Stripe hosted checkout | `auth.subscription.upgrade()` client method |
| Customer portal (cancel, change card) | `auth.subscription.billingPortal()` |
| Org-level and personal billing | Explicit, authorized `referenceId` |
| Webhook-driven status sync | Plugin-managed endpoint |
| 14-day free trial on Pro | `freeTrial: { days: 14 }` in plan config |
| Annual discount pricing | `annualDiscountPriceId` on Pro plan |

## Architecture

```text
┌─────────────┐     POST /api/auth/subscription/upgrade      ┌───────────────┐
│   Browser   │ ──────────────────────────────────────────→  │  API Worker   │
│    (app)    │                                              │    (Hono)     │
│             │  ←── 302 redirect                            │               │
│             │──→ Stripe Checkout (hosted)                  │  Better Auth  │
│             │                                              │  + stripe()   │
│             │    POST /api/auth/stripe/webhook             │  plugin       │
│             │                              Stripe ────────→│  webhook ──→  │
│             │                                              │  update DB    │
│             │    GET  /api/trpc/billing.subscription       │               │
│             │ ──────────────────────────────────────────→  │  tRPC router  │
└─────────────┘  ←── subscription data (TanStack Query)      └───────────────┘
```

1. User clicks **Upgrade** – auth client calls `auth.subscription.upgrade()`
2. Plugin creates a Stripe Checkout session – redirects browser to Stripe
3. User completes payment – Stripe sends webhook to `/api/auth/stripe/webhook`
4. Plugin verifies signature, updates `subscription` table
5. Client refetches billing state via tRPC + TanStack Query

Mutations (upgrade, portal) go through the auth client because the plugin handles Stripe API calls, session validation, and org authorization internally. Reads go through tRPC to benefit from TanStack Query caching and org-aware cache keys.

## Billing Reference

The settings page reads `session.activeOrganizationId`. With an active organization it passes that ID and `customerType: "organization"` to Stripe mutations; otherwise the plugin defaults to the current user. The tRPC read derives the same reference from the session. One active subscription is allowed per reference ID.

| Context             | `referenceId`          | Who can manage |
| ------------------- | ---------------------- | -------------- |
| Organization active | `activeOrganizationId` | Owner or admin |
| No organization     | `user.id`              | The user       |

The plugin's `authorizeReference` callback verifies every explicit organization reference against current owner/admin membership. The billing query key includes `activeOrgId`, so switching organizations refetches automatically.

## Plans

Three tiers with enforced member limits:

| Plan    | Members | Trial   | Price ID env var          |
| ------- | ------- | ------- | ------------------------- |
| Free    | 1       | –       | –                         |
| Starter | 5       | –       | `STRIPE_STARTER_PRICE_ID` |
| Pro     | 50      | 14 days | `STRIPE_PRO_PRICE_ID`     |

See [Plans & Pricing](./plans) for configuration details.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | For billing | Stripe secret key (`sk_test_...` / `sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | For billing | Webhook signing secret (`whsec_...`) |
| `STRIPE_STARTER_PRICE_ID` | For billing | Stripe price ID for Starter plan (`price_...`) |
| `STRIPE_PRO_PRICE_ID` | For billing | Stripe price ID for Pro plan (`price_...`) |
| `STRIPE_PRO_ANNUAL_PRICE_ID` | Optional | Annual discount price for Pro plan (`price_...`) |

Set in `.env.local` for development, Cloudflare secrets for staging/production. See [Environment Variables](/getting-started/environment-variables).

## File Map

| Layer | Files |
| --- | --- |
| Schema | `db/schema/subscription.ts`, `stripeCustomerId` on user + organization tables |
| Server | `apps/api/lib/plans.ts`, `apps/api/lib/stripe.ts`, stripe plugin in `apps/api/lib/auth.ts` |
| Router | `apps/api/routers/billing.ts` |
| Client | `stripeClient` in `apps/app/lib/auth.ts`, `apps/app/lib/queries/billing.ts` |
| UI | Billing card in `apps/app/routes/(app)/settings.tsx` |
