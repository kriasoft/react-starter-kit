## Project Overview

Full-stack React application template optimized for Cloudflare Workers deployment.

## Monorepo Structure

- `apps/web/` - Marketing static website
- `apps/app/` - Main application SPA
- `apps/api/` - tRPC API server
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
bun web:dev                    # Start web app (shortcut)
bun api:dev                    # Start API server (shortcut)
bun app:dev                    # Start main app (shortcut)

# Building
bun build                      # Build all apps
bun web:build                  # Build web app (shortcut)
bun app:build                  # Build main app (shortcut)
bun --filter @repo/api build   # Build API types

# Testing
bun test                       # Run all tests
bun web:test                   # Test web app (shortcut)
bun app:test                   # Test main app (shortcut)
bun api:test                   # Test API (shortcut)

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
bun wrangler deploy --config apps/app/wrangler.jsonc --env=production
bun wrangler deploy --config apps/api/wrangler.jsonc --env=production
```

## Code Conventions

1. **Functional Programming:** Favor functional patterns (e.g., hooks, pure functions) over class-based code for better composability and testability.
2. **Modern TypeScript:** Leverage latest features (e.g., const assertions, template literals); avoid legacy patterns like `_` prefixes for private variables.
3. **Imports:** Use named imports (e.g., `import { foo } from "bar";`) for tree-shaking, readability, and modern standards; avoid namespace imports (e.g., `import * as baz from "bar";`).
4. **Bun/Hono Idioms:** Incorporate Bun-specific features (e.g., native APIs) and Hono middleware patterns for performance and simplicity.
