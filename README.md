# React Starter Kit

<a href="https://github.com/kriasoft/react-starter-kit?sponsor=1"><img src="https://img.shields.io/badge/-GitHub-%23555.svg?logo=github-sponsors" height="20"></a>
<a href="https://discord.gg/2nKEnKq"><img src="https://img.shields.io/discord/643523529131950086?label=Chat" height="20"></a>
<a href="https://github.com/kriasoft/react-starter-kit/stargazers"><img src="https://img.shields.io/github/stars/kriasoft/react-starter-kit.svg?style=social&label=Star&maxAge=3600" height="20"></a>
<a href="https://twitter.com/koistya"><img src="https://img.shields.io/twitter/follow/koistya.svg?style=social&label=Follow&maxAge=3600" height="20"></a>

So, you want to build a modern web app but don't want to spend the next two weeks configuring everything? You've come to the right place. This React Starter Kit is a batteries-included, production-ready boilerplate that lets you skip the boring parts and get straight to building.

It's built on a modern, edge-first stack that's fast, type-safe, and frankly, a joy to work with. Whether you're building a weekend project or the next big thing, we've got your back.

## Features

- **Blazing Fast Everything**: Powered by [Bun](https://bun.sh/), from the backend server to the scripts. It's fast. Like, "go get a coffee and it's already done" fast.
- **Full-Stack Type Safety**: With [TypeScript](https://www.typescriptlang.org/) and [tRPC](https://trpc.io/), you can say goodbye to runtime errors. If it compiles, it works (usually).
- **Modern Frontend**: Built with [React 19](https://react.dev/), [TanStack Router](https://tanstack.com/router) for type-safe routing, and [Tailwind CSS v4](https://tailwindcss.com/) for styling. Your UI will be snappy and look good doing it.
- **Edge-First Architecture**: Deploy to [Cloudflare Workers](https://workers.cloudflare.com/) for incredible performance and scalability. Your app will be everywhere, all at once.
- **Database Included**: Comes with [Drizzle ORM](https://orm.drizzle.team/) and a pre-configured schema for multi-tenant applications. No more writing SQL by hand unless you really, really want to.
- **Top-Notch DX**: Pre-configured with ESLint, Prettier, and VSCode settings to keep your code clean and your team happy. Less arguing about tabs vs. spaces, more building cool stuff.

<a href="https://reactstarter.com/s/1"><img src="https://reactstarter.com/s/1.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/s/2"><img src="https://reactstarter.com/s/2.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/s/3"><img src="https://reactstarter.com/s/3.png" height="60" /></a>

---

This project was bootstrapped with [React Starter Kit](https://github.com/kriasoft/react-starter-kit).
Be sure to join our [Discord channel](https://discord.com/invite/2nKEnKq) for assistance.

## Directory Structure

`├──`[`api`](./api) — tRPC API server built with [Hono](https://hono.dev/)<br>
`├──`[`app`](./app) — Web application front-end built with [React](https://react.dev/) and [Tailwind CSS](https://tailwindcss.com/)<br>
`├──`[`core`](./core) — Shared code, types, and WebSocket logic used across the stack<br>
`├──`[`db`](./db) — Database schema, migrations, and seeds using [Drizzle ORM](https://orm.drizzle.team/)<br>
`├──`[`edge`](./edge) — Cloudflare Worker entry point for handling requests at the edge<br>
`├──`[`scripts`](./scripts) — Various build and automation scripts<br>
`├──`[`tsconfig.base.json`](./tsconfig.base.json) — The common/shared TypeScript configuration for the monorepo<br>
`└──`[`wrangler.jsonc`](./wrangler.jsonc) — Configuration file for Cloudflare Workers<br>

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Platform**: [Cloudflare Workers](https://workers.cloudflare.com/)
- **Frameworks**: [React 19](https://react.dev/), [Hono](https://hono.dev/)
- **API**: [tRPC](https://trpc.io/)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **Database**: [Drizzle ORM](https://orm.drizzle.team/) with [Cloudflare D1](https://developers.cloudflare.com/d1/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
- **State Management**: [Jotai](https://jotai.org/)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Tooling**: [Vite](https://vitejs.dev/), [Vitest](https://vitest.dev/), [TypeScript](https://www.typescriptlang.org/), [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)

## Requirements

- [Bun](https://bun.sh/) (v1.0 or newer)
- [VS Code](https://code.visualstudio.com/) editor with our [recommended extensions](.vscode/extensions.json)
- Optionally, the [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) for your browser.

## Getting Started

[Generate](https://github.com/kriasoft/react-starter-kit/generate) a new project
from this template, clone it, install project dependencies, update the
environment variables found in [`.env`](./.env) / [`.env.local`](./.env.local), and start hacking:

```bash
# Clone the repository
git clone https://github.com/kriasoft/react-starter-kit.git example
cd ./example

# Launch the front-end app
bun --cwd app start

# Launch the backend API server
bun --cwd edge build --watch
bun wrangler dev

# Migrate the database
bun --cwd db migrate
```

Your frontend will be running at <http://localhost:5173/>, and the backend API will be on the port from `wrangler dev` (usually 8787). Open the frontend URL in your browser to see the app in action.

## How to Deploy

Ensure that all the environment variables in `.env`/`.env.local` files and Wrangler configuration in `wrangler.json` file are up-to-date.

If you haven't done it already, push any secret values you may need to CF Workers
environment by running `bun wrangler secret put <NAME> [--env #0]`.

Finally build and deploy the app by running:

```
bun --cwd app build
bun --cwd edge build
bun wrangler deploy
```

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
