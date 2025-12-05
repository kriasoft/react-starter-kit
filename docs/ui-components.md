# UI Components

The project includes a powerful UI component management system built on top of [shadcn/ui](https://ui.shadcn.com/), providing beautiful, accessible, and customizable React components.

## Quick Start

Install essential components to get started quickly:

```bash
# Install 37 pre-selected essential components
bun ui:essentials
```

This installs the most commonly used components covering forms, layout, navigation, and feedback patterns.

## Component Management Commands

All UI component management is done through simple commands:

### Add Components

Install specific components from the shadcn/ui registry:

```bash
# Add single component
bun ui:add button

# Add multiple components
bun ui:add dialog card select

# Interactive mode - browse and select
bun ui:add
```

### List Installed Components

See what components are currently installed:

```bash
bun ui:list
```

This shows:

- Component names
- Installation status
- File locations
- Dependencies

### Update Components

Keep your components up-to-date with the latest versions:

```bash
# Update all installed components
bun ui:update

# Update specific components
bun ui:update button dialog

# Check for updates without installing
bun ui:update --dry-run
```

### Install Essential Components

Quick setup with carefully selected components:

```bash
bun ui:essentials
```

This installs 37 components including:

**Forms & Inputs**

- Button, Input, Label, Textarea
- Select, Checkbox, Radio Group, Switch
- Form (with react-hook-form integration)

**Layout & Navigation**

- Card, Tabs, Accordion
- Navigation Menu, Breadcrumb
- Separator, Scroll Area

**Feedback & Overlays**

- Alert, Toast, Badge
- Dialog, Sheet, Popover
- Tooltip, Alert Dialog

**Data Display**

- Table, Avatar, Progress
- Skeleton (loading states)

## Component Structure

Components are organized in the `packages/ui` workspace:

```bash
packages/ui/
├── components/          # Component files
│   ├── ui/              # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── index.ts         # Exports
├── lib/
│   └── utils.ts         # Shared utilities (cn function)
├── scripts/             # Management scripts
│   ├── add.ts           # Add components
│   ├── list.ts          # List components
│   ├── update.ts        # Update components
│   └── essentials.ts    # Install essentials
└── package.json
```

## Using Components

Import components from the shared UI package:

```tsx
// In apps/app/routes/example.tsx
import { Button, Card, Input } from "@repo/ui/components";
import { cn } from "@repo/ui/lib/utils";

export function ExampleRoute() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Example Form</h2>
      <div className="space-y-4">
        <Input placeholder="Enter your name" />
        <Button>Submit</Button>
      </div>
    </Card>
  );
}
```

## Customization

### Styling with Tailwind CSS v4

Components use Tailwind CSS v4 with CSS variables for theming:

```css
/* apps/app/styles/globals.css */
@layer theme {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    /* ... more variables */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode variables */
  }
}
```

### Extending Components

Create custom variants using the component's existing API:

```tsx
// Custom button variant
import { Button } from "@repo/ui/components";

export function GradientButton({ children, ...props }) {
  return (
    <Button
      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
      {...props}
    >
      {children}
    </Button>
  );
}
```

### Component Composition

Build complex UI by composing primitives:

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components";

export function FeatureCard({ title, description, action }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{/* Your content */}</CardContent>
      <CardFooter>
        <Button onClick={action}>Learn More</Button>
      </CardFooter>
    </Card>
  );
}
```

## Best Practices

### 1. Use the CN Utility

Always use the `cn` utility for conditional classes:

```tsx
import { cn } from "@repo/ui/lib/utils";

<Button
  className={cn(
    "transition-colors",
    isActive && "bg-blue-500",
    isDisabled && "opacity-50 cursor-not-allowed",
  )}
/>;
```

### 2. Maintain Consistency

- Use existing component variants when possible
- Follow the established naming conventions
- Keep custom styles in component files, not inline

### 3. Accessibility

All shadcn/ui components include:

- Proper ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- Focus management

### 4. Performance

- Components are tree-shakeable
- Use dynamic imports for heavy components
- Lazy load modals and overlays

```tsx
// Lazy load heavy components
const Dialog = lazy(() =>
  import("@repo/ui/components").then((m) => ({ default: m.Dialog })),
);
```

## Adding Custom Components

To add your own reusable components:

1. Create component in `packages/ui/components/custom/`:

```tsx
// packages/ui/components/custom/feature-card.tsx
export function FeatureCard({ ...props }) {
  // Component implementation
}
```

2. Export from index:

```tsx
// packages/ui/components/index.ts
export * from "./ui";
export * from "./custom/feature-card";
```

3. Use across apps:

```tsx
import { FeatureCard } from "@repo/ui/components";
```

## Theming

### Light/Dark Mode

The template includes automatic theme switching:

```tsx
// apps/app/components/theme-toggle.tsx
import { Button } from "@repo/ui/components";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? <Moon /> : <Sun />}
    </Button>
  );
}
```

### Custom Themes

Create custom themes by modifying CSS variables:

```css
/* Custom brand theme */
.theme-brand {
  --primary: 15 100% 50%;
  --primary-foreground: 0 0% 100%;
  /* ... more overrides */
}
```

## Component Documentation

For detailed documentation on each component:

- Visit [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)
- Check the TypeScript definitions for prop types
- Review example usage in `apps/app/routes/`

## Troubleshooting

### Component Not Found

If a component import fails:

```bash
# Verify installation
bun ui:list

# Reinstall if missing
bun ui:add [component-name]
```

### Style Conflicts

If styles aren't applying correctly:

1. Check Tailwind configuration includes the UI package:

```js
// apps/app/tailwind.config.js
export default {
  content: [
    "./index.html",
    "./routes/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/components/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
};
```

2. Ensure globals.css is imported:

```tsx
// apps/app/index.tsx
import "./styles/globals.css";
```

### TypeScript Errors

If TypeScript can't find component types:

```json
// apps/app/tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@repo/ui/*": ["../../packages/ui/*"]
    }
  }
}
```

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Component Examples](https://ui.shadcn.com/examples)
