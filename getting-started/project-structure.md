---
url: /getting-started/project-structure.md
---

# Project Structure

The project is a Bun monorepo with four applications, shared packages, a database workspace, and infrastructure configuration.

```bash
my-app/
├── apps/
│   ├── web/           # Edge router + Astro marketing site
│   ├── app/           # React 19 SPA (TanStack Router)
│   ├── api/           # Hono + tRPC API server
│   └── email/         # React Email templates
├── packages/
│   ├── ui/            # shadcn/ui component library
│   ├── core/          # Shared utilities
│   ├── ws-protocol/   # WebSocket protocol template
│   └── typescript-config/  # Shared tsconfig presets
├── db/                # Drizzle ORM schemas and migrations
├── infra/             # Terraform (Cloudflare Workers, DNS)
├── docs/              # Documentation (VitePress)
├── scripts/           # Build and utility scripts
└── package.json       # Monorepo root
```

## Applications

### `apps/web` – Edge Router

Cloudflare Worker that serves as the public-facing entry point. Routes `/api/*` to the API worker and app routes (`/login`, `/settings`, etc.) to the app worker via [service bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/). Also serves the Astro-built marketing site for unauthenticated visitors. Uses an [auth hint cookie](/adr/001-auth-hint-cookie) to decide whether `/` shows the app or the landing page.

### `apps/app` – Frontend SPA

React 19 single-page application built with Vite. Uses TanStack Router for file-based routing (`apps/app/routes/`), TanStack Query for server state, Jotai for client state, and shadcn/ui components. Deployed as a Cloudflare Worker with static assets.

### `apps/api` – API Server

Cloudflare Worker running [Hono](https://hono.dev) for HTTP routing and [tRPC](https://trpc.io) for type-safe RPC. Handles authentication (Better Auth), database queries (Drizzle ORM via Hyperdrive), and Stripe webhooks. Has `nodejs_compat` enabled – the other workers do not.

### `apps/email` – Email Templates

[React Email](https://react.email) templates used for OTP codes, invitations, and transactional emails. Built before the API dev server starts so templates are available at runtime. Preview with `bun email:dev`.

## Packages

| Package                      | Description                                                                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `packages/ui`                | [shadcn/ui](https://ui.shadcn.com) components (new-york style) with Tailwind CSS v4. Add components with `bun ui:add <name>`. |
| `packages/core`              | Shared utilities and constants used across apps.                                                                              |
| `packages/ws-protocol`       | WebSocket message protocol template for real-time features.                                                                   |
| `packages/typescript-config` | Shared `tsconfig.json` presets for consistent compiler settings.                                                              |

## Database Workspace

The `db/` workspace contains Drizzle ORM table definitions (`db/schema/`), migration files (`db/migrations/`), and seed scripts (`db/seeds/`). It targets Neon PostgreSQL with Cloudflare Hyperdrive for connection pooling.

See [Database Overview](/database/) for details.

## Key Configuration Files

| File                    | Purpose                                               |
| ----------------------- | ----------------------------------------------------- |
| `infra/`                | Terraform modules for Cloudflare resources            |
| `apps/*/wrangler.jsonc` | Cloudflare Worker configuration per app               |
| `db/drizzle.config.ts`  | Drizzle ORM migration configuration                   |
| `.env`                  | Shared environment defaults (committed to git)        |
| `.env.local`            | Local secrets and overrides (git-ignored)             |
| `tsconfig.json`         | Root TypeScript project references                    |
| `package.json`          | Monorepo root – workspaces, scripts, dev dependencies |
