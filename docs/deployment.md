# Deployment

This guide covers deploying your application to Cloudflare Workers with Neon PostgreSQL for production.

## Prerequisites

Before deploying, ensure you have:

- **Cloudflare Account** with Workers enabled
- **Neon Account** for PostgreSQL hosting
- **GitHub Account** for CI/CD (optional but recommended)
- **Domain Name** configured in Cloudflare (optional)

## Overview

The deployment architecture consists of:

- **Applications**: Cloudflare Workers serving separate app, web, and API deployments
- **Database**: Neon PostgreSQL with Hyperdrive connection pooling
- **Static Assets**: Served directly from Workers with caching
- **Environments**: Development, Preview, Staging, and Production

## Database Setup

### 1. Create Neon Database

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project for your application
3. Note your connection string (looks like `postgresql://user:pass@host/dbname`)

### 2. Install PostgreSQL Extensions

Connect to your Neon database and run:

```sql
CREATE EXTENSION IF NOT EXISTS "pg_uuidv7";
```

This extension is required for UUIDv7 primary key generation used throughout the schema.

### 3. Configure Hyperdrive

Hyperdrive provides connection pooling and caching at the edge:

```bash
# Create Hyperdrive configuration for production
wrangler hyperdrive create my-app-prod \
  --connection-string="postgresql://user:pass@host/dbname"

# Create separate configuration for staging
wrangler hyperdrive create my-app-staging \
  --connection-string="postgresql://user:pass@host/dbname-staging"
```

Note the Hyperdrive IDs returned - you'll need these for configuration.

### 4. Run Database Migrations

```bash
# Set your database URL
export DATABASE_URL="postgresql://user:pass@host/dbname"

# Generate and apply migrations
bun --filter @repo/db generate
bun --filter @repo/db migrate
```

## Cloudflare Workers Setup

### 1. Configure Wrangler

Update the wrangler configuration files for each app:

For `apps/api/wrangler.jsonc`:

```jsonc
{
  "name": "your-app-api",
  "routes": [
    { "pattern": "yourdomain.com/api*", "zone_name": "yourdomain.com" },
  ],
  "hyperdrive": [
    {
      "binding": "HYPERDRIVE_CACHED",
      "id": "your-hyperdrive-cached-id",
    },
    {
      "binding": "HYPERDRIVE_DIRECT",
      "id": "your-hyperdrive-direct-id",
    },
  ],
}
```

### 2. Set Environment Secrets

```bash
# Login to Cloudflare
wrangler login

# Set production secrets
wrangler secret put BETTER_AUTH_SECRET --env production
wrangler secret put GOOGLE_CLIENT_ID --env production
wrangler secret put GOOGLE_CLIENT_SECRET --env production
wrangler secret put RESEND_API_KEY --env production
wrangler secret put RESEND_EMAIL_FROM --env production
```

Generate `BETTER_AUTH_SECRET` with:

```bash
openssl rand -hex 32
```

Set `RESEND_EMAIL_FROM` to your sender email address:

```bash
"Your App <noreply@yourdomain.com>"
```

### 3. Build and Deploy

```bash
# Build packages in the correct order
bun email:build   # Build email templates first
bun web:build     # Build marketing site
bun app:build     # Build React app

# Deploy apps to production
bun api:deploy    # Deploy API server
bun app:deploy    # Deploy React app
bun web:deploy    # Deploy marketing site

# Or deploy to staging first
bun wrangler deploy --config apps/api/wrangler.jsonc --env=staging
bun wrangler deploy --config apps/app/wrangler.jsonc --env=staging
bun wrangler deploy --config apps/web/wrangler.jsonc --env=staging
```

## OAuth Provider Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://yourdomain.com/api/auth/callback/google`
   - `https://staging.yourdomain.com/api/auth/callback/google`

### GitHub OAuth

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL:
   - `https://yourdomain.com/api/auth/callback/github`

## Custom Domain Configuration

### 1. Add Domain to Cloudflare

1. Add your domain to Cloudflare DNS
2. Update nameservers with your registrar
3. Wait for DNS propagation

### 2. Configure Workers Routes

Routes are already configured in `wrangler.jsonc`. The deployment will automatically set them up.

### 3. SSL/TLS Settings

In Cloudflare Dashboard:

1. Go to SSL/TLS > Overview
2. Set encryption mode to "Full (strict)"
3. Enable "Always Use HTTPS"

## CI/CD with GitHub Actions

