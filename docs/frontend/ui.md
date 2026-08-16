# UI Components & Theming

The project uses [shadcn/ui](https://ui.shadcn.com/) (new-york style) with [Tailwind CSS v4](https://tailwindcss.com/) for styling. Shared components live in `packages/ui/` and are imported as `@repo/ui`.

## Where Components Live

There are two homes for components, and the split matters:

|  | `packages/ui/components/` | `apps/app/components/` |
| --- | --- | --- |
| What | shadcn/ui primitives – `Button`, `Card` | Product parts – `AuthForm`, `UserMenu` |
| Knows about | React, Radix, and styling utilities | Routes, queries, session, product rules |
| Maintained by | The shadcn CLI (`bun ui:add`) | You |
| Imported from | `@repo/ui` | `@/components/...` |

A component belongs in `packages/ui` only if it would still make sense in a different app. Anything that reaches for a route, a query, or the session belongs in `apps/app/components`.

## Adding Components

```bash
bun ui:add button              # Add a single component
bun ui:add dialog card select  # Add several at once
bun ui:update                  # Re-fetch installed components from the registry
bun ui:update button card      # Re-fetch selected components
```

Both take shadcn item names only and reject CLI options. They always write to `packages/ui` and postprocess afterwards, so the CLI's read-only flags would not stay read-only. To inspect without writing – or to pull in a block or a custom registry – use the CLI directly, pointing it at the workspace so it picks up the right `components.json`:

```bash
bunx shadcn@latest add button --dry-run --cwd packages/ui
```

`ui:update` refuses names that aren't installed, so a typo reports an error instead of quietly adding a component. It does not narrow what gets rewritten, though – registry items declare their own dependencies, so refreshing one component can rewrite the others it builds on. Read the diff, not the command.

Postprocessing strips the `"use client"` directive, regenerates `index.ts`, and formats the result. A newly added component is importable from `@repo/ui` straight away, and `index.ts` is generated output rather than a file you maintain.

::: warning

Review what the CLI generates. `bun ui:update` overwrites files in place, so local edits are lost – check `git diff` before committing. Postprocessing is mechanical; it does not touch component APIs. Registry output isn't uniform either: some components still emit `Context.Provider` and `useContext`, which this project's ESLint config rejects in favour of the React 19 forms (`<Context>` and `use()`).

:::

## Package Structure

```bash
packages/ui/
├── components/           # One file per component
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── hooks/
├── lib/
│   └── utils.ts          # cn() utility
├── scripts/              # ui:add / ui:update and their postprocessing
├── components.json       # shadcn CLI config – style, aliases, icon library
├── styles.css            # Exists for the shadcn CLI; real styles live in the app
├── index.ts              # Generated barrel export
└── package.json
```

Imports inside the package use Node subpath imports – `#lib/utils` for `cn`, `#components/toggle` for one component pulling in another. They're declared in `package.json`:

```jsonc
// packages/ui/package.json
"imports": {
  "#components/*": "./components/*.tsx",
  "#hooks/*": "./hooks/*.ts",
  "#lib/*": "./lib/*.ts"
}
```

and mirrored by the `components.json` aliases, so the shadcn CLI generates them natively. Unlike a `@/` alias, they resolve against `packages/ui` itself no matter which workspace imports the component, so the package needs no cooperation from the app consuming it. This requires `moduleResolution: "bundler"`, which the shared TypeScript preset already sets.

Components and `cn` are re-exported from the package root, so apps import from a single place:

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
import type { ReactNode } from "react";

type FeatureCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function FeatureCard({
  title,
  description,
  children,
}: FeatureCardProps) {
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

export function SaveButton({ isActive }: { isActive: boolean }) {
  return (
    <Button
      className={cn(
        "transition-colors",
        isActive && "bg-primary text-primary-foreground",
      )}
    >
      Save
    </Button>
  );
}
```

`tailwind-merge` resolves conflicts – later classes win, so `cn("p-4", "p-6")` produces `"p-6"`. That is what lets a `className` passed in from outside override a component's own defaults instead of fighting it on specificity.

## Theming

### CSS Variables

Theme colors are defined as CSS custom properties using the [OKLCH](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch) color space. Each app owns its own set — `apps/app/styles/globals.css` is shown here, and `apps/web` keeps a matching copy for the marketing site:

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

`apps/app/tailwind.config.css` maps these to Tailwind utilities via `@theme inline`, so `bg-primary`, `text-muted-foreground`, and the rest resolve to the variables automatically. To restyle the app, change the variables – every utility that references them follows.

Most tokens come in pairs: `--primary` is the surface, `--primary-foreground` is the text drawn on it. Change one and check the other still reads against it, and make the matching edit in both the `:root` and `.dark` blocks – a color that passes contrast on white rarely does on near-black.

### Dark Mode

Dark mode uses a custom Tailwind variant keyed on the `dark` class:

```css
/* apps/app/tailwind.config.css */
@custom-variant dark (&:is(.dark *));
```

`apps/app/lib/theme.tsx` owns that class. The user picks a `preference` – `light`, `dark`, or `system` – and the app renders the resolved `theme`, which is only ever `light` or `dark`:

```tsx
import { useTheme } from "@/lib/theme";

function ThemeButton() {
  const { theme, preference, setPreference } = useTheme();

  return (
    <button onClick={() => setPreference(theme === "dark" ? "light" : "dark")}>
      {preference === "system" ? `System (${theme})` : preference}
    </button>
  );
}
```

The preference and the resolved theme are backed by Jotai atoms rather than a bespoke React context, so `theme` stays a derived value instead of state somebody has to keep in step. The atoms are private – `useTheme()` is the only way app code reads or sets the theme, and it resolves against the `StoreProvider` at the root of `index.tsx` like every other atom in the app.

The preference is persisted to `localStorage` and synced across tabs by [`atomWithStorage`](https://jotai.org/docs/utilities/storage). `<ThemeSync />`, mounted in `apps/app/index.tsx`, mirrors the resolved theme onto `<html>`: the `dark` class, the `color-scheme` property (so scrollbars and native form controls match), and `<meta name="theme-color">` for mobile browser chrome, read from the `--theme-color` variable in `globals.css`.

An inline script in `apps/app/index.html` settles all three before first paint – without it, dark-mode users would see a white flash while the bundle loads. It duplicates a few lines of resolution logic on purpose, and it has to hardcode the two theme colors because no stylesheet is parsed that early. Its storage key and JSON encoding must match `theme.tsx`; its colors must match `--theme-color` in `globals.css`, as must `theme_color` in `public/site.manifest`.

The switcher itself is a `ToggleGroup` – single-select toggle groups already carry radio semantics and arrow-key navigation, so there is no keyboard handling to maintain by hand.

## Tailwind Content Scanning

Tailwind v4 finds classes by scanning the files listed with `@source`. Both the app and the shared package have to be listed, or classes used only inside `packages/ui` are dropped from the production build:

```css
/* apps/app/tailwind.config.css */
@import "tailwindcss";

@source "./lib/**/*.{js,ts,jsx,tsx}";
@source "./routes/**/*.{js,ts,jsx,tsx}";
@source "./components/**/*.{js,ts,jsx,tsx}";
@source "./index.html";
@source "./index.tsx";
@source "../../packages/ui/components/**/*.{ts,tsx}";
@source "../../packages/ui/lib/**/*.{ts,tsx}";
@source "../../packages/ui/hooks/**/*.{ts,tsx}";
```

Scanning is textual, so Tailwind only sees complete class names. `bg-red-500` is found; `` `bg-${color}-500` `` is not – map to whole class strings instead.

## Troubleshooting

**Import from `@repo/ui` fails.** Check the component is installed – `ls packages/ui/components`. If the file is there but missing from `index.ts`, the generation step failed rather than being skipped: both commands always regenerate the barrel, so re-read that command's output and `git diff`.

**Styles missing in the built app but fine in dev.** The class lives in a file no `@source` covers, or it is assembled by string interpolation. See [Tailwind Content Scanning](#tailwind-content-scanning).

**Nothing is styled at all.** `apps/app/index.tsx` must import `./styles/globals.css`.

**TypeScript can't resolve `@repo/ui`.** The consuming app needs both the path alias and the project reference in its `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": { "@repo/ui": ["../../packages/ui"] }
  },
  "references": [{ "path": "../../packages/ui" }]
}
```

## Resources

- [shadcn/ui Components](https://ui.shadcn.com/docs/components)
- [Radix UI Primitives](https://www.radix-ui.com)
- [Tailwind CSS v4](https://tailwindcss.com)
