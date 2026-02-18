# Edge Router

Astro-based edge worker that routes traffic to the app and API workers via Cloudflare service bindings.

[Documentation](https://reactstarter.com/architecture/edge) | [Deployment](https://reactstarter.com/deployment/)

## Development

```bash
bun web:dev       # Start dev server (http://localhost:4321)
bun web:build     # Build for production
bun web:deploy    # Deploy to Cloudflare Workers
```

## Routing

- `/api/*` → API worker
- App routes → App worker
- Static assets served directly from the edge
