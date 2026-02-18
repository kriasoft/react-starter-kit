# API Server

Hono + tRPC API server with Better Auth, Drizzle ORM, and Stripe billing. Runs on Cloudflare Workers.

[Documentation](https://reactstarter.com/api/) | [Auth](https://reactstarter.com/auth/) | [Database](https://reactstarter.com/database/)

## Development

```bash
bun api:dev       # Start dev server (http://localhost:8787)
bun api:build     # Build for production
bun api:deploy    # Deploy to Cloudflare Workers
```

## Structure

```bash
routers/          # tRPC routers organized by domain
lib/              # Context, middleware, DataLoaders, auth config
worker.ts         # Cloudflare Worker entry point
index.ts          # Package exports
```