### Basic Deployment Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Build Email Templates
        run: bun email:build

      - name: Build Applications
        run: |
          bun web:build
          bun app:build

      - name: Deploy API to Cloudflare
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: deploy --config apps/api/wrangler.jsonc --env=production

      - name: Deploy App to Cloudflare
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: deploy --config apps/app/wrangler.jsonc --env=production

      - name: Deploy Web to Cloudflare
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: deploy --config apps/web/wrangler.jsonc --env=production
```

### Preview Deployments

For pull request previews:

```yaml
name: Preview

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Build Email Templates
        run: bun email:build

      - name: Build Applications
        run: |
          bun web:build
          bun app:build

      - name: Deploy API Preview
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: deploy --config apps/api/wrangler.jsonc --env=preview

      - name: Deploy App Preview
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: deploy --config apps/app/wrangler.jsonc --env=preview

      - name: Deploy Web Preview
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: deploy --config apps/web/wrangler.jsonc --env=preview

      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '🚀 Preview deployed to https://preview.yourdomain.com'
            })
```

## Environment Management

### Development

- Local development with `bun dev`
- Uses local environment variables from `.env.local`
- Connects to development database

### Preview

- Deployed on pull requests
- Isolated environment for testing
- Separate database and secrets

### Staging

- Pre-production environment
- Production-like configuration
- Final testing before production

### Production

- Live environment
- Full monitoring and logging
- Regular backups

## Monitoring and Logging

### Cloudflare Analytics

Monitor your application in the Cloudflare Dashboard:

- Workers > Analytics
- View requests, errors, and performance metrics
- Set up alerts for anomalies

### Wrangler Tail

Stream live logs from your Workers:

```bash
# Tail production logs
wrangler tail --env=production

# Filter specific paths
wrangler tail --env=production --search-str="/api/"
```

### Error Tracking

Consider integrating error tracking services:

- Sentry for error monitoring
- Datadog for APM
- LogDNA for log aggregation

## Performance Optimization

### Edge Caching

Configure cache headers in your API responses:

```typescript
return new Response(data, {
  headers: {
    "Cache-Control": "public, max-age=3600",
    "CDN-Cache-Control": "max-age=7200",
  },
});
```

### Static Asset Optimization

1. Enable Cloudflare Auto Minify
2. Use Cloudflare Polish for images
3. Configure Page Rules for static assets

### Database Performance

1. Use Hyperdrive for connection pooling
2. Implement query result caching
3. Add appropriate database indexes
4. Monitor slow queries in Neon dashboard

## Rollback Strategy

### Quick Rollback

```bash
# List recent deployments
wrangler deployments list --env=production

# Rollback to specific version
wrangler rollback --env=production --message="Reverting to stable version"
```

### Database Rollback

Keep migration rollback scripts:

```bash
# Rollback last migration
bun --filter @repo/db rollback
```

## Security Checklist

Before going to production:

- [ ] All secrets are set via `wrangler secret`
- [ ] Authentication is properly configured
- [ ] CORS settings restrict to your domain
- [ ] Rate limiting is implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (Drizzle handles this)
- [ ] XSS protection headers configured
- [ ] HTTPS enforced on all routes
- [ ] Sensitive data is never logged
- [ ] Regular security updates applied

## Troubleshooting

### Common Issues

#### Workers Size Limit

If you hit the 10MB Workers size limit:

1. Optimize bundle size with tree shaking
2. Move large assets to R2 storage
3. Split into multiple Workers if needed

#### Database Connection Issues

1. Verify Hyperdrive configuration
2. Check connection string format
3. Ensure PostgreSQL extensions are installed
4. Review Neon connection limits

#### Authentication Problems

1. Verify OAuth redirect URIs
2. Check AUTH_SECRET is set correctly
3. Ensure cookies are configured for your domain
4. Review CORS settings

### Debug Mode

Enable verbose logging:

```typescript
// In apps/edge/index.ts
const DEBUG = env.ENVIRONMENT === "staging";

if (DEBUG) {
  console.log("Request:", request.url);
  console.log("Headers:", Object.fromEntries(request.headers));
}
```

## Cost Optimization

### Cloudflare Workers

- Free tier: 100,000 requests/day
- Paid: $5/month for 10M requests
- Monitor usage in dashboard

### Neon PostgreSQL

- Free tier: 0.5 GB storage
- Scale as needed with compute auto-suspend
- Use connection pooling to reduce costs

### Optimization Tips

1. Implement aggressive caching
2. Use KV storage for session data
3. Optimize database queries
4. Enable Cloudflare's free optimizations

## Next Steps

After deployment:

1. **Set up monitoring** - Configure alerts for errors and performance
2. **Implement backups** - Regular database backups with Neon
3. **Configure CI/CD** - Automate deployments with GitHub Actions
4. **Add custom domain** - Configure your domain in Cloudflare
5. **Enable analytics** - Track user behavior and performance
6. **Security audit** - Regular security reviews and updates

## Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Neon Documentation](https://neon.tech/docs)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- [Hyperdrive Documentation](https://developers.cloudflare.com/hyperdrive/)
- [Better Auth Deployment](https://www.better-auth.com/docs/deployment)
