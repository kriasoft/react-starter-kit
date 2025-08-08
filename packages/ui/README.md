# @repo/ui

Reusable UI components for the React Starter Kit monorepo. Built with React 19, TypeScript, and Tailwind CSS because we believe in using components that actually work.

## What's Inside?

We're shipping [ShadCN UI](https://ui.shadcn.com/) components built on [Radix UI](https://radix-ui.com/) primitives, styled with [Tailwind CSS v4](https://tailwindcss.com/), and typed with TypeScript. Components that you can copy, paste, and actually own.

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

```
packages/ui/
├── components/          # ShadCN UI components (the good stuff)
├── hooks/              # Custom React hooks (when we need them)
├── lib/                # Utilities (cn function and friends)
├── index.ts            # Barrel exports for clean imports
├── components.json     # ShadCN configuration magic
└── tailwind.config.js  # Tailwind theme and colors
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

### Tailwind Configuration

Consuming apps **must** include UI package paths in their Tailwind config:

```javascript
// apps/web/tailwind.config.js
export default {
  content: [
    "./routes/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    // Include UI components for Tailwind compilation
    "../../packages/ui/components/**/*.{ts,tsx}",
    "../../packages/ui/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // CSS variables for theming
      colors: {
        primary: "hsl(var(--primary))",
        destructive: "hsl(var(--destructive))",
        // ... other theme colors
      },
    },
  },
};
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

## Adding Components

```bash
cd packages/ui
bunx shadcn@latest add button card input  # Add specific components
# or
bunx shadcn@latest add --all              # Add all available components
```

ShadCN CLI automatically generates components with proper `@/` imports that resolve within the package.

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
