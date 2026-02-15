<div align="center">

# React Starter Kit

<a href="https://github.com/kriasoft/react-starter-kit?sponsor=1"><img src="https://img.shields.io/badge/-GitHub-%23555.svg?logo=github-sponsors" height="20"></a>
<a href="https://discord.gg/2nKEnKq"><img src="https://img.shields.io/discord/643523529131950086?label=Chat" height="20"></a>
<a href="https://chatgpt.com/g/g-69564f0a23088191846aa4072bd9397d-react-starter-kit-assistant"><img src="https://img.shields.io/badge/Ask_ChatGPT-10a37f?logo=openai&logoColor=white" height="20"></a>
<a href="https://gemini.google.com/gem/1IXFElQ2UvvZY86iL6uZLeoC-r8mp-OB-?usp=sharing"><img src="https://img.shields.io/badge/Ask_Gemini-8E75B2?logo=googlegemini&logoColor=white" height="20"></a>
<a href="https://github.com/kriasoft/react-starter-kit/stargazers"><img src="https://img.shields.io/github/stars/kriasoft/react-starter-kit.svg?style=social&label=Star&maxAge=3600" height="20"></a>
<a href="https://x.com/ReactStarter"><img src="https://img.shields.io/twitter/follow/ReactStarter.svg?style=social&label=Follow&maxAge=3600" height="20"></a>

</div>

