---
outline: [2, 3]
---

# Checkout Flow

Upgrades and subscription management use Stripe's hosted pages – Stripe Checkout for new subscriptions and the Customer Portal for changes. No Stripe.js client dependency is needed.

## Upgrade Flow

The auth client handles the redirect to Stripe Checkout:

```ts
// apps/app/routes/(app)/settings.tsx
async function handleUpgrade(plan: "starter" | "pro") {
  await auth.subscription.upgrade({
    plan,
    successUrl: returnUrl,
    cancelUrl: returnUrl,
  });
}
```

`auth.subscription.upgrade()` calls the Better Auth endpoint, which creates a Stripe Checkout session and redirects the browser. After payment, Stripe redirects back to `successUrl`. The subscription is activated asynchronously via [webhook](./webhooks).

For the Pro plan, if `STRIPE_PRO_ANNUAL_PRICE_ID` is configured, Stripe Checkout shows both monthly and annual options automatically.

## Customer Portal

Existing subscribers manage their subscription (cancel, change payment method, switch plans) through Stripe's hosted portal:

```ts
// apps/app/routes/(app)/settings.tsx
async function handleManageBilling() {
  await auth.subscription.billingPortal({ returnUrl });
}
```

Configure the portal appearance and allowed actions in the [Stripe Dashboard → Customer Portal settings](https://dashboard.stripe.com/settings/billing/portal).

## Authorization

The plugin's `authorizeReference` callback controls who can manage billing:

| Context                  | Who can upgrade/manage |
| ------------------------ | ---------------------- |
| Personal (no active org) | The user themselves    |
| Organization             | Org owner or admin     |

```ts
// apps/api/lib/auth.ts
authorizeReference: async ({ user, referenceId }) => {
  // Personal billing
  if (referenceId === user.id) return true;
  // Org billing: check membership role
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
```

Regular org members see the billing status but cannot modify the subscription.

## Billing UI

The `BillingCard` component in `apps/app/routes/(app)/settings.tsx` handles all billing states:

| State           | UI                                                             |
| --------------- | -------------------------------------------------------------- |
| Loading         | Muted loading text                                             |
| Free plan       | "You are on the Free plan" + upgrade buttons                   |
| Active/trialing | Plan name, status badge, renewal date, "Manage Billing" button |
| Canceling       | Amber warning with access end date, portal link to restore     |

## Data Fetching

Billing state is fetched via a tRPC query wrapped in TanStack Query:

```ts
// apps/app/lib/queries/billing.ts
export function billingQueryOptions(activeOrgId?: string | null) {
  return queryOptions({
    queryKey: [...billingQueryKey, activeOrgId ?? null],
    queryFn: () => trpcClient.billing.subscription.query(),
  });
}
```

The query key includes `activeOrgId` so switching organizations automatically triggers a refetch. Use the `billingQueryKey` prefix for bulk invalidation after subscription changes.
