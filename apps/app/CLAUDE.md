## Architecture

This is a Single Page Application (SPA) and does not require Server-Side Rendering (SSR). All rendering is done on the client-side.

## Tech Stack

React 19, TypeScript, Vite, TanStack Router, shadcn/ui, Tailwind CSS v4, Jotai, Better Auth.

## Commands

- `bun --filter web dev` - Dev server
- `bun --filter web test` - Run tests
- `bun --filter web lint` - Lint code

## Structure

- `routes/` - Page components with file-based routing
- `components/` - Reusable UI components
- `lib/` - Utilities and shared logic
- `styles/` - Global CSS and Tailwind config

## Routing Conventions

### Route Groups

- `(app)/` - Protected routes requiring authentication
- `(auth)/` - Public authentication routes
- Parentheses create logical groups without affecting URLs

### Components

- Layout components use `<Outlet />` for nested routes
- Access route context directly via `Route.useRouteContext()`, not props
- Import route definitions for type-safe context access: `import { Route } from "@/routes/(app)/route"`

### Navigation

- Use `<Link>` from TanStack Router for internal routes
- Use `<a>` for external links or undefined routes
- Active styling via `activeProps` on `<Link>`

### Authentication

#### Core Decisions

- **Provider:** Better Auth (cookie-based sessions, OAuth, passkeys)
- **State:** TanStack Query wraps all auth calls via `useSessionQuery()` / `useSuspenseSessionQuery()`
- **Protection:** Routes validate auth in `beforeLoad` hooks, not components
- **Storage:** Server sessions only, no localStorage/sessionStorage

#### Implementation Rules

- Never use Better Auth's `useSession()` directly - use TanStack Query wrappers
- Route groups: `(app)/` = protected, `(auth)/` = public
- Auth checks validate both `session?.user` AND `session?.session` exist
- Session queries cached 30s, auto-refresh on focus/reconnect
- Invalidate session cache after login/logout for fresh data
- Auth errors (401/403) trigger redirects via error boundaries

#### Files

- `lib/auth.ts` - Better Auth client setup
- `lib/queries/session.ts` - TanStack Query session hooks
- `routes/(app)/route.tsx` - Protected route guard
- `components/auth/` - Auth UI components
