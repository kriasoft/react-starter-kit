# ADR-007 Oxfmt owns import order

**Status:** Accepted

**Date:** 2026-09-12 **Tags:** toolchain, formatting, conventions

## Problem

- Import order was owned by `"source.organizeImports": "explicit"` in `.vscode/settings.json`: applied per developer, only to files someone opened in VS Code, and never checked in CI. The result was real inconsistency, not a style preference – `apps/api/lib/app.ts` was sorted because someone edited it, while `packages/ui/components/button.tsx` had `react` out of order because it is shadcn CLI output nobody touched.

## Decision

- `sortImports` in `.oxfmtrc.json` sorts imports, with defaults and nothing else. Oxfmt already formats every file it owns in `bun run format`, checks them in CI, and checks the staged ones on commit, so import order costs no new dependency and no extra pass ([ADR-005](/adr/005-oxlint-oxfmt)).
- The VS Code code action is removed. `editor.defaultFormatter` is already `oxc.oxc-vscode`, so format-on-save keeps sorting.
- `internalPattern` is left at its default (`["~/", "@/", "#"]`), which puts `@repo/*` with the externals and `#*` in a group of its own. That distinction is the one [ADR-006](/adr/006-subpath-imports) draws: `@repo/ui` is another package, `#lib/…` is this package's own file.
- `sortSideEffects` is left off, its default. `db/scripts/seed.ts` imports `../drizzle.config` last to load environment variables before anything reads `DATABASE_URL`; sorting side-effect imports would move it.

## Alternatives (brief)

- **Keep the editor code action** – it is the problem: unenforced, and applied only to files a developer happens to open.
- **A lint rule** – Oxlint ships no `import/order`, so this means a second tool reporting what the formatter can already fix.
- **A wider `internalPattern`** – it matches literal prefixes, not globs, so `["@repo/"]` puts workspace packages in the same group as `#*` and loses the package-versus-own-file distinction above.

## Impact

- Positive: import order is deterministic, identical for every developer, and enforced by `bun run format:check`. The one-time reflow touched 74 files.
- Negative/Risks: `source.organizeImports` also deleted unused imports on save, which Oxfmt does not do. `no-unused-vars` in `.oxlintrc.json` still fails CI on one, so nothing slips through – it surfaces at commit or CI time rather than silently on save, and the diff shows what was removed.
- A tree-wide reflow conflicts with anything in flight. Import order carries no local identity, so a fork resolving it can take upstream's ordering wholesale.

## Links

- Code/Docs: `.oxfmtrc.json`, `.vscode/settings.json`, `AGENTS.md`, [Oxfmt](https://oxc.rs/docs/guide/usage/formatter)
- Related ADRs: [ADR-005](/adr/005-oxlint-oxfmt), [ADR-006](/adr/006-subpath-imports)
