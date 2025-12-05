# Getting Started

Welcome to **React Starter Kit** — your shortcut to building modern web apps without the usual setup headaches. This guide will get you from zero to hero faster than you can say "webpack configuration" (which, thankfully, you won't have to).

::: tip Quick Start
Just want to dive in? Run these commands and you're good to go:

```bash
git clone -o seed -b main --single-branch \
  https://github.com/kriasoft/react-starter-kit.git my-app
cd my-app && bun install && bun dev
```

:::

## Prerequisites

Before diving in, make sure you have these essentials:

- **Bun** 1.3.0+ ([install here](https://bun.sh)) — trust us, it's worth it
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
git clone -o seed -b main --single-branch \
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
git push -u origin main

# Later, when you want template updates
git fetch seed
git merge seed/main
```

::: warning
Be careful when merging template updates — always review changes and test thoroughly before deploying.
:::

## Project Structure

Once you're set up, here's what you're working with:

```bash
my-app/
├── apps/
│   ├── app/      # React 19 frontend with TanStack Router
│   ├── web/      # Astro static site (landing/marketing)
│   ├── api/      # tRPC backend (type-safe goodness)
│   └── email/    # React Email templates (authentication & transactional)
├── packages/
│   ├── core/     # Shared modules and utilities
│   ├── ui/       # Shared UI components (shadcn/ui)
│   └── ws-protocol/ # WebSocket protocol template
├── db/           # Database schemas and migrations
├── infra/        # Terraform infrastructure configuration
├── docs/         # Documentation (you are here!)
├── scripts/      # Build and utility scripts
└── package.json  # Monorepo root
```

## First Steps

### 1. Start Development Server

Fire up the development environment with two terminals:

**Terminal 1 - React App:**

```bash
bun app:dev  # or bun --filter @repo/app dev
```

**Terminal 2 - API Server:**

```bash
bun api:dev  # or bun --filter @repo/api dev
```

This starts:

- 🚀 App dev server at `http://localhost:5173` (React app)
- 🔥 API server at `http://localhost:8787` (tRPC with hot reload)
- 💾 Database connection (Neon PostgreSQL)

**Optional - Other services:**

```bash
bun web:dev    # Marketing site (Astro) at http://localhost:4321
bun email:dev  # Email preview server at http://localhost:3001
```

::: details What's happening under the hood?
Each command starts its specific development server:

- **app:dev**: Vite dev server for the React app with HMR
- **api:dev**: Wrangler dev server for the tRPC API with file watching
- **email:dev**: React Email preview server for template development
- **web:dev**: Astro dev server for the marketing site
  :::

### 2. Explore the Stack

Open your browser and check out:

- **App**: `http://localhost:5173` — Your React app with TanStack Router
- **API**: `http://localhost:8787` — tRPC API endpoints
- **Database GUI**: Run `bun --filter @repo/db studio` to explore your database
- **Email Templates**: Run `bun email:dev` for preview at `http://localhost:3001`
- **Astro Site**: Run `bun web:dev` for the marketing site at `http://localhost:4321`

### 3. Make It Yours

Time to customize:

1. **Update branding** → Edit `apps/app/index.html` with your app's title
2. **Homepage content** → Modify `apps/app/routes/index.tsx`
3. **API endpoints** → Check out `apps/api/routers/` for tRPC routes
4. **Data models** → Explore `db/schema/` for database structure

## Database Setup

The template uses Neon PostgreSQL with Drizzle ORM. To set up your database:

```bash
# Generate the initial schema
bun --filter @repo/db generate

# Apply migrations to your local database
bun --filter @repo/db push

# (Optional) Seed with sample data
bun --filter @repo/db seed
```

::: tip Database GUI
Want to explore your data visually? Run `bun --filter @repo/db studio` to open Drizzle Studio in your browser.
:::

## Authentication

Better Auth is pre-configured with multiple authentication methods:

- **Email/Password** - Traditional authentication
- **Passkeys** - WebAuthn biometric authentication
- **OAuth** - Google and other providers
- **OTP** - One-time passwords via email
- **Email Templates** - Beautiful transactional emails

### Configuration

1. **Create environment file** → Create `.env.local` (excluded from Git)
2. **Add OAuth credentials** → Google, GitHub, etc.
3. **Configure email** → Set up Resend for email delivery
4. **Client setup** → Check `apps/app/lib/auth.ts`
5. **Server config** → See `apps/api/lib/auth.ts`

::: details Example .env.local

```bash
# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email Service (Resend)
RESEND_API_KEY="re_xxxxxxxxxx"
RESEND_EMAIL_FROM="Your App <noreply@example.com>"

# Auth Secret (generate with: openssl rand -hex 32)
BETTER_AUTH_SECRET="your-random-secret-here"
```

:::

### Email Templates

The template includes React Email templates for authentication:

```bash
# Preview email templates
bun email:dev

# Build for production
bun email:build

# Export static HTML
bun email:export
```

## UI Components Management

The template includes powerful shadcn/ui component management utilities:

```bash
# Add specific components
bun run ui:add button dialog

# Install essential components (37 pre-selected)
bun run ui:essentials

# List installed components
bun run ui:list

# Update components to latest versions
bun run ui:update
```

::: tip Quick Setup
Running `bun run ui:essentials` gives you 37 carefully selected components that cover 90% of typical UI needs — forms, layout, navigation, and feedback components.

For detailed component management documentation, see the [UI Components Guide](/ui-components).
:::

## Development Workflow

Here's your daily routine:

```bash
# Start development (in separate terminals)
bun app:dev   # Terminal 1: React app
bun api:dev   # Terminal 2: API server

# Run tests (yes, we have tests!)
bun test

# Lint your code (keep it clean)
bun lint

# Build for production
bun email:build  # Build email templates first
bun app:build    # Build React app
bun api:build    # Build API
```

::: info Type Checking
TypeScript checking happens automatically in your editor. For CI/CD, run `bun --filter @repo/api build` to verify types.
:::

### 💡 Hot Tips for Development

- **API Types**: After modifying tRPC routes, types auto-generate — no manual sync needed
- **Database Changes**: Edit `db/schema/`, then run `bun --filter @repo/db generate` and `push`
- **Component Library**: shadcn/ui components are ready to use — check `packages/ui/components`
- **UI Components**: Add new components with `bun run ui:add <component>` or install essentials with `bun run ui:essentials`
- **State Management**: Global state lives in `apps/app/lib/store.ts` using Jotai

## Deploy to Production

Ready to ship? Let's deploy to Cloudflare Workers:

```bash
# First, login to Cloudflare
bun wrangler login

# Build packages (order matters!)
bun email:build   # Build email templates
bun web:build     # Build marketing site
bun app:build     # Build React app

# Deploy applications
bun web:deploy    # Deploy marketing site
bun api:deploy    # Deploy API server
bun app:deploy    # Deploy React app
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
Production uses Neon PostgreSQL — ensure your production database is configured:

```bash
# Apply migrations to production
bun --filter @repo/db migrate --env=production
```

:::

::: tip API Routes
All API calls go through `/api/trpc` — the client handles this automatically. No need to configure endpoints.
:::

::: info Build Errors
If TypeScript complains, try `bun --filter @repo/api build` first. This regenerates type definitions.
:::

## Next Steps

Now that you're up and running:

1. Browse the [example components](https://github.com/kriasoft/react-starter-kit/tree/main/apps/web/components) for inspiration
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
