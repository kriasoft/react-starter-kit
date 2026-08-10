# Monitoring

Monitor your Workers in production using Cloudflare's built-in tools and roll back quickly when issues arise.

## Wrangler Tail

Stream live logs from any worker:

```bash
# Tail production API logs
bun wrangler tail --config apps/api/wrangler.jsonc

# Filter to specific paths
bun wrangler tail --config apps/api/wrangler.jsonc --search-str="/api/trpc"

# Tail staging
bun wrangler tail --config apps/api/wrangler.jsonc --env staging
```

Logs include request metadata, `console.log` output, and uncaught exceptions.

## Cloudflare Analytics

The Cloudflare dashboard provides per-worker metrics:

- **Workers → Analytics** – request count, error rate, CPU time, duration percentiles
- **Workers → Logs** – real-time and historical log streams
- Set up **notification policies** for error rate spikes or latency increases

## Rollback

If a deploy introduces issues, roll back to the previous version:

```bash
# List recent deployments
bun wrangler deployments list --config apps/api/wrangler.jsonc --env=""

# Roll back to the previous stable version
bun wrangler rollback --config apps/api/wrangler.jsonc \
  --env="" \
  --message="Reverting due to auth regression"
```

Repeat for each affected worker (`apps/app/`, `apps/web/`).

::: warning

Wrangler rollback reverts worker code but not database migrations. If a deploy included schema changes that the previous code depends on differently, you may need to deploy a fix-forward migration instead. See [Database: Migrations](/database/migrations).

:::

## Troubleshooting

**Worker size limit** – Cloudflare Workers have a 10 MB compressed size limit (3 MB on the free plan). If you hit it:

- Check for accidentally bundled dependencies
- Move large assets to R2 storage
- Ensure tree shaking is working (check for side-effect imports)

**Database connection issues** – If queries fail or time out:

- Verify Hyperdrive IDs in `wrangler.jsonc` match Terraform output
- Check Neon dashboard for connection limit exhaustion
- Confirm the database isn't in auto-suspended state (first request after suspend is slower)

**Authentication problems** – If sign-in fails in production:

- Verify `BETTER_AUTH_SECRET` is set (`bun wrangler secret list --config apps/api/wrangler.jsonc --env=""`)
- Check `APP_ORIGIN` matches your actual domain (affects cookie domain)
- Confirm OAuth redirect URIs include your production URL. See [Social Providers](/auth/social-providers)

## Cost Monitoring

Pricing and included quotas change. Use the current [Workers](https://developers.cloudflare.com/workers/platform/pricing/), [Hyperdrive](https://developers.cloudflare.com/hyperdrive/platform/pricing/), [Neon](https://neon.tech/pricing), and [Resend](https://resend.com/pricing) pages when budgeting, and monitor usage in each provider dashboard.
