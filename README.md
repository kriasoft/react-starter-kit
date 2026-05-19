# Clara

Clara is a school routine assistant for fast classroom attendance, homework follow-up, pedagogical occurrence capture, coordination review, and assisted ActiveSoft launch.

The repository is currently a Clara-branded project built on a React/Cloudflare starter foundation. The foundation is useful: React 19, TanStack Router, Hono, tRPC, Better Auth, Drizzle, Neon PostgreSQL, React Email, Cloudflare Workers, VitePress docs, Bun, Vitest, ESLint, and Prettier are already wired. The Clara-specific school domain model and classroom workflows are the next engineering priority.

## Planning Docs

- [Product brief](./docs/product/index.md)
- [Roadmap and top five priorities](./docs/product/roadmap.md)
- [ActiveSoft integration boundary](./docs/integrations/activesoft.md)
- [Architecture decision records](./docs/adr/)
- [PRD](./prd.md)

## Current Technical Foundation

- **Frontend:** React 19, TanStack Router, TanStack Query, Jotai, Tailwind CSS v4, shadcn/ui
- **Marketing/docs:** Astro marketing site and VitePress documentation
- **Backend:** Hono, tRPC 11, Better Auth
- **Database:** Drizzle ORM, Neon PostgreSQL, Cloudflare Hyperdrive
- **Email:** React Email and Resend
- **Deployment:** Cloudflare Workers and Terraform
- **Testing/tooling:** Bun, Vitest, Happy DOM, ESLint, Prettier, TypeScript

## Monorepo Structure

```text
apps/
  web/       Astro marketing site and Cloudflare edge router
  app/       React SPA for the Clara application
  api/       Hono + tRPC API server
  email/     React Email templates
packages/
  ui/        shadcn/ui components
  core/      shared utilities
db/          Drizzle schemas and migrations
infra/       Terraform for Cloudflare/edge infrastructure
docs/        VitePress documentation, roadmap, integration notes, ADRs
```

## Local Development

Install dependencies:

```bash
bun install
```

Start all local servers:

```bash
bun dev
```

Default local URLs:

| App            | URL                     |
| -------------- | ----------------------- |
| React app      | <http://localhost:5173> |
| Marketing site | <http://localhost:4321> |
| API server     | <http://localhost:8787> |

If another process is already using `8787`, start with an alternate API port and point the Vite proxy at it:

```bash
PORT=8788 API_ORIGIN=http://localhost:8788 bun dev
```

## Verification

```bash
bun typecheck
bun run build
bun lint
bun test --run
bun docs:build
```

## Direction

Build Clara in this order:

1. Clara domain model and access boundaries.
2. Teacher class mode for attendance and homework.
3. Coordination review and safety gates.
4. Controlled AI after deterministic workflows exist.
5. Assisted ActiveSoft launch before API automation.

Automatic ActiveSoft occurrence writes are blocked until official endpoint documentation, token permissions, sandbox proof, and audit behavior are confirmed. The MVP should work with assisted launch.

## License

See [LICENSE](./LICENSE).
