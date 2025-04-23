# React App

This directory contains the frontend application for the React Starter Kit. It is built with React 19 and TanStack Router, providing a foundation for building type-safe and performant user interfaces.

## Architecture Overview

We're running [React 19](https://react.dev/) with [TanStack Router](https://tanstack.com/router) for type-safe routing, [Jotai](https://jotai.org/) for atomic state management, [ShadCN UI](https://ui.shadcn.com/) components styled with [Tailwind CSS v4](https://tailwindcss.com/), and [Better Auth](https://www.better-auth.com/) for authentication. The whole thing is bundled with [Vite](https://vitejs.dev/) because life's too short for slow builds.

### Why This Stack?

- **React 19**: The latest and greatest, with concurrent features that make your app feel snappy
- **TanStack Router**: Type-safe routing that catches broken links at compile time, not user complaint time
- **Jotai**: Bottom-up state management that scales from simple counters to complex application state
- **ShadCN UI**: Copy-paste components that you actually own, built on Radix UI primitives
- **Tailwind CSS v4**: Utility-first CSS with lightning-fast builds and zero runtime
- **Better Auth**: Modern authentication that doesn't make you want to cry
- **Vite**: Fast development server and optimized production builds
- **TypeScript**: Because runtime errors are so 2019

## Project Structure

```
app/
├── components/           # Reusable UI components
│   ├── ui/                 # Basic UI primitives (buttons, inputs, etc.)
│   └── layout/             # Layout components (header, sidebar, etc.)
├── lib/                  # Utility functions and configurations
│   ├── auth.ts             # Authentication utilities
│   ├── routeTree.gen.ts    # Generated route tree for TanStack Router
│   ├── store.ts            # Jotai atoms and store logic
│   └── utils.ts            # General utilities
├── public/               # Static assets
├── routes/               # Page components and route definitions
│   ├── __root.tsx          # Root layout component
│   ├── index.tsx           # Home page
│   └── about.tsx           # About page
├── scripts/              # Scripts for UI components
├── styles/               # Global styles and theme configuration
├── index.html            # HTML template
├── index.tsx             # Main application entry point
├── tailwind.config.js    # Tailwind CSS configuration
└── vite.config.ts        # Vite configuration
```

## State Management Philosophy

### Jotai Atoms

