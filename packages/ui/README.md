# UI Components

Shared UI component library built on shadcn/ui (new-york style), Radix UI, and Tailwind CSS v4.

[Documentation](https://reactstarter.com/frontend/ui)

## Usage

```typescript
import { Button, Card, Input, cn } from "@repo/ui";
```

## Commands

```bash
bun ui:add <component>    # Add a shadcn/ui component
bun ui:list               # List installed components
bun ui:essentials         # Install curated essential set
```

## Structure

```bash
components/       # shadcn/ui components
hooks/            # Custom React hooks
lib/              # Utilities (cn function)
scripts/          # Component management tools
```

Consuming apps must include `@source "../../packages/ui/components/**/*.{ts,tsx}"` in their Tailwind config.
