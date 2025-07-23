# Getting Started

Welcome to **React Starter Kit** — your shortcut to building modern web apps without the usual setup headaches. This guide will get you from zero to hero faster than you can say "webpack configuration" (which, thankfully, you won't have to).

::: tip Quick Start
Just want to dive in? Run these commands and you're good to go:

```bash
git clone -o seed -b master --single-branch \
  https://github.com/kriasoft/react-starter-kit.git my-app
cd my-app && bun install && bun dev
```

:::

## Prerequisites

Before diving in, make sure you have these essentials:

- **Bun** 1.2.0+ ([install here](https://bun.sh)) — trust us, it's worth it
- A **Cloudflare** account for deployment (free tier works great)
- Your favorite code editor (VS Code recommended, but we won't judge)

::: info Node.js Optional
While many developers have Node.js installed, this template runs entirely on Bun. You don't need Node.js unless you're integrating with Node-specific tools.
:::

## Create Your Project

You've got two paths to choose from. Pick your adventure:

### Option 1: GitHub Template (The Quick Way)

Perfect if you want to get started immediately and keep your project cleanly separated:

1. Navigate to [github.com/kriasoft/react-starter-kit](https://github.com/kriasoft/react-starter-kit)
2. Click the green **"Use this template"** button
3. Choose "Create a new repository"
4. Name your project (avoid "my-awesome-app" — be creative!)
5. Clone your new repository:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_PROJECT.git
cd YOUR_PROJECT
bun install
```

::: tip
This method creates a clean repository history without the template's commit history.
:::

### Option 2: Git Clone (The Smart Way)

This approach lets you pull updates from the template later  because who doesn't love staying current?

```bash
# Clone the template with a custom remote name
git clone -o seed -b master --single-branch \
  https://github.com/kriasoft/react-starter-kit.git my-app

# Jump into your project
cd my-app

# Install dependencies (Bun makes this blazing fast)
bun install
```

The magic here is naming the remote "seed" instead of "origin". This way, you can add your own repository as "origin" later while keeping the template connection alive:

```bash
# Add your own repository as origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_PROJECT.git
git push -u origin master

# Later, when you want template updates
git fetch seed
git merge seed/master
```

::: warning
Be careful when merging template updates — always review changes and test thoroughly before deploying.
:::

## Project Structure

Once you're set up, here's what you're working with:

```bash
my-app/
├── app/          # React 19 frontend (where the magic happens)
├── api/          # tRPC backend (type-safe goodness)
├── edge/         # Cloudflare Workers entry point
├── db/           # Database schemas and migrations
├── docs/         # Documentation (you are here!)
└── package.json  # Monorepo root
```

## First Steps

### 1. Start Development Server

Fire up the development environment:

```bash
bun dev
```

This starts:

- 🚀 Frontend dev server at `http://localhost:5173`
- 🔥 API server with hot reload
- 💾 Database connection (local SQLite)

::: details What's happening under the hood?
The `bun dev` command runs multiple processes concurrently:

- Vite dev server for the React app
- tRPC API server with file watching
- TypeScript compiler in watch mode
- Database migrations (if needed)
  :::

### 2. Explore the Stack

Open your browser and check out:

- **Frontend**: `http://localhost:5173` — Your React app with TanStack Router
- **Database GUI**: Run `bun --cwd db studio` to explore your database

### 3. Make It Yours

Time to customize:

1. **Update branding** → Edit `app/index.html` with your app's title
2. **Homepage content** → Modify `app/routes/index.tsx`
3. **API endpoints** → Check out `api/routers/` for tRPC routes
4. **Data models** → Explore `db/schema/` for database structure

## Database Setup

The template uses Cloudflare D1 (SQLite) with Drizzle ORM. To set up your database:

```bash
# Generate the initial schema
bun --cwd db generate

# Apply migrations to your local database
bun --cwd db push

# (Optional) Seed with sample data
bun --cwd db seed
```

::: tip Database GUI
Want to explore your data visually? Run `bun --cwd db studio` to open Drizzle Studio in your browser.
:::

## Authentication

Better Auth is pre-configured but needs your touch:

1. **Create environment file** → Create `.env.local` (excluded from Git)
2. **Add OAuth credentials** → Google, GitHub, etc.
3. **Client setup** → Check `app/lib/auth.ts`
4. **Server config** → See `api/auth.ts`

::: details Example .env.local

```bash
# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Auth Secret (generate with: openssl rand -hex 32)
AUTH_SECRET="your-random-secret-here"
```

:::

## Development Workflow

Here's your daily routine:

```bash
# Start everything
bun dev

# Run tests (yes, we have tests!)
bun test

# Lint your code (keep it clean)
bun lint
```

::: info Type Checking
TypeScript checking happens automatically in your editor. For CI/CD, run `bun --cwd api build` to verify types.
:::

### 💡 Hot Tips for Development

- **API Types**: After modifying tRPC routes, types auto-generate — no manual sync needed
- **Database Changes**: Edit `db/schema/`, then run `bun --cwd db generate` and `push`
- **Component Library**: ShadCN UI components are ready to use — check `app/components/ui`
- **State Management**: Global state lives in `app/lib/store.ts` using Jotai

## Deploy to Production

Ready to ship? Let's deploy to Cloudflare Workers:

```bash
# First, login to Cloudflare
bun wrangler login

# Deploy to production
bun wrangler deploy --env=production
```

::: warning Environment Configuration
The project includes multiple environments (development, preview, production). Always specify `--env=production` for production deployments.
:::

Your app will be live at `https://your-app.workers.dev` in seconds. Yes, really.

## ⚠️ Common Gotchas

::: danger Environment Variables
Remember to set them in Cloudflare dashboard for production — local `.env` files are NOT deployed!
:::

::: warning Database Migrations
Production uses Cloudflare D1 — you must run migrations there separately:

```bash
bun wrangler d1 migrations apply YOUR_DATABASE --env=production
```

:::

::: tip API Routes
All API calls go through `/api/trpc` — the client handles this automatically. No need to configure endpoints.
:::

::: info Build Errors
If TypeScript complains, try `bun --cwd api build` first. This regenerates type definitions.
:::

## Next Steps

Now that you're up and running:

1. Browse the [example components](https://github.com/kriasoft/react-starter-kit/tree/main/app/components) for inspiration
2. Check out the [deployment guide](/deployment) for advanced Cloudflare setup
3. Join our [Discord community](https://discord.gg/2nKEnKq) for help and updates

Remember: This template is intentionally minimal. It's not trying to be everything to everyone — it's a solid foundation that respects your ability to make architectural decisions. Build something amazing!

## 🆘 Need Help?

::: tip Community Support

- 💬 [GitHub Discussions](https://github.com/kriasoft/react-starter-kit/discussions)
- 🐛 [Report Issues](https://github.com/kriasoft/react-starter-kit/issues)
- ⭐ [Star us on GitHub](https://github.com/kriasoft/react-starter-kit) (it helps!)
  :::

Happy coding! 🚀
