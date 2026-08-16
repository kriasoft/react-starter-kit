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
bun ui:update             # Re-fetch installed components
```

See [AGENTS.md](./AGENTS.md) for the conventions these commands assume.

## Structure

```bash
components/       # shadcn/ui components
hooks/            # Custom React hooks
lib/              # Utilities (cn function)
scripts/          # ui:add / ui:update and their postprocessing
index.ts          # Generated barrel export
```

Consuming apps must `@source` every directory here that holds class names, or those classes are stripped from their build. See [apps/app/tailwind.config.css](../../apps/app/tailwind.config.css) for an example.
