# ADR-005 Oxlint and Oxfmt replace ESLint and Prettier

**Status:** Accepted

**Date:** 2026-09-11 **Tags:** toolchain, linting, formatting

## Problem

- `typescript-eslint` reads TypeScript's programmatic API, which TypeScript 7 replaced with an incompatible one ([ADR-004](/adr/004-typescript-7-native-compiler)). ESLint does not start on this repository: `ts-api-utils` throws reading `ts.TypeFlags.Intrinsic`. Keeping it means pinning the whole lint step to TypeScript 6.
- ESLint and Prettier were also the slowest checks in the repository.

## Decision

- Oxlint (`.oxlintrc.json`) replaces ESLint and Oxfmt (`.oxfmtrc.json`) replaces Prettier. Both are fast enough here to run over the whole tree at any time.
- `lint-staged` stays, for its semantics rather than its speed: Git commits the index, so a hook that reads the working tree would judge a partially staged file by edits that are not being committed. Both commands pass `--no-error-on-unmatched-pattern`, or a commit whose staged files are all ignored or unsupported exits non-zero with nothing to check.
- Oxlint enables the `correctness` category and adds four rules from outside it: `react/rules-of-hooks`, because a violation is a bug rather than a preference; `typescript/no-explicit-any` and `typescript/ban-ts-comment`, the two rules that hold the line `AGENTS.md` draws on precise types; and `typescript/no-require-imports`, because every workspace is `"type": "module"` and a `require()` is a break with the module system. Two baseline rules are customised: `react/react-in-jsx-scope` is off for the automatic JSX runtime, and `no-unused-vars` allows a leading `_` and the object-rest omission idiom.
- Coverage is deliberately narrower than the ESLint stack, not a port of it. Oxlint sorts rules by category, not by what an ESLint preset contained, so rules from `js.configs.recommended`, `typescript-eslint/recommended` and `@eslint-react/recommended-typescript` that fall outside `correctness` are off unless listed above. A starter kit owes downstream projects a predictable baseline they can widen.
- Oxfmt preserves the formatting contract the repository already had, so the switch produced no formatting diff; `.oxfmtrc.json` holds only the departures from Oxfmt defaults, each with its reason. It honours `// prettier-ignore`; the repository writes `// oxfmt-ignore`.

## Alternatives (brief)

- **Keep ESLint on TypeScript 6 via an alias** – pins the linter to the compiler the project is leaving, and keeps the slow path.
- **Biome** – one binary for both jobs, but not a Prettier drop-in. Oxfmt reproduced Prettier's output here exactly, which settled it.
- **Formatter only, no linter** – `tsc` catches most of what `correctness` catches, but not the React rules, and one of those found a ref written during render in this very migration.

## Impact

- Positive: the whole ESLint and Prettier dependency stack is gone. Oxfmt covers `.ts`, `.tsx`, `.json`, `.jsonc`, `.md`, `.yml` and `.css`.
- Negative/Risks: `@eslint-react`'s `no-context-provider`, `no-use-context` and `web-api-no-leaked-*` rules have no Oxlint equivalent – `<Context.Provider>` and `useContext` in shadcn CLI output are now a review step (`packages/ui/AGENTS.md`), and an effect that leaks a listener, interval or observer is no longer flagged. TypeScript rules Oxlint files under `suspicious` or `restriction`, such as `no-namespace`, are off. ESLint plugins do not port.
- `.astro` is the weak spot: `astro check` types it, Oxlint sees only the frontmatter and cannot tell what the template consumes, the Astro extension formats it in the editor (`.vscode/settings.json` routes `[astro]` to it), and no repository command formats or lints its markup. Five files do not justify another tool.
- Oxfmt shares Prettier's blind spot for VitePress `:::` containers – a line adjacent to the opening marker is folded into it – so the rule in `AGENTS.md` still applies.

## Links

- Code/Docs: `.oxlintrc.json`, `.oxfmtrc.json`, `.husky/pre-commit`, [Oxc](https://oxc.rs/)
- Related ADRs: [ADR-004](/adr/004-typescript-7-native-compiler)