A full-stack monorepo template for building SaaS applications with React 19, tRPC, and Cloudflare Workers. Type-safe from database to UI, deployable to the edge in minutes. New here? Ask our AI assistant on [ChatGPT](https://chatgpt.com/g/g-69564f0a23088191846aa4072bd9397d-react-starter-kit-assistant) or [Gemini](https://gemini.google.com/gem/1IXFElQ2UvvZY86iL6uZLeoC-r8mp-OB-?usp=sharing).

React Starter Kit is proudly supported by these amazing sponsors:

<a href="https://reactstarter.com/s/1"><img src="https://reactstarter.com/s/1.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/s/2"><img src="https://reactstarter.com/s/2.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/s/3"><img src="https://reactstarter.com/s/3.png" height="60" /></a>

## Highlights

- **Type-safe full stack** — TypeScript, tRPC, and Drizzle ORM create a single type contract from database to UI
- **Edge-native** — Three Cloudflare Workers (web, app, api) connected via service bindings
- **Auth included** — Better Auth with email OTP, passkey, Google OAuth, and organizations
- **Modern React** — React 19, TanStack Router (file-based), TanStack Query, Jotai, Tailwind CSS v4, shadcn/ui
- **Database ready** — Drizzle ORM with Neon PostgreSQL, migrations, and seed data
- **Fast DX** — Bun runtime, Vite, Vitest, ESLint, Prettier, and pre-configured VS Code settings

## Technology Stack

| Layer         | Technologies                                                                                                                                                                                  |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Runtime**   | [Bun](https://bun.sh/), [Cloudflare Workers](https://workers.cloudflare.com/), [TypeScript](https://www.typescriptlang.org/) 5.9                                                              |
| **Frontend**  | [React 19](https://react.dev/), [TanStack Router](https://tanstack.com/router), [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Jotai](https://jotai.org/) |
| **Marketing** | [Astro](https://astro.build/)                                                                                                                                                                 |
| **Backend**   | [Hono](https://hono.dev/), [tRPC](https://trpc.io/), [Better Auth](https://www.better-auth.com/)                                                                                              |
| **Database**  | [Drizzle ORM](https://orm.drizzle.team/), [Neon PostgreSQL](https://get.neon.com/HD157BR)                                                                                                     |
| **Tooling**   | [Vite](https://vitejs.dev/), [Vitest](https://vitest.dev/), [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)                                                                   |

## Monorepo Architecture

```
├── apps/
│   ├── web/          Astro marketing site (edge router, serves static + proxies to app/api)
│   ├── app/          React 19 SPA (TanStack Router, Jotai, Tailwind CSS v4)
│   ├── api/          Hono + tRPC API server (Better Auth, Cloudflare Workers)
│   └── email/        React Email templates
├── packages/
│   ├── ui/           shadcn/ui components (new-york style)
│   ├── core/         Shared types and utilities
│   └── ws-protocol/  WebSocket protocol with type-safe messaging
├── db/               Drizzle ORM schemas, migrations, and seed data
├── infra/            Terraform (Cloudflare Workers, DNS, Hyperdrive)
├── docs/             VitePress documentation
└── scripts/          Build automation and dev tools
```

Each app deploys independently to Cloudflare Workers. The web worker routes `/api/*` to the API worker and app routes to the app worker via service bindings.

## Prerequisites

- [Bun](https://bun.sh/) v1.3+ (replaces Node.js and npm)
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

This project follows [Vite env conventions](https://vite.dev/guide/env-and-mode#env-files):

- [`.env`](./.env) is committed and contains shared defaults/placeholders only (no real secrets)
- `.env.local` is git-ignored and should contain your real credentials
- `.env.local` values override `.env`

```bash
cp .env .env.local  # then replace placeholder values with real ones
```

Also check [`wrangler.jsonc`](./apps/api/wrangler.jsonc) for Worker configuration and bindings.

### 4. Start Development

```bash
# Launch all apps in development mode (web, api, and app)
bun dev

# Or, start specific apps individually
bun web:dev  # Marketing site
bun app:dev  # Main application
bun api:dev  # API server
```

### 5. Initialize Database

Ensure `DATABASE_URL` is configured in your `.env.local` file, then set up the schema:

```bash
bun db:push              # Push schema directly (quick dev setup)
bun db:seed              # Seed with sample data (optional)
bun db:studio            # Open database GUI
```

For production, use `bun db:migrate` to apply migrations instead of `db:push`.

| App            | URL                     |
| -------------- | ----------------------- |
| React app      | <http://localhost:5173> |
| Marketing site | <http://localhost:4321> |
| API server     | <http://localhost:8787> |

## Production Deployment

### 1. Environment Setup

Configure your production secrets in Cloudflare Workers:

```bash
# Required secrets
bun wrangler secret put BETTER_AUTH_SECRET

# OAuth providers (as needed)
bun wrangler secret put GOOGLE_CLIENT_ID
bun wrangler secret put GOOGLE_CLIENT_SECRET

# Email service
bun wrangler secret put RESEND_API_KEY

# AI features (optional)
bun wrangler secret put OPENAI_API_KEY
```

Run these commands from the target app directory or pass `--config apps/<app>/wrangler.jsonc`. Non-sensitive vars like `RESEND_EMAIL_FROM` go in `wrangler.jsonc` directly.

### 2. Build and Deploy

```bash
# Build packages that require compilation (order matters!)
bun email:build    # Build email templates first
bun web:build      # Build marketing site
bun app:build      # Build main React app

# Deploy all applications
bun web:deploy     # Deploy marketing site
bun api:deploy     # Deploy API server
bun app:deploy     # Deploy main React app
```

## Backers

<a href="https://reactstarter.com/b/1"><img src="https://reactstarter.com/b/1.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/b/2"><img src="https://reactstarter.com/b/2.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/b/3"><img src="https://reactstarter.com/b/3.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/b/4"><img src="https://reactstarter.com/b/4.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/b/5"><img src="https://reactstarter.com/b/5.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/b/6"><img src="https://reactstarter.com/b/6.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/b/7"><img src="https://reactstarter.com/b/7.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/b/8"><img src="https://reactstarter.com/b/8.png" height="60" /></a>

## Contributors

<a href="https://reactstarter.com/c/1"><img src="https://reactstarter.com/c/1.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/c/2"><img src="https://reactstarter.com/c/2.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/c/3"><img src="https://reactstarter.com/c/3.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/c/4"><img src="https://reactstarter.com/c/4.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/c/5"><img src="https://reactstarter.com/c/5.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/c/6"><img src="https://reactstarter.com/c/6.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/c/7"><img src="https://reactstarter.com/c/7.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/c/8"><img src="https://reactstarter.com/c/8.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/c/9"><img src="https://reactstarter.com/c/9.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/c/10"><img src="https://reactstarter.com/c/10.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/c/11"><img src="https://reactstarter.com/c/11.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/c/12"><img src="https://reactstarter.com/c/12.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/c/13"><img src="https://reactstarter.com/c/13.png" height="60" /></a>

## Need Help?

Our AI assistant is trained on this codebase — ask it anything on [ChatGPT](https://chatgpt.com/g/g-69564f0a23088191846aa4072bd9397d-react-starter-kit-assistant) or [Gemini](https://gemini.google.com/gem/1IXFElQ2UvvZY86iL6uZLeoC-r8mp-OB-?usp=sharing). Try these questions:

- [How do I add a new tRPC endpoint?](https://chatgpt.com/g/g-69564f0a23088191846aa4072bd9397d-react-starter-kit-assistant?prompt=How%20do%20I%20add%20a%20new%20tRPC%20endpoint%3F)
- [Help me create a database table](https://chatgpt.com/g/g-69564f0a23088191846aa4072bd9397d-react-starter-kit-assistant?prompt=Help%20me%20create%20a%20database%20table)
- [How does authentication work?](https://chatgpt.com/g/g-69564f0a23088191846aa4072bd9397d-react-starter-kit-assistant?prompt=How%20does%20authentication%20work%3F)
- [Explain the project structure](https://chatgpt.com/g/g-69564f0a23088191846aa4072bd9397d-react-starter-kit-assistant?prompt=Explain%20the%20project%20structure)
- [How do I deploy to Cloudflare?](https://chatgpt.com/g/g-69564f0a23088191846aa4072bd9397d-react-starter-kit-assistant?prompt=How%20do%20I%20deploy%20to%20Cloudflare%3F)
- [Add a new page with routing](https://chatgpt.com/g/g-69564f0a23088191846aa4072bd9397d-react-starter-kit-assistant?prompt=Add%20a%20new%20page%20with%20routing)
- [How do I send emails?](https://chatgpt.com/g/g-69564f0a23088191846aa4072bd9397d-react-starter-kit-assistant?prompt=How%20do%20I%20send%20emails%3F)

## Contributing

See the [Contributing Guide](.github/CONTRIBUTING.md) to get started. Check [good first issues](https://github.com/kriasoft/react-starter-kit/issues?q=label:"good+first+issue") or join [Discord](https://discord.gg/2nKEnKq) for discussion.

## License

Copyright © 2014-present Kriasoft. This source code is licensed under the MIT license found in the
[LICENSE](https://github.com/kriasoft/react-starter-kit/blob/main/LICENSE) file.

---

<sup>Made with ♥ by Konstantin Tarkus ([@koistya](https://twitter.com/koistya), [blog](https://medium.com/@koistya))
and [contributors](https://github.com/kriasoft/react-starter-kit/graphs/contributors).</sup>
