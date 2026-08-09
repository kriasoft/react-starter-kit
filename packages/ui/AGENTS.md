shadcn/ui component library (new-york style, Radix primitives, Tailwind v4). Consumed as `@repo/ui`.

## Scope

- Only generic primitives belong here. If a component imports a route, a query, or the session, it belongs in `apps/app/components/` instead.
- Nothing here imports application or domain code (`apps/`, `db/`). Consumers still have to supply the pieces below: a `lib/utils` shim, Tailwind `@source` entries, and the theme tokens.
- `@/` is only safe for `@/lib/utils`. It resolves via each _consumer's_ tsconfig (both apps map `@/*` to their own root), and it works solely because every consumer keeps a `lib/utils` re-export shim. Keep that form — the CLI regenerates it, and rewriting it to `@repo/ui` creates a cycle.
- Import one component from another **relatively** (`./toggle`). The CLI emits `@/components/toggle`, which resolves into the consuming app and fails the build there — `apps/web` has no `components/toggle`. Fix it after every `bun ui:add`/`ui:update`.

- `scripts/` is intentionally outside the tsconfig `include`. These are Bun CLI tools, while the library's declaration build uses the browser-only React preset (`types: ["vite/client"]`). Including them would require Bun/Node types and emit declarations for tooling. Smoke-test changed commands deliberately; `bun ui:list` covers only the read-only inventory command.

## Adding and Updating Components

- Use `bun ui:add <component>`; don't hand-write files the registry already has. `bun ui:add` with no arguments prints help and exits non-zero.
- `bun ui:add` does NOT update `index.ts`. Add `export * from "./components/<name>";` yourself, or the import from `@repo/ui` won't resolve.
- The CLI installs any Radix packages the component needs. Review and commit the resulting `package.json` and `bun.lock` changes.
- `bun ui:update` overwrites every installed component in place. Review `git diff` before committing; local edits are lost.
- Registry output is not uniform — read what it generated. `packages/ui` lints with `--max-warnings 0`, so convert React 18 patterns before committing:
  - `<Context.Provider value={x}>` → `<Context value={x}>` (`@eslint-react/no-context-provider`)
  - `React.useContext(C)` → `React.use(C)` (`@eslint-react/no-use-context`)
  - `React.ElementRef<T>` → `React.ComponentRef<T>` — `ElementRef` is a deprecated alias in `@types/react` 19. ESLint does not flag it; `bun --cwd apps/web check` reports it as a hint.
- Strip the `"use client"` directive when it appears — no RSC here, so it is inert.
- `no-forward-ref` is off for this package — generated `forwardRef` usage is fine.

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
