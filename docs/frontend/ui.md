# UI

The project uses [shadcn/ui](https://ui.shadcn.com/) (new-york style) with [Tailwind CSS v4](https://tailwindcss.com/) for styling. Components live in `packages/ui/` and are shared across all apps in the monorepo.

## Component Management

Add components from the shadcn/ui registry:

```bash
# Add a single component
bun ui:add button

# Add multiple components
bun ui:add dialog card select

# Interactive mode – browse and select
bun ui:add

# List installed components
bun ui:list

# Update all installed components
bun ui:update
```

There are 14 components installed by default: avatar, button, card, checkbox, dialog, input, label, radio-group, scroll-area, select, separator, skeleton, switch, and textarea.

## Component Structure

Components are stored directly in `packages/ui/components/` – one file per component:

```bash
packages/ui/
├── components/
│   ├── avatar.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── ...
│   └── textarea.tsx
├── lib/
│   └── utils.ts          # cn() utility
├── scripts/              # CLI tooling (add, list, update)
├── index.ts              # Barrel export
└── package.json
```

All components and utilities are re-exported from the package root (`index.ts`), so importing is straightforward:

```tsx
import { Button, Card, CardHeader, CardTitle, Input, cn } from "@repo/ui";
```

## Using Components

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui";

function FeatureCard({ title, description, children }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
```

## The `cn()` Utility

Use `cn()` (from `clsx` + `tailwind-merge`) for conditional and merged class names:

```tsx
import { Button, cn } from "@repo/ui";

<Button
  className={cn(
    "transition-colors",
    isActive && "bg-primary text-primary-foreground",
    isDisabled && "opacity-50 cursor-not-allowed",
  )}
/>;
```

`tailwind-merge` resolves conflicts – later classes override earlier ones, so `cn("p-4", "p-6")` produces `"p-6"`.

## Theming

### CSS Variables

Theme colors are defined as CSS custom properties in `apps/app/styles/globals.css` using the [OKLCH](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch) color space:

```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  /* ... */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... */
}
```

These variables are mapped to Tailwind utilities in `apps/app/tailwind.config.css` via `@theme inline`, so `bg-primary`, `text-muted-foreground`, etc. resolve to the CSS variables automatically.

### Dark Mode

Dark mode uses a custom Tailwind variant that toggles on the `dark` class:

```css
/* apps/app/tailwind.config.css */
@custom-variant dark (&:is(.dark *));
```

### Customizing Colors

To change the color scheme, update the CSS variables in `globals.css`. The OKLCH values are independent – changing `--primary` automatically applies everywhere that uses `bg-primary`, `text-primary`, etc.

## Tailwind Content Scanning

The Tailwind config uses `@source` directives to scan both app code and the shared UI package:

```css
/* apps/app/tailwind.config.css */
@import "tailwindcss";

@source "./lib/**/*.{js,ts,jsx,tsx}";
@source "./routes/**/*.{js,ts,jsx,tsx}";
@source "./components/**/*.{js,ts,jsx,tsx}";
@source "../../packages/ui/components/**/*.{ts,tsx}";
@source "../../packages/ui/lib/**/*.{ts,tsx}";
@source "../../packages/ui/hooks/**/*.{ts,tsx}";
```

## Troubleshooting

### Component not found

If a component import fails, verify it's installed:

```bash
bun ui:list
bun ui:add [component-name]
```

### Styles not applying

1. Check that `globals.css` is imported in `apps/app/index.tsx`
2. Verify the Tailwind config includes `@source` paths for the UI package
3. Check that the component file exists in `packages/ui/components/`

### TypeScript errors

Ensure the workspace reference is set up:

```json
// apps/app/tsconfig.json
{
  "references": [{ "path": "../../packages/ui" }]
}
```

## Resources

- [shadcn/ui Components](https://ui.shadcn.com/docs/components)
- [Radix UI Primitives](https://www.radix-ui.com)
- [Tailwind CSS v4](https://tailwindcss.com)
