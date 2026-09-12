# ADR-006 Internal imports use the `#` subpath convention

**Status:** Accepted

**Date:** 2026-09-11 **Tags:** typescript, modules, conventions

## Problem

- `packages/ui` addressed its own files with Node subpath imports (`#lib/utils`), while `apps/app` and `apps/web` used a `@/` alias that only exists inside a `tsconfig`. Two conventions for the same idea.
- The shared preset also mapped `@/*` to `apps/web/*` for every workspace, so a `@/` import from `apps/app` that missed the app's own `paths` would silently resolve into the marketing site.

## Decision

- `apps/app`, `apps/web` and `packages/ui` address their own files with `#`-prefixed subpath imports declared in `package.json` `imports`. The two apps use `"#*": "./*"`; `packages/ui` keeps its per-directory patterns, which the shadcn CLI mirrors through `components.json`. `apps/api`, `db`, `packages/core` and `scripts` use relative imports and are unchanged.
- `apps/app` also declares `"#*": ["./*"]` in its `tsconfig` `paths`. The duplication is not accidental: Rolldown resolves an `imports` target by probing for `.ts`/`.tsx`, while TypeScript requires the target to name an existing file and never probes. Neither accepts the other's form – TypeScript honours an array of fallback targets and Rolldown takes only the first – so no plain string or array satisfies both. `apps/web` needs only the `imports` entry, because its `.astro` and `.css` specifiers already carry their extension.
- Extensionless `#lib/…` specifiers therefore depend on a bundler. Native Node does not probe extensions for an `imports` target, so `apps/app` code is not runnable under bare `node` – it is a browser bundle, and its tests run through Vite. The workspaces that run directly on Bun or Node use relative imports.
- The repository-wide `@/*` mapping is removed from `packages/typescript-config/base.jsonc`.

## Alternatives (brief)

- **Keep `@/`** – works, but it is a tsconfig fiction with no meaning to any runtime. `#` is a real module-resolution feature that Node, Bun, Vite, Rolldown and TypeScript all implement, declared where the rest of the package's module contract already lives.
- **`"#/*": "./*"`, matching the literal `#/lib/...` spelling** – Node accepts it; Bun does not resolve it at all. `#lib/...` works everywhere.
- **Per-directory patterns in `apps/app`, as in `packages/ui`** – needs the extension in the target, and `components/` and `lib/` each hold a mix of `.ts` and `.tsx`, plus two `index` barrels.
- **A conditional `imports` map**, routing TypeScript through the `types` condition and everything else through `default` – removes the second declaration, and it works: `tsc --build`, the Vite build and the test suite all pass with the `tsconfig` entry deleted. Not adopted because the `types` branch has to enumerate every extension and barrel shape the app uses (`./*.ts`, `./*.tsx`, `./*/index.ts`, `./*/index.tsx`), so it needs editing whenever the layout grows. The pair of one-line mappings does not.

## Impact

- Positive: one convention across the repository, declared in `package.json` next to the rest of each package's module contract. A copied component cannot resolve into the wrong workspace.
- Negative/Risks: `apps/app` declares the same mapping in two files, which will drift if only one is edited – `tsconfig.json` carries the comment explaining the pair, since `package.json` cannot. An extensionless `#` specifier is bundler-only, so this convention does not suit a workspace that runs directly on Node.

## Links

- Code/Docs: `apps/app/package.json`, `apps/app/tsconfig.json`, `packages/ui/package.json`, [Node subpath imports](https://nodejs.org/api/packages.html#subpath-imports)
- Related ADRs: [ADR-004](/adr/004-typescript-7-native-compiler)
