---
outline: [2, 3]
---

# Quick Start

::: tip TL;DR

```bash
git clone -o seed -b main --single-branch \
  https://github.com/kriasoft/react-starter-kit.git my-app
cd my-app && bun install && bun dev
```

:::

## Prerequisites

- **[Bun](https://bun.sh)** 1.3.0 or later
- A **[Cloudflare](https://dash.cloudflare.com/sign-up)** account (free tier works)

::: info

Node.js Optional This project runs entirely on Bun. You don't need Node.js unless you're integrating with Node-specific tools.

:::

## Create Your Project

### Option A: GitHub Template

1. Go to [github.com/kriasoft/react-starter-kit](https://github.com/kriasoft/react-starter-kit)
2. Click **"Use this template"** → **"Create a new repository"**
3. Clone your new repository:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_PROJECT.git
cd YOUR_PROJECT
bun install
```

::: tip

This creates a clean repository without the template's commit history.

:::

### Option B: Git Clone

Clone with a custom remote name so you can pull template updates later:

```bash
git clone -o seed -b main --single-branch \
  https://github.com/kriasoft/react-starter-kit.git my-app
cd my-app
bun install
```

Add your own repository as `origin`:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_PROJECT.git
git push -u origin main
```

## Keep Template Updates

Run the repository's `merge-seed` skill when you want to bring newer React Starter Kit changes into your project (`/merge-seed` in Claude Code or `$merge-seed` in Codex). It adds the `seed` remote if needed, reviews the upstream commits, merges them on a dedicated branch, preserves your product-specific behavior and configuration, and runs the project checks before landing the result.

Commit or stash your work first – the workflow requires a clean working tree. This works whether you started from the GitHub template or cloned with `-o seed`.

::: warning

Treat upstream migrations and changes to live-data semantics as decisions, not routine conflicts. The skill stops and asks for direction instead of guessing in those cases.

:::

## Start the Dev Server

```bash
bun dev
```

This starts three services concurrently:

| Service | URL                     | Description               |
| ------- | ----------------------- | ------------------------- |
| App     | `http://localhost:5173` | React SPA with hot reload |
| API     | `http://localhost:8787` | Hono + tRPC server        |
| Web     | `http://localhost:4321` | Astro marketing site      |

You can also start services individually:

```bash
bun app:dev     # React app only
bun api:dev     # API server only
bun web:dev     # Marketing site only
bun email:dev   # Email template preview at http://localhost:3001
```

## Explore the Stack

- **App** at `http://localhost:5173` – your React app with TanStack Router
- **API** at `http://localhost:8787` – tRPC endpoints
- **Database GUI** – run `bun db:studio` to open Drizzle Studio
- **Email preview** – run `bun email:dev` for template preview at `http://localhost:3001`

## Make It Yours

1. Update branding in `apps/app/index.html`
2. Edit the homepage at `apps/app/routes/(app)/index.tsx`
3. Add API procedures in `apps/api/routers/`
4. Define data models in `db/schema/`

## Development Commands

```bash
bun dev          # Start all services concurrently
bun run test --run  # Run tests once (drop --run to watch)
bun lint         # ESLint with cache
bun typecheck    # TypeScript type checking (tsc --build)
bun run build    # Production build for all deployable workspaces
```

::: info

After modifying tRPC routes, types update automatically – no manual sync needed. After editing `db/schema/`, run `bun db:generate` then `bun db:push` to apply changes.

:::
