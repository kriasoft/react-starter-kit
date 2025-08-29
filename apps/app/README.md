# React Application

A modern single-page application built with [React 19](https://react.dev/) and [TanStack Router](https://tanstack.com/router), designed for building type-safe, performant user interfaces with an exceptional developer experience.

## Tech Stack

We're running [React 19](https://react.dev/) with [TanStack Router](https://tanstack.com/router) for type-safe routing, [Jotai](https://jotai.org/) for atomic state management, [shadcn/ui](https://ui.shadcn.com/) components styled with [Tailwind CSS v4](https://tailwindcss.com/), and [Better Auth](https://www.better-auth.com/) for authentication. The whole thing is bundled with [Vite](https://vitejs.dev/) because life's too short for slow builds.

### Why This Stack?

- **React 19**: The latest and greatest, with concurrent features that make your app feel snappy
- **TanStack Router**: Type-safe routing that catches broken links at compile time, not user complaint time
- **Jotai**: Bottom-up state management that scales from simple counters to complex application state
- **shadcn/ui**: Copy-paste components that you actually own, built on Radix UI primitives
- **Tailwind CSS v4**: Utility-first CSS with lightning-fast builds and zero runtime
- **Better Auth**: Modern authentication that doesn't make you want to cry
- **Vite**: Fast development server and optimized production builds
- **TypeScript**: Because runtime errors are so 2019

## Project Structure

```text
app/
├── components/           # Reusable UI components
│   ├── error.tsx           # Error boundary component
│   ├── layout.tsx          # Layout wrapper component
│   └── index.ts            # Component exports
├── lib/                  # Utility functions and configurations
│   ├── auth.ts             # Authentication setup
│   ├── routeTree.gen.ts    # Generated route tree (auto-generated)
│   ├── store.ts            # Jotai atoms and global state
│   └── utils.ts            # Utility functions
├── public/               # Static assets
│   ├── favicon.ico         # App favicon
│   └── site.manifest       # PWA manifest
├── routes/               # Page components and route definitions
│   ├── __root.tsx          # Root layout component
│   ├── index.tsx           # Home page
│   └── about.tsx           # About page
├── styles/               # Global styles
│   └── globals.css         # Global CSS and theme variables
├── index.html            # HTML template
├── index.tsx             # Application entry point
├── global.d.ts           # TypeScript global declarations
├── tailwind.config.css   # Tailwind CSS v4 configuration
├── vite.config.ts        # Vite configuration
└── components.json       # shadcn/ui configuration
```

## Development

### Getting Started

```bash
# Install dependencies (from monorepo root)
bun install

# Start development server
bun app:dev
# or
bun --filter @repo/app dev

# Build for production
bun app:build
# or
bun --filter @repo/app build
```

The app will be available at `http://localhost:5173` (Vite's default port).

### Available Commands

```bash
# Development
bun dev                  # Start dev server with hot reload
bun build                # Build for production to dist/
bun preview              # Preview production build locally
bun typecheck            # Run TypeScript type checking
bun lint                 # Lint code with ESLint

# Testing
bun test                 # Run tests
bun test:watch           # Run tests in watch mode
bun test:coverage        # Generate coverage report
```

## Routing with TanStack Router

### File-Based Routing

Routes are defined in the `routes/` directory using TanStack Router's file-based routing:

```typescript
// routes/dashboard.$orgId.tsx
export const Route = createFileRoute("/dashboard/$orgId")({
  component: Dashboard,
  loader: async ({ params }) => {
    // Pre-load data before component renders
    return await fetchOrganization(params.orgId);
  },
  validateSearch: z.object({
    tab: z.enum(["overview", "members", "settings"]).optional(),
  }),
});
```

### Route Organization

- `routes/__root.tsx` - Root layout with navigation and error boundaries
- `routes/index.tsx` - Landing page
- `routes/about.tsx` - About page
- `routes/(auth)/` - Authentication group (login, signup, forgot password)
- `routes/(dashboard)/` - Dashboard group (protected routes)

### Navigation

```tsx
import { Link, useNavigate } from "@tanstack/react-router";

// Declarative navigation
<Link to="/dashboard/$orgId" params={{ orgId: "123" }}>
  Dashboard
</Link>;

// Programmatic navigation
const navigate = useNavigate();
navigate({ to: "/dashboard/$orgId", params: { orgId: "123" } });
```

## State Management with Jotai

### Creating Atoms

```typescript
// lib/store.ts
import { atom } from "jotai";

// Simple atom
export const countAtom = atom(0);

// Derived atom
export const doubleCountAtom = atom((get) => get(countAtom) * 2);

// Async atom
export const userAtom = atom(async () => {
  const response = await fetch("/api/user");
  return response.json();
});
```

### Using Atoms in Components

```tsx
import { useAtom } from "jotai";
import { countAtom } from "@/lib/store";

function Counter() {
  const [count, setCount] = useAtom(countAtom);

  return <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>;
}
```

## UI Components

### Using shadcn/ui Components

We use the shared `@repo/ui` package for UI components:

```tsx
import { Button, Card, Dialog } from "@repo/ui";

function MyComponent() {
  return (
    <Card>
      <Button variant="primary" size="lg">
        Click me
      </Button>
    </Card>
  );
}
```

### Adding New Components

```bash
# Add a new shadcn/ui component to the shared package
bun ui:add dialog

# List available components
bun ui:list

# Install essential components
bun ui:essentials
```

## Styling with Tailwind CSS v4

### Configuration

The `tailwind.config.css` file uses the new CSS-based configuration:

```css
@import "tailwindcss";

/* Content paths */
@source "./routes/**/*.{ts,tsx}";
@source "./components/**/*.{ts,tsx}";
@source "../../packages/ui/components/**/*.{ts,tsx}";

/* Custom dark mode variant */
@custom-variant dark (&:is(.dark *));

/* Theme configuration */
@theme inline {
  --color-primary: var(--primary);
  --color-background: var(--background);
  /* ... more theme tokens */
}
```

### Theme System

Our design system uses CSS custom properties:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  /* Light mode colors */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  /* Dark mode colors */
}
```

## Authentication

### Better Auth Setup

Authentication is configured in `lib/auth.ts`:

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
});

export const { useSession, signIn, signOut, signUp } = authClient;
```

### Protected Routes

```typescript
// routes/(dashboard)/_layout.tsx
export const Route = createFileRoute("/(dashboard)")({
  beforeLoad: async ({ context }) => {
    const session = await authClient.getSession();
    if (!session) {
      throw redirect({ to: "/login" });
    }
    return { session };
  },
});
```

## API Integration

### tRPC Client Setup

We use tRPC for end-to-end type safety:

```typescript
// lib/trpc.ts
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@repo/api";

export const api = createTRPCReact<AppRouter>();
```

### Using tRPC in Components

```tsx
function UserProfile() {
  const { data: user, isLoading } = api.user.me.useQuery();

  if (isLoading) return <Skeleton />;
  if (!user) return <div>User not found</div>;

  return <div>Welcome, {user.name}!</div>;
}
```

## Performance Optimization

### Code Splitting

Routes are automatically code-split by TanStack Router:

```typescript
// Lazy load heavy components
const Dashboard = lazy(() => import("./Dashboard"));

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});
```

### Image Optimization

```tsx
// Use optimized image loading
import { Image } from "@repo/ui";

<Image
  src="/hero.jpg"
  alt="Hero"
  loading="lazy"
  sizes="(max-width: 768px) 100vw, 50vw"
/>;
```

## Testing

### Unit Tests

```typescript
// components/Button.test.tsx
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

test("renders button with text", () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText("Click me")).toBeInTheDocument();
});
```

### Integration Tests

```typescript
// routes/Dashboard.test.tsx
import { render } from "@testing-library/react";
import { createMemoryRouter } from "@tanstack/react-router";

test("dashboard loads organization data", async () => {
  const router = createMemoryRouter({
    routes: routeTree,
    initialLocation: "/dashboard/123",
  });

  render(<RouterProvider router={router} />);
  // Test implementation
});
```

## Build & Deployment

### Production Build

```bash
bun build
```

This creates an optimized build in `dist/` with:

- **Minified code** for smaller bundle sizes
- **Asset hashing** for optimal caching
- **Tree shaking** to remove unused code
- **Code splitting** for faster loading

### Environment Variables

```bash
# .env.local
VITE_API_URL=http://localhost:3000
VITE_APP_NAME="My App"
VITE_PUBLIC_URL=http://localhost:5173
```

Note: Vite requires `VITE_` prefix for client-side variables.

## Troubleshooting

### Common Issues

**Build fails with TypeScript errors**

```bash
# Check types without building
bun typecheck
```

**Route not found**

- Verify file naming follows TanStack Router conventions
- Check that route exports are correct
- Ensure route tree is properly generated

**Styles not applying**

- Check that the class is included in Tailwind's content paths
- Verify CSS variables are defined
- Clear browser cache

**API calls failing**

- Ensure the API server is running
- Check environment variables
- Verify tRPC types are up to date

### Performance Issues

**Slow initial load**

- Check bundle size with `bun analyze`
- Implement route-based code splitting
- Lazy load heavy components

**Excessive re-renders**

- Use React DevTools Profiler
- Implement proper memoization
- Check Jotai atom dependencies

## Best Practices

### Component Guidelines

1. **Keep components focused** - single responsibility
2. **Use TypeScript** for all components
3. **Implement proper error boundaries**
4. **Add loading states** for async operations
5. **Consider accessibility** from the start

### State Management

1. **Keep atoms small and focused**
2. **Use derived atoms** for computed values
3. **Avoid prop drilling** with proper atom scope
4. **Clean up subscriptions** in useEffect

### Performance

1. **Lazy load routes** and heavy components
2. **Optimize bundle size** with tree shaking
3. **Use proper caching strategies**
4. **Implement virtual scrolling** for long lists

## Contributing

When adding new features:

1. **Follow existing patterns** for consistency
2. **Add proper TypeScript types**
3. **Include unit tests**
4. **Update documentation**
5. **Test accessibility**
6. **Verify mobile responsiveness**

Remember: The best code is the code that doesn't need to be written. The second best is code that's easy to delete. 🎯

## Resources

- [React 19 Documentation](https://react.dev/)
- [TanStack Router Documentation](https://tanstack.com/router)
- [Jotai Documentation](https://jotai.org/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs/v4-beta)
- [Better Auth Documentation](https://www.better-auth.com/)
- [Vite Documentation](https://vitejs.dev/)
- [tRPC Documentation](https://trpc.io/)

---

> _"Any fool can write code that a computer can understand. Good programmers write code that humans can understand."_ 💡  
> — Martin Fowler
