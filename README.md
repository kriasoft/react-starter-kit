# React Starter Kit

<a href="https://github.com/kriasoft/react-starter-kit?sponsor=1"><img src="https://img.shields.io/badge/-GitHub-%23555.svg?logo=github-sponsors" height="20"></a>
<a href="https://discord.gg/2nKEnKq"><img src="https://img.shields.io/discord/643523529131950086?label=Chat" height="20"></a>
<a href="https://github.com/kriasoft/react-starter-kit/stargazers"><img src="https://img.shields.io/github/stars/kriasoft/react-starter-kit.svg?style=social&label=Star&maxAge=3600" height="20"></a>
<a href="https://twitter.com/koistya"><img src="https://img.shields.io/twitter/follow/koistya.svg?style=social&label=Follow&maxAge=3600" height="20"></a>

Building modern web applications shouldn't require weeks of configuration hell. This React Starter Kit eliminates the tedious setup work so you can focus on what matters: shipping great products.

Designed for developers who value both speed and quality, this template provides a complete foundation for full-stack applications. From solo projects to team collaborations, it scales with your ambitions while maintaining the developer experience you deserve.

## What You Get

- **Performance by Default**: Bun runtime delivers exceptional speed across development and production. Your build times will thank you.
- **Type Safety Throughout**: TypeScript and tRPC create an unbreakable contract between frontend and backend. Catch errors at compile time, not in production.
- **Modern React Stack**: React 19 with TanStack Router provides type-safe navigation and powerful data fetching patterns. Tailwind CSS v4 handles styling with zero configuration.
- **Edge-Native Deployment**: Cloudflare Workers ensure your app runs close to users worldwide. Experience sub-100ms response times globally.
- **Database Ready**: Drizzle ORM with Cloudflare D1 provides a complete data layer. Multi-tenant support included out of the box.
- **Developer Experience**: ESLint, Prettier, and VSCode configurations eliminate bikeshedding. Focus on features, not formatting.

<a href="https://reactstarter.com/s/1"><img src="https://reactstarter.com/s/1.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/s/2"><img src="https://reactstarter.com/s/2.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/s/3"><img src="https://reactstarter.com/s/3.png" height="60" /></a>

---

