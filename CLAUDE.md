## Project Overview

Full-stack React application template optimized for Cloudflare Workers deployment.

## Monorepo Structure

- `apps/web/` - React 19 frontend (Vite, TanStack Router, Jotai, ShadCN UI, Tailwind CSS v4)
- `apps/api/` - tRPC API server
- `apps/edge/` - Cloudflare Workers edge deployment
- `packages/core/` - Shared core utilities and WebSocket functionality
- `db/` - Drizzle ORM schemas and migrations
- `infra/` - Terraform infrastructure configuration
- `docs/` - VitePress documentation site
- `scripts/` - Build and utility scripts

## Tech Stack

- **Runtime:** Bun (>=1.2.0), TypeScript 5.8
- **Frontend:** React 19, TanStack Router, Jotai, ShadCN UI, Tailwind CSS v4, Better Auth
- **Backend:** Hono framework, tRPC
- **Database:** Neon PostgreSQL, Drizzle ORM
- **Testing:** Vitest, Happy DOM
- **Deployment:** Cloudflare Workers, Wrangler

## Essential Commands

```bash
# Development
bun dev                        # Start web app dev server
bun dev:web                    # Start web app (shortcut)
bun dev:api                    # Start API server (shortcut)
bun dev:edge                   # Start edge server (shortcut)

# Building
bun build                      # Build all apps
bun build:web                  # Build web app (shortcut)
bun build:edge                 # Build edge app (shortcut)
bun --filter @repo/api build   # Build API types

# Testing
bun test                       # Run all tests
bun test:web                   # Test web app (shortcut)
bun test:api                   # Test API (shortcut)
bun test:edge                  # Test edge (shortcut)

# Other
bun lint                       # Lint all code
bun --cwd db push              # Apply DB schema changes

# Database
bun --cwd db generate          # Generate migrations
bun --cwd db studio            # Open DB GUI
bun --cwd db seed              # Seed sample data

# Deployment
bun wrangler deploy --env=production
```

## Code Conventions

- **Functional Programming:** Prefer functional patterns over class-based code
- **Modern TypeScript:** Use latest TypeScript features, avoid legacy patterns like `_` for private vars
- **Bun/Hono Idioms:** Utilize Bun-specific features and Hono middleware patterns
- **WebSocket:** Use pub-sub pattern for WebSocket communication via `bun-ws-router`
