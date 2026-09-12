# ADR-004 TypeScript 7 everywhere, except `astro check`

**Status:** Accepted

**Date:** 2026-09-11 **Tags:** typescript, toolchain, build

## Problem

- TypeScript 7 is the native compiler. At this migration a cold root `tsc --build` went from 6.5-8s to 1.5-2.5s, which changes what a pre-commit hook and a CI job can afford to run.
- The `typescript` package's main export is now a version stub, and the replacement `typescript/unstable/*` API has a different shape. Anything that does `require("typescript")` breaks – here, `typescript-eslint` and `@astrojs/check`. `tsserver` is gone in favour of an LSP server (`tsc --lsp`).
- Removed outright: `baseUrl`, `downlevelIteration`, `target: es5`, `moduleResolution: node10` and `classic`. `strict` is now on by default.

## Decision

- Every workspace compiles with TypeScript 7. The root `tsc --build` walks the project-reference graph and is the single source of type-checking truth; per-workspace `typecheck` scripts are a convenience that runs the same compiler.
- `apps/web` is the one exception. It declares `"typescript": "npm:@typescript/typescript6@~6.0.2"`, which pins the `typescript` that `@astrojs/check` resolves through its peer dependency to 6.x, keeping `astro check` – the only thing that type-checks `.astro` templates – working.
- The split is narrow and visible: `apps/web/worker.ts` is still compiled by TypeScript 7 from the root build, and `apps/web` has no `typecheck` script of its own, so no file is checked by two compilers writing the same `.tsbuildinfo`.
- Editors move with it. `typescript.tsdk` configured VS Code's built-in extension, which loads `tsserver.js` – a file TypeScript 7 does not ship. `.vscode/` now recommends `TypeScriptTeam.native-preview` and points `js/ts.tsdk.path` at the same workspace install.
- ESLint is replaced by Oxlint rather than pinned to TypeScript 6; see [ADR-005](/adr/005-oxlint-oxfmt).

## Alternatives (brief)

- **Stay on TypeScript 6 until the 7.1 API lands** – keeps one compiler, but defers a migration that has to happen anyway.
- **Drop `astro check`** – removes the pin, and the only type checking `.astro` templates get. Four of the five `.astro` files are pages that import shared UI.
- **Run `@astrojs/language-server` directly with a TypeScript 6 path** – `@astrojs/check` only hard-codes `require.resolve("typescript")`; the underlying API takes a path. It works, but trades a one-line dependency alias for a wrapper script to maintain.

## Impact

- Positive: a full type-check is fast enough to run on every commit. The removed options and stricter defaults were already satisfied here.
- Negative/Risks: two TypeScript versions are installed, and `apps/web` resolves the older one – worth remembering when a type behaves differently in `astro check` than in `bun typecheck`. The pin goes once Astro supports the 7.1 API ([withastro/roadmap#1321](https://github.com/withastro/roadmap/discussions/1321)).
- The one source change TypeScript 7 forced: a Hono `.on()` handler returning `c.json(...)` on one branch and a `Promise<Response>` on the other no longer matches an overload; `async` collapses the union.

## Links

- Code/Docs: `packages/typescript-config/`, `apps/web/package.json`, [Announcing TypeScript 7.0](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)
- Related ADRs: [ADR-005](/adr/005-oxlint-oxfmt)