This project was bootstrapped with [React Starter Kit](https://github.com/kriasoft/react-starter-kit).
Be sure to join our [Discord channel](https://discord.com/invite/2nKEnKq) for assistance.

## Monorepo Architecture

This starter kit uses a thoughtfully organized monorepo structure that promotes code reuse and maintainability:

`├──`[`app/`](./app) — React frontend with Vite, TanStack Router, and Tailwind CSS<br>
`├──`[`api/`](./api) — tRPC API server powered by Hono framework<br>
`├──`[`edge/`](./edge) — Cloudflare Workers entry point and edge logic<br>
`├──`[`core/`](./core) — Shared TypeScript types and utilities<br>
`├──`[`db/`](./db) — Database schemas, migrations, and seed data<br>
`├──`[`scripts/`](./scripts) — Build automation and development tools<br>

**Why Monorepo?** This structure enables seamless code sharing between frontend and backend, ensures type consistency across your entire stack, and simplifies dependency management. When you update a type definition, both client and server stay in sync automatically.

## Perfect For

- **SaaS Applications**: Multi-tenant architecture with user management built-in
- **API-First Products**: tRPC provides excellent developer experience for API development
- **Global Applications**: Edge deployment ensures fast loading times worldwide
- **Team Projects**: Monorepo structure scales well with multiple developers
- **Rapid Prototyping**: Skip configuration and start building features immediately

## Technology Stack

**Core Runtime & Platform**

- [Bun](https://bun.sh/) — Lightning-fast JavaScript runtime and package manager
- [Cloudflare Workers](https://workers.cloudflare.com/) — Edge computing platform

**Frontend & UI**

- [React 19](https://react.dev/) — Latest React with concurrent features
- [TanStack Router](https://tanstack.com/router) — Type-safe routing with data loading
- [Tailwind CSS v4](https://tailwindcss.com/) — Utility-first CSS framework
- [ShadCN UI](https://ui.shadcn.com/) — Beautiful, accessible components
- [Jotai](https://jotai.org/) — Atomic state management

**Backend & API**

- [Hono](https://hono.dev/) — Ultrafast web framework for the edge
- [tRPC](https://trpc.io/) — End-to-end type safety for APIs
- [Better Auth](https://www.better-auth.com/) — Modern authentication solution

**Database & ORM**

- [Drizzle ORM](https://orm.drizzle.team/) — TypeScript ORM with excellent DX
- [Cloudflare D1](https://developers.cloudflare.com/d1/) — Serverless SQLite database

**Development Tools**

- [Vite](https://vitejs.dev/) — Next-generation frontend tooling
- [Vitest](https://vitest.dev/) — Blazing fast unit testing
- [TypeScript](https://www.typescriptlang.org/) — Static type checking
- [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/) — Code quality and formatting

## Prerequisites

- [Bun](https://bun.sh/) v1.2+ (replaces Node.js and npm)
- [VS Code](https://code.visualstudio.com/) with our [recommended extensions](.vscode/extensions.json)
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) browser extension (recommended)
- [Cloudflare account](https://dash.cloudflare.com/sign-up) for deployment

## Quick Start

### 1. Create Your Project

[Generate a new repository](https://github.com/kriasoft/react-starter-kit/generate) from this template, then clone it locally:

```bash
git clone https://github.com/your-username/your-project-name.git
cd your-project-name
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Configure Environment

Update environment variables in [`.env`](./.env) and `.env.local` files as well as Wrangler configuration in [`wrangler.jsonc`](./wrangler.jsonc).

### 4. Start Development

Open two terminals and run these commands:

**Terminal 1 - Frontend:**

```bash
bun --cwd app start
```

**Terminal 2 - Backend:**

```bash
bun --cwd edge build --watch
bun wrangler dev
```

### 5. Initialize Database

```bash
# Let Wrangler create the D1 database locally
bun wrangler d1 execute db --local --command "SELECT 1"
# Apply database schema and migrations
bun --cwd db migrate
bun --cwd db seed  # Optional: add sample data
```

Open <http://localhost:5173> to see your app running. The backend API will be available at the port shown by `wrangler dev` (typically 8787).

## Production Deployment

### 1. Environment Setup

Ensure your production environment variables are configured:

```bash
# Set secrets in Cloudflare Workers
bun wrangler secret put BETTER_AUTH_SECRET --env=production
bun wrangler secret put OPENAI_API_KEY --env=production
```

### 2. Build and Deploy

```bash
# Build all packages
bun --cwd app build
bun --cwd edge build

# Deploy to Cloudflare Workers
bun wrangler deploy --env=production
```

Your application will be live on your Cloudflare Workers domain within seconds. The edge-first architecture ensures optimal performance regardless of user location.

## Contributors 👨‍💻

<a href="https://reactstarter.com/c/1"><img src="https://reactstarter.com/c/1.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/c/2"><img src="https://reactstarter.com/c/2.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/c/3"><img src="https://reactstarter.com/c/3.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/c/4"><img src="https://reactstarter.com/c/4.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/c/5"><img src="https://reactstarter.com/c/5.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/c/6"><img src="https://reactstarter.com/c/6.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/c/7"><img src="https://reactstarter.com/c/7.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/c/8"><img src="https://reactstarter.com/c/8.png" height="60" /></a>

## Backers 💰

<a href="https://reactstarter.com/b/1"><img src="https://reactstarter.com/b/1.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/b/2"><img src="https://reactstarter.com/b/2.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/b/3"><img src="https://reactstarter.com/b/3.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/b/4"><img src="https://reactstarter.com/b/4.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/b/5"><img src="https://reactstarter.com/b/5.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/b/6"><img src="https://reactstarter.com/b/6.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/b/7"><img src="https://reactstarter.com/b/7.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/b/8"><img src="https://reactstarter.com/b/8.png" height="60" /></a>

## Related Projects

- [GraphQL API and Relay Starter Kit](https://github.com/kriasoft/graphql-starter) — monorepo template, pre-configured with GraphQL API, React, and Relay
- [Cloudflare Workers Starter Kit](https://github.com/kriasoft/cloudflare-starter-kit) — TypeScript project template for Cloudflare Workers
- [Node.js API Starter Kit](https://github.com/kriasoft/node-starter-kit) — project template, pre-configured with Node.js, GraphQL, and PostgreSQL

## How to Contribute

Anyone and everyone is welcome to [contribute](.github/CONTRIBUTING.md). Start
by checking out the list of [open issues](https://github.com/kriasoft/react-starter-kit/issues)
marked [help wanted](https://github.com/kriasoft/react-starter-kit/issues?q=label:"help+wanted").
However, if you decide to get involved, please take a moment to review the
[guidelines](.github/CONTRIBUTING.md).

## License

Copyright © 2014-present Kriasoft. This source code is licensed under the MIT license found in the
[LICENSE](https://github.com/kriasoft/react-starter-kit/blob/main/LICENSE) file.

---

<sup>Made with ♥ by Konstantin Tarkus ([@koistya](https://twitter.com/koistya), [blog](https://medium.com/@koistya))
and [contributors](https://github.com/kriasoft/react-starter-kit/graphs/contributors).</sup>
