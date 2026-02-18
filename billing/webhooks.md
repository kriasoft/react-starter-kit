---
url: /billing/webhooks.md
---

# Webhooks

The `@better-auth/stripe` plugin registers a webhook endpoint at `POST /api/auth/stripe/webhook` and handles signature verification, event parsing, and database updates automatically.

## Events Handled

| Stripe Event                    | Plugin Action                                       |
| ------------------------------- | --------------------------------------------------- |
| `checkout.session.completed`    | Activates the subscription                          |
| `customer.subscription.created` | Records a new subscription                          |
| `customer.subscription.updated` | Syncs status, period dates, cancellation scheduling |
| `customer.subscription.deleted` | Marks the subscription as canceled                  |

The plugin updates the `subscription` table in the database – no manual event handling code is needed.

## Stripe Dashboard Configuration

Register the webhook endpoint in [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks):

| Field        | Value                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Endpoint URL | `https://<your-domain>/api/auth/stripe/webhook`                                                                                 |
| Events       | `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted` |

Copy the signing secret (`whsec_...`) to `STRIPE_WEBHOOK_SECRET`.

## Local Development

Use the [Stripe CLI](https://docs.stripe.com/stripe-cli) to forward webhook events to your local dev server:

```bash
stripe listen --forward-to localhost:5173/api/auth/stripe/webhook
```

The CLI prints a webhook signing secret (`whsec_...`) – copy it to your `.env.local`:

```ini
STRIPE_WEBHOOK_SECRET=whsec_...
```

::: warning
The local signing secret changes each time you restart `stripe listen`. Update `.env.local` and restart the dev server if webhook verification fails.
:::

## Raw Body Handling

Stripe webhook verification requires the raw (unparsed) request body. The plugin reads the body via `request.text()` before Hono's body parser runs, so no special middleware configuration is needed.

## Production Setup

Store the webhook secret as a Cloudflare Worker secret:

```bash
wrangler secret put STRIPE_WEBHOOK_SECRET
```

After deploying, send a test event from the Stripe Dashboard to verify the endpoint is reachable and the signature validates correctly.
