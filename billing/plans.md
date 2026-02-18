---
url: /billing/plans.md
---

# Plans & Pricing

Plan limits are defined once in `apps/api/lib/plans.ts` and referenced by the auth plugin config (plan definitions) and the tRPC billing router (query responses).

## Plan Limits

```ts
// apps/api/lib/plans.ts
export const planLimits = {
  free: { members: 1 },
  starter: { members: 5 },
  pro: { members: 50 },
} as const;
```

This is the single source of truth for what each plan includes. Add new limit fields here – they'll automatically flow to both the auth plugin and tRPC responses.

## Auth Plugin Configuration

Plans are registered with the `@better-auth/stripe` plugin in `apps/api/lib/auth.ts`:

```ts
// apps/api/lib/auth.ts (stripe plugin config)
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
  },
});
```

The free tier has no Stripe plan – users without an active subscription are treated as free. The `limits` objects are stored on the Stripe subscription metadata and returned by the plugin.

## Stripe Dashboard Setup

For each paid plan, create a **Product** and **Price** in the [Stripe Dashboard](https://dashboard.stripe.com/products):

1. Create a product (e.g., "Starter Plan")
2. Add a recurring price (e.g., $9/month)
3. Copy the price ID (`price_...`) to the corresponding environment variable

| Plan          | Environment variable         | Product example           |
| ------------- | ---------------------------- | ------------------------- |
| Starter       | `STRIPE_STARTER_PRICE_ID`    | "Starter Plan" – $9/month |
| Pro (monthly) | `STRIPE_PRO_PRICE_ID`        | "Pro Plan" – $29/month    |
| Pro (annual)  | `STRIPE_PRO_ANNUAL_PRICE_ID` | "Pro Plan" – $290/year    |

::: info
Use Stripe **test mode** during development. The price IDs are different between test and live modes.
:::

## How Limits Are Exposed

The `billing.subscription` tRPC procedure returns the current plan and its limits:

```ts
// apps/api/routers/billing.ts
const sub = await ctx.db.query.subscription.findFirst({
  where: (s, { eq, and, inArray }) =>
    and(
      eq(s.referenceId, referenceId),
      inArray(s.status, ["active", "trialing"]),
    ),
});

return {
  plan,
  status: sub?.status ?? null,
  limits: planLimits[plan as PlanName],
  // ...
};
```

When no active subscription exists, it defaults to the `free` plan limits. Enforce limits in your application logic – tRPC middleware for server-side checks, UI guards for client-side gating.

## Adding or Modifying Plans

1. **Update limits** – edit `planLimits` in `apps/api/lib/plans.ts`
2. **Update auth config** – add/edit the plan entry in `apps/api/lib/auth.ts`
3. **Create Stripe product** – add the product and price in the Stripe Dashboard
4. **Set env var** – add the new `STRIPE_*_PRICE_ID` to `.env.local` and Cloudflare secrets
5. **Update UI** – add the plan option to the billing card in `apps/app/routes/(app)/settings.tsx`
