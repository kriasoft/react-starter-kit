# @repo/ui

Reusable UI components for the React Starter Kit monorepo. Built with React 19, TypeScript, and Tailwind CSS because we believe in using components that actually work.

## What's Inside?

We're shipping [shadcn/ui](https://ui.shadcn.com/) components built on [Radix UI](https://radix-ui.com/) primitives, styled with [Tailwind CSS v4](https://tailwindcss.com/), and typed with TypeScript. Components that you can copy, paste, and actually own.

### Why This Approach?

- **Copy & Own**: No black-box component library dependencies
- **Radix UI Primitives**: Accessible components that work everywhere
- **Tailwind Styled**: Utility-first styling that's fast and predictable
- **TypeScript First**: Full type safety because runtime errors are so 2019
- **Monorepo Ready**: Share components across all apps without the headache

## Quick Start

```bash
# Install (happens automatically with bun install in root)
bun install

```

### Component Styling

Components use Tailwind classes with the `cn()` utility for conditional styling:

```typescript
import { cn } from "@repo/ui";

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

## Usage

```typescript
import { Button, Card, Input, cn } from "@repo/ui";

function MyComponent() {
  return (
    <Card>
      <Input placeholder="Type something..." />
      <Button variant="outline">Click me</Button>
    </Card>
  );
}
```

## Package Structure

```bash
packages/ui/
├── components/         # shadcn/ui components (the good stuff)
├── hooks/              # Custom React hooks (when we need them)
├── lib/                # Utilities (cn function and friends)
├── scripts/            # shadcn/ui component management utilities
├── index.ts            # Barrel exports for clean imports
└── components.json     # shadcn/ui configuration magic
```

## Import Strategies

### Barrel Imports (Easy Mode)

```typescript
import { Button, Card, Input, cn } from "@repo/ui";
```

### Direct Imports (Better for tree-shaking)

```typescript
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
```

Modern bundlers handle tree-shaking automatically, but direct imports guarantee minimal bundle size if you're obsessive about performance.

## Available Components

**Form Elements**: Button, Input, Textarea, Checkbox, Switch, Select, RadioGroup  
**Layout**: Card, Separator, ScrollArea  
**Feedback**: Skeleton

Each component comes with:

- Multiple variants and sizes
- Full TypeScript support
- Tailwind CSS styling
- Radix UI accessibility baked in

```typescript
// Button with all the variants you need
<Button variant="destructive" size="lg">Delete Everything</Button>
<Button variant="outline" size="sm">Maybe Don't</Button>

// Card with semantic structure
<Card>
  <CardHeader>
    <CardTitle>Something Important</CardTitle>
    <CardDescription>But not too important</CardDescription>
  </CardHeader>
  <CardContent>
    <p>The actual content</p>
  </CardContent>
</Card>
```

## Integration Setup

### Tailwind CSS v4 Configuration

Consuming apps **must** include UI package paths in their Tailwind CSS v4 config:

```css
/* apps/web/tailwind.config.css */
@import "tailwindcss";

/* Content paths for Tailwind to scan */
@source "./routes/**/*.{ts,tsx}";
@source "./components/**/*.{ts,tsx}";
/* Include UI components for Tailwind compilation */
@source "../../packages/ui/components/**/*.{ts,tsx}";
@source "../../packages/ui/lib/**/*.{ts,tsx}";
@source "../../packages/ui/hooks/**/*.{ts,tsx}";

/* Custom dark mode variant */
@custom-variant dark (&:is(.dark *));

/* Theme configuration */
@theme inline {
  /* Map CSS variables to Tailwind utilities */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  /* ... continue with other color mappings */
}
```

### TypeScript Paths

```json
{
  "compilerOptions": {
    "paths": {
      "@repo/ui": ["../../packages/ui"],
      "@repo/ui/*": ["../../packages/ui/*"]
    }
  }
}
```

## CSS Strategy

- **No CSS bundling**: This package ships TypeScript, not CSS
- **CSS Variables**: Components use `hsl(var(--primary))` for theming
- **App responsibility**: Consuming apps handle their own global styles and CSS variables

## Component Management Scripts

### Adding Components

```bash
# From project root
bun ui:add button               # Add a single component
bun ui:add button card          # Add multiple components
bun ui:essentials               # Install curated essential components

# From packages/ui directory
bun run add dialog
```

### Listing Components

```bash
bun ui:list                     # Show all installed components with metadata
```

### Updating Components

```bash
bun ui:update                   # Update all components to latest versions
bun ui:update button            # Update specific component
```

### Essential Components

The `ui:essentials` script installs a curated set of 37 components perfect for most applications:

- **Forms**: button, input, textarea, select, checkbox, radio-group, switch, label, form
- **Layout**: card, separator, skeleton, scroll-area
- **Navigation**: navigation-menu, breadcrumb, tabs
- **Feedback**: dialog, alert-dialog, toast, alert, badge, progress
- **Data Display**: avatar, tooltip, popover

```bash
bun ui:essentials --list        # Preview components without installing
bun ui:essentials               # Install all essential components
```

All scripts include:

- Automatic Prettier formatting after generation
- Progress indicators and clear success/error messages
- Built-in help with `--help` flag

## Internal Architecture

Components use `@/` aliases internally:

```typescript
// Inside components
import { cn } from "@/lib/utils";

// External apps import
import { Button } from "@repo/ui";
```

This keeps internal imports clean while maintaining external compatibility.

## Best Practices

### Component Design

1. **Keep components focused** on single responsibilities
2. **Use TypeScript** for prop validation and documentation
3. **Implement proper error boundaries** for graceful failures
4. **Follow accessibility guidelines** with proper ARIA attributes
5. **Test user interactions** not implementation details

### Performance

1. **Use React.memo** judiciously for expensive components
2. **Implement virtualization** for long lists
3. **Optimize re-renders** by memoizing callbacks and values
