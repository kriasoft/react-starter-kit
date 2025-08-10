## Project Overview

Full-stack React application template optimized for Cloudflare Workers deployment.

## Monorepo Structure

- `apps/web/` - React 19 frontend (Vite, TanStack Router, Jotai, shadcn/ui, Tailwind CSS v4)
- `apps/api/` - tRPC API server
- `apps/edge/` - Cloudflare Workers edge deployment
- `packages/core/` - Shared core utilities and WebSocket functionality
- `packages/ui/` - Shared UI components and shadcn/ui management scripts
- `db/` - Drizzle ORM schemas and migrations
- `infra/` - Terraform infrastructure configuration
- `docs/` - VitePress documentation site
- `scripts/` - Build and utility scripts

## Tech Stack

- **Runtime:** Bun (>=1.2.0), TypeScript 5.8
- **Frontend:** React 19, TanStack Router, Jotai, shadcn/ui, Tailwind CSS v4, Better Auth
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

# UI Components
bun ui:add <component>         # Add shadcn/ui component
bun ui:list                    # List installed components
bun ui:update                  # Update all components
bun ui:essentials              # Install essential components

# Other
bun lint                       # Lint all code
bun --filter @repo/db push     # Apply DB schema changes

# Database
bun --filter @repo/db generate # Generate migrations
bun --filter @repo/db studio   # Open DB GUI
bun --filter @repo/db seed     # Seed sample data

# Deployment
bun wrangler deploy --config apps/web/wrangler.jsonc --env=production
bun wrangler deploy --config apps/edge/wrangler.jsonc --env=production
```

## Code Conventions

- **Functional Programming:** Prefer functional patterns over class-based code
- **Modern TypeScript:** Use latest TypeScript features, avoid legacy patterns like `_` for private vars
- **Bun/Hono Idioms:** Utilize Bun-specific features and Hono middleware patterns
- **WebSocket:** Use pub-sub pattern for WebSocket communication via `bun-ws-router`
