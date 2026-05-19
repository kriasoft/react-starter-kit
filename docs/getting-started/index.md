---
outline: [2, 3]
---

# Introduction

Clara is a guided classroom routine assistant built on a production-ready React/Cloudflare starter foundation. The starter gives the project authentication, database migrations, email, edge deployment, and a modern React application shell; Clara still needs its school-domain model and classroom workflows.

## Who It's For

- **Teachers** who need fast classroom attendance, homework, and event capture
- **Coordination teams** that need review queues, safer text, and auditability
- **School leadership** that needs reliable pedagogical patterns without replacing ActiveSoft
- **Engineering** building a controlled PWA before AI, voice, WhatsApp, or ActiveSoft automation

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

## What's Included Today

- **Three Cloudflare Workers** – edge router, SPA, and API server connected via service bindings
- **Type-safe API** – tRPC procedures with Zod validation, shared types between frontend and backend
- **Multi-tenant auth** – email OTP, social login, passkeys, organizations with roles
- **Subscription billing** – Stripe checkout, webhooks, and plan management
- **Database toolkit** – Drizzle ORM schemas, migrations, seeding, and Hyperdrive connection pooling
- **Email system** – React Email templates with Resend delivery
- **Docs and decision records** – VitePress docs, product roadmap, ActiveSoft boundary, and ADRs

## How the Docs Are Organized

Start with the **[Product Brief](/product/)** and **[Roadmap](/product/roadmap)** before implementation. **[ActiveSoft Boundary](/integrations/activesoft)** records what is verified and what remains blocked. **[Architecture](/architecture/)** explains the worker model and request flow. Feature sections – [Frontend](/frontend/routing), [API](/api/), [Auth](/auth/), [Database](/database/), [Billing](/billing/) – still document the inherited starter subsystems and should be updated as Clara replaces generic surfaces.

Ready to start? Head to [Quick Start](./quick-start).
