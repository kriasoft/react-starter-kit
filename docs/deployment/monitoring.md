# Monitoring

Monitor your Workers in production using Cloudflare's built-in tools and roll back quickly when issues arise.

## Wrangler Tail

Stream live logs from any worker:

```bash
# Tail production API logs
wrangler tail --config apps/api/wrangler.jsonc

# Filter to specific paths
wrangler tail --config apps/api/wrangler.jsonc --search-str="/api/trpc"

# Tail staging
wrangler tail --config apps/api/wrangler.jsonc --env=staging
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
wrangler deployments list --config apps/api/wrangler.jsonc

# Roll back to the previous stable version
wrangler rollback --config apps/api/wrangler.jsonc \
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

- Verify `BETTER_AUTH_SECRET` is set (`wrangler secret list --config apps/api/wrangler.jsonc`)
- Check `APP_ORIGIN` matches your actual domain (affects cookie domain)
- Confirm OAuth redirect URIs include your production URL. See [Social Providers](/auth/social-providers)

## Cost Overview

| Service            | Free tier                            | Paid                                                                                     |
| ------------------ | ------------------------------------ | ---------------------------------------------------------------------------------------- |
| Cloudflare Workers | 100,000 requests/day                 | [$5/month for 10M requests](https://developers.cloudflare.com/workers/platform/pricing/) |
| Neon PostgreSQL    | 0.5 GB storage, auto-suspend compute | [Scale-to-zero billing](https://neon.tech/pricing)                                       |
| Hyperdrive         | Included with Workers paid plan      | –                                                                                        |
| Resend             | 100 emails/day                       | [$20/month for 50K emails](https://resend.com/pricing)                                   |

A typical growth-stage project runs around **~$45/month** (Workers $5 + Neon $19 + Resend $20). Free tiers are sufficient through early production – monitor usage in the Cloudflare and Neon dashboards as traffic grows.
