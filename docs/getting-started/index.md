---
outline: [2, 3]
---

# Introduction

React Starter Kit is a production-ready monorepo for building SaaS web applications. It wires together authentication, database migrations, billing, email, and edge deployment so you can skip months of boilerplate and focus on your product.

## Who It's For

- **Indie hackers** shipping an MVP fast
- **Startups** that need a solid foundation without vendor lock-in
- **Teams** building multi-tenant SaaS products

## Tech Stack

| Layer      | Technology                                                                                                                                                                                          |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime    | [Bun](https://bun.sh) 1.3+, TypeScript 5.9, ESM                                                                                                                                                     |
| Frontend   | [React](https://react.dev) 19, [TanStack Router](https://tanstack.com/router), [TanStack Query](https://tanstack.com/query), [Jotai](https://jotai.org), [Tailwind CSS](https://tailwindcss.com) v4 |
| UI         | [shadcn/ui](https://ui.shadcn.com) (new-york style)                                                                                                                                                 |
| Backend    | [Hono](https://hono.dev), [tRPC](https://trpc.io) 11                                                                                                                                                |
| Auth       | [Better Auth](https://www.better-auth.com/) – email OTP, passkeys, Google OAuth, organizations                                                                                                      |
| Billing    | [Stripe](https://stripe.com) subscriptions via Better Auth plugin                                                                                                                                   |
| Database   | [Neon](https://neon.tech) PostgreSQL, [Drizzle ORM](https://orm.drizzle.team)                                                                                                                       |
| Email      | [React Email](https://react.email), [Resend](https://resend.com)                                                                                                                                    |
| Deployment | [Cloudflare Workers](https://developers.cloudflare.com/workers/), Terraform                                                                                                                         |
| Testing    | [Vitest](https://vitest.dev) 4, Happy DOM                                                                                                                                                           |

## What's Included

- **Three Cloudflare Workers** – edge router, SPA, and API server connected via service bindings
- **Type-safe API** – tRPC procedures with Zod validation, shared types between frontend and backend
- **Multi-tenant auth** – email OTP, social login, passkeys, organizations with roles
- **Subscription billing** – Stripe checkout, webhooks, and plan management
- **Database toolkit** – Drizzle ORM schemas, migrations, seeding, and Hyperdrive connection pooling
- **Email system** – React Email templates with Resend delivery
- **AI-ready** – pre-configured instructions for Claude Code, Cursor, and Gemini CLI

## How the Docs Are Organized

**[Getting Started](/getting-started/quick-start)** covers setup and orientation. **[Architecture](/architecture/)** explains the worker model and request flow. Feature sections – [Frontend](/frontend/routing), [API](/api/), [Auth](/auth/), [Database](/database/), [Billing](/billing/) – document each subsystem. **[Recipes](/recipes/new-page)** provide step-by-step guides for common tasks. **[Deployment](/deployment/)** covers shipping to production.

Ready to start? Head to [Quick Start](./quick-start).
