# React Application

Single-page application built with React 19, TanStack Router, Jotai, shadcn/ui, and Tailwind CSS v4.

[Documentation](https://reactstarter.com/frontend/routing) | [Getting Started](https://reactstarter.com/getting-started/quick-start)

## Development

```bash
bun app:dev       # Start dev server (http://localhost:5173)
bun app:build     # Build for production
bun app:deploy    # Deploy to Cloudflare Workers
```

## Structure

```bash
routes/           # File-based routes (TanStack Router)
components/       # Shared app components
lib/              # Auth client, tRPC client, Jotai atoms, utilities
styles/           # Global CSS and theme variables
```

Route tree is auto-generated in `lib/routeTree.gen.ts` -- do not edit manually.
