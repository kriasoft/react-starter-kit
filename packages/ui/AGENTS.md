shadcn/ui component library (new-york style, Radix primitives, Tailwind v4). Consumed as `@repo/ui`.

## Scope

- Only generic primitives belong here. If a component imports a route, a query, or the session, it belongs in `apps/app/components/` instead.
- Nothing here imports application or domain code (`apps/`, `db/`). Consumers still have to supply Tailwind `@source` entries and the theme tokens.
- Imports inside this package go through Node subpath imports — `#lib/utils`, `#components/toggle` — declared in `package.json#imports` and mirrored by the `components.json` aliases, so the CLI generates them natively. They resolve against _this_ package from every workspace; a `@/` alias would resolve through the consuming app instead and break any consumer without a matching file. Requires `moduleResolution: "bundler"`, which `packages/typescript-config/base.jsonc` already sets.
- `index.ts` exports the top-level primitives in `components/`. Nested files are implementation details — promote one deliberately if it should be public.

- `scripts/` is intentionally outside the tsconfig `include`. These are Bun CLI tools, while the library's declaration build uses the browser-only React preset (`types: ["vite/client"]`). Including them would require Bun/Node types and emit declarations for tooling. Both commands hit the network and overwrite files, so smoke-test changes on a single component (`bun ui:update button`).

## Adding and Updating Components

- Use `bun ui:add <component>`; don't hand-write files the registry already has. The wrappers take item names only and reject flags — they exist for reusable `registry:ui` primitives and always write to `packages/ui`. Blocks, pages, custom registries, and the read-only flags go to the CLI directly — point it at the workspace, or it resolves the wrong `components.json`: `bunx shadcn@latest add button --dry-run --cwd packages/ui`.
- Both run `scripts/postprocess.ts` afterwards: it strips `"use client"`, regenerates `index.ts`, and formats. `index.ts` is generated; add components with the CLI, not by editing it.
- Components import primitives from the unified `radix-ui` package, not the per-primitive `@radix-ui/react-*` ones. The CLI adds whatever a component needs; review and commit the resulting `package.json` and `bun.lock` changes.
- `bun ui:update` re-fetches every installed component in one `shadcn add` call, overwriting in place. Review `git diff` before committing; local edits are lost. Pass names (`bun ui:update button card`) to narrow it; unknown names are rejected rather than silently added, though a named component still pulls its registry dependencies.
- Registry output is not uniform — read what it generated. Postprocessing is mechanical; API changes still need review. `packages/ui` lints with `--max-warnings 0`, so convert React 18 patterns before committing:
  - `<Context.Provider value={x}>` → `<Context value={x}>` (`@eslint-react/no-context-provider`)
  - `React.useContext(C)` → `React.use(C)` (`@eslint-react/no-use-context`)
  - `React.ElementRef<T>` → `React.ComponentRef<T>` — `ElementRef` is a deprecated alias in `@types/react` 19. ESLint does not flag it; `bun --cwd apps/web check` reports it as a hint.
- `components.json` needs `tailwind.config: ""`. That empty string is how the CLI detects Tailwind v4; without it the registry silently serves the v3-era components (`forwardRef`, no `data-slot`) into a v4 project.

## Styling

- Every component accepts `className` and passes it through `cn()` last — directly, or via the `className` slot on a `cva` variants call — so callers can override defaults without a specificity fight.
- Use theme tokens (`bg-primary`, `text-muted-foreground`), never raw colors. Each consumer defines the values in its own `styles/globals.css` — `apps/app` and `apps/web` keep separate copies, so a palette change means editing both. `styles.css` here exists only to satisfy the shadcn CLI.
- Class names must appear as complete literals — Tailwind scans text, so `` `bg-${color}-500` `` produces nothing.
- Consuming apps must `@source` every directory here that holds class names, or those classes are stripped from their build.
- Enter/exit utilities (`animate-in`, `fade-in-0`, `zoom-in-95`, `slide-in-from-*`) come from `tw-animate-css`, which each consumer imports separately — `apps/app` does, `apps/web` does not, because nothing it renders is animated. Adding an animated component to a consumer that lacks the import fails silently: Tailwind does not recognise the class names, drops them, and reports nothing, so the component simply renders without transitions.

## Conventions

- Named exports only — no default exports.
- Variants via `class-variance-authority`; export the variants object when another component composes it (see `toggle.tsx` → `toggle-group.tsx`).
- Prefer a Radix primitive over hand-rolled behavior — it brings the ARIA roles and keyboard handling with it. `ToggleGroup type="single"` already renders `role="radiogroup"` with `role="radio"` items and arrow-key navigation, so callers add no keyboard code.