We use [Jotai](https://jotai.org/) for state management because it's atomic, composable, and doesn't require boilerplate ceremonies:

```typescript
// Simple atom
const countAtom = atom(0);

// Derived atom
const doubleCountAtom = atom((get) => get(countAtom) * 2);

// Async atom
const userAtom = atom(async (get) => {
  const userId = get(userIdAtom);
  return api.user.me.query();
});
```

## Routing Architecture

### TanStack Router Setup

Our routing is fully type-safe with automatic code splitting:

```typescript
// Route definition
export const Route = createFileRoute("/dashboard/$orgId")({
  component: Dashboard,
  loader: async ({ params }) => {
    // Pre-load data before component renders
    return queryClient.ensureQueryData(organizationQuery(params.orgId));
  },
  validateSearch: z.object({
    tab: z.enum(["overview", "members", "settings"]).optional(),
  }),
});
```

### Route Organization

- **`routes/__root.tsx`**: Root layout with navigation and error boundaries
- **`routes/index.tsx`**: Landing page
- **`routes/auth/`**: Authentication flows (login, signup, forgot password)
- **`routes/dashboard/`**: Main application views
- **`routes/settings/`**: User and organization settings

## Component Architecture

### UI Components (`components/ui/`)

ShadCN UI components that you can copy, paste, and own:

```typescript
// Button component with variants using Tailwind CSS
export function Button({
  variant = 'default',
  size = 'default',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
          'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground': variant === 'outline',
        },
        {
          'h-10 px-4 py-2': size === 'default',
          'h-9 rounded-md px-3': size === 'sm',
          'h-11 rounded-md px-8': size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
}
```

### Layout Components (`components/layout/`)

Structural components for consistent layouts:

- **`AppLayout`**: Main application shell
- **`AuthLayout`**: Authentication page wrapper
- **`DashboardLayout`**: Dashboard-specific layout with sidebar

### Feature Components

Domain-specific components that combine UI primitives:

- **`UserProfile`**: User profile management
- **`OrganizationSettings`**: Organization configuration
- **`MemberList`**: Team member management

## Development Workflow

### Local Development

```bash
# Start development server
bun --cwd app start

# Run type checking
bun --cwd app typecheck

# Run tests
bun --cwd app test

# Run tests in watch mode
bun --cwd app test --watch

# Lint code
bun --cwd app lint

# Build for production
bun --cwd app build
```

### Component Development

1. **Create component** in appropriate directory
2. **Add story** (if using Storybook)
3. **Write tests** for key functionality
4. **Export from index** for clean imports

### Adding New Pages

1. **Create route file** in `routes/` directory following TanStack Router conventions
2. **Define loader** for data fetching
3. **Add navigation** links where appropriate
4. **Test route** with different parameters and states

## API Integration

### tRPC Client Setup

We use tRPC for end-to-end type safety with our API:

```typescript
// lib/trpc.ts
import { createTRPCClient } from "@trpc/client";
import type { AppRouter } from "@root/api";

export const api = createTRPCClient<AppRouter>({
  url: "/api/trpc",
  // Additional configuration
});
```

### Data Fetching Patterns

```typescript
// In a component
function UserProfile() {
  const { data: user, isLoading } = api.user.me.useQuery();

  if (isLoading) return <Skeleton />;
  if (!user) return <div>User not found</div>;

  return <div>Hello, {user.name}!</div>;
}

// In a route loader
export const Route = createFileRoute('/profile')({
  loader: () => queryClient.ensureQueryData(userQuery),
  component: UserProfile,
});
```

## Styling & Theming

### Tailwind CSS v4 Configuration

Our styling is powered by Tailwind CSS v4 with full design system support:

```typescript
// Theme switching with Jotai and CSS variables
const themeAtom = atom<'light' | 'dark'>('light');

// Theme provider that updates CSS variables
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme] = useAtom(themeAtom);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <>{children}</>;
}
```

### Design System

We use CSS variables and Tailwind utilities for consistent theming:

```css
/* Global styles with CSS variables */
@theme {
  --color-primary: #0f172a;
  --color-primary-foreground: #f8fafc;
  --color-background: #ffffff;
  --color-foreground: #0f172a;
  --color-muted: #f1f5f9;
  --color-border: #e2e8f0;
  --radius: 0.5rem;
}

[data-theme="dark"] {
  --color-primary: #f8fafc;
  --color-primary-foreground: #0f172a;
  --color-background: #0f172a;
  --color-foreground: #f8fafc;
  --color-muted: #1e293b;
  --color-border: #334155;
}
```

### Component Styling

Components use Tailwind classes with the `cn()` utility for conditional styling:

```typescript
import { cn } from '@/lib/utils';

function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        className
      )}
      {...props}
    />
  );
}
```

## Authentication Flow

### Better Auth Integration

Authentication is handled through Better Auth with automatic token management:

```typescript
// hooks/useAuth.ts
export function useAuth() {
  const [session] = useAtom(sessionAtom);

  return {
    user: session?.user,
    isAuthenticated: !!session,
    login: (credentials) => authClient.signIn(credentials),
    logout: () => authClient.signOut(),
  };
}
```

### Protected Routes

Routes are automatically protected based on authentication state:

```typescript
export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/auth/login" });
    }
  },
  component: Dashboard,
});
```

## Performance Optimization

### Code Splitting

Automatic route-based code splitting with TanStack Router:

```typescript
// Routes are automatically split
const DashboardLazy = lazy(() => import("./Dashboard"));

export const Route = createFileRoute("/dashboard")({
  component: DashboardLazy,
});
```

### Bundle Analysis

```bash
# Analyze bundle size
bun --cwd app build && bun --cwd app analyze

# Check for unused dependencies
bun --cwd app depcheck
```

## Testing Strategy

### Component Testing

```typescript
// UserProfile.test.tsx
import { render, screen } from '@testing-library/react';
import { UserProfile } from './UserProfile';

test('displays user name', async () => {
  render(<UserProfile />, { wrapper: TestWrapper });

  expect(await screen.findByText(/hello/i)).toBeInTheDocument();
});
```

### Integration Testing

Test complete user flows including routing and API calls.

## Build & Deployment

### Production Build

```bash
bun --cwd app build
```

This creates an optimized build in the `dist/` directory with:

- **Minified code** for smaller bundle sizes
- **Asset hashing** for optimal caching
- **Tree shaking** to remove unused code
- **Code splitting** for faster loading

### Environment Configuration

Environment variables are managed through `.env` files:

```bash
# .env.local
VITE_API_URL=http://localhost:3000
VITE_APP_NAME="React Starter Kit"
```

## Troubleshooting

### Common Issues

**Build failures**: Check TypeScript errors and dependency versions

**Route not found**: Verify route file naming and exports

**tRPC errors**: Ensure API server is running and types are up to date

**Style issues**: Check Tailwind CSS configuration and CSS variables

### Performance Issues

**Slow initial load**: Check bundle size and lazy loading implementation

**Memory leaks**: Verify cleanup in useEffect hooks and subscriptions

**Re-renders**: Use React DevTools Profiler to identify unnecessary renders

## Best Practices

### Component Design

1. **Keep components focused** on single responsibilities
2. **Use TypeScript** for prop validation and documentation
3. **Implement proper error boundaries** for graceful failures
4. **Follow accessibility guidelines** with proper ARIA attributes
5. **Test user interactions** not implementation details

### State Management

1. **Keep atoms small** and focused
2. **Use derived atoms** for computed values
3. **Avoid prop drilling** by using appropriate state scope
4. **Cache expensive computations** with useMemo when needed

### Performance

1. **Lazy load routes** and heavy components
2. **Optimize images** with proper sizing and formats
3. **Use React.memo** judiciously for expensive components
4. **Implement virtualization** for long lists

## Package Exports

Clean imports thanks to our package.json exports:

```typescript
// Import utilities
import { cn, formatDate } from "@/lib/utils";

// Import components
import { Button, Card } from "@/components/ui";

// Import hooks
import { useAuth, useLocalStorage } from "@/hooks";
```

## Contributing

When adding new features:

1. **Follow existing patterns** for consistency
2. **Add proper TypeScript types** for everything
3. **Include tests** for new functionality
4. **Update documentation** if needed
5. **Consider accessibility** from the start
6. **Test on different screen sizes** and devices

Remember: Great UIs are like good typography - when done right, nobody notices. When done wrong, everybody complains. 😉

## Resources

- [React Documentation](https://react.dev/)
- [TanStack Router Documentation](https://tanstack.com/router)
- [Jotai Documentation](https://jotai.org/)
- [ShadCN UI Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Better Auth Documentation](https://www.better-auth.com/)
- [Vite Documentation](https://vitejs.dev/)
- [tRPC Documentation](https://trpc.io/)

---

> _The best user interface is the one that gets out of the user's way. 🧘_  
> — Ancient UX Proverb
