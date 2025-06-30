# CLAUDE.md

Guidance for Claude Code when working with this monorepo.

## Project Overview

Full-stack React application template optimized for Cloudflare Workers deployment.

## Monorepo Structure

- `app/` - React 19 frontend (Vite, TanStack Router, Jotai, ShadCN UI, Tailwind CSS v4)
- `api/` - tRPC API server
- `edge/` - Cloudflare Workers edge deployment
- `db/` - Drizzle ORM schemas and migrations

## Tech Stack

- **Runtime:** Bun (>=1.2.0), TypeScript 5.8
- **Frontend:** React 19, TanStack Router, Jotai, ShadCN UI, Tailwind CSS v4, Better Auth
- **Backend:** Hono framework, tRPC
- **Database:** Cloudflare D1 (SQLite), Drizzle ORM
- **Testing:** Vitest, Happy DOM
- **Deployment:** Cloudflare Workers, Wrangler

## Essential Commands

```bash
# Development
bun start                    # Start app dev server
bun --cwd app start          # Start app workspace
bun --cwd api build          # Build API types
bun --cwd db push            # Apply DB schema changes
bun test                     # Run all tests
bun lint                     # Lint all code

# Database
bun --cwd db generate     # Generate migrations
bun --cwd db studio       # Open DB GUI
bun --cwd db seed         # Seed sample data

# Deployment
bun wrangler deploy --env=production
```

## Code Conventions

- **Functional Programming:** Prefer functional patterns over class-based code
- **Modern TypeScript:** Use latest TypeScript features, avoid legacy patterns like `_` for private vars
- **Bun/Hono Idioms:** Utilize Bun-specific features and Hono middleware patterns
- **WebSocket:** Use pub-sub pattern for WebSocket communication via `bun-ws-router`
