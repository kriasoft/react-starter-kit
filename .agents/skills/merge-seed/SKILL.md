---
name: merge-seed
description: Merge upstream React Starter Kit updates (the `seed` remote) into main, preserving this project's identity, scope, and behavior. Use when asked to sync, pull, or merge the seed / starter kit / upstream template.
---

# Merge seed updates

This project is a fork of React Starter Kit. `seed/main` is upstream; `main` is upstream plus this project's divergence. Syncing is a recurring operation.

## Core rule

**Upstream owns mechanism. This project owns identity and scope.**

Adopt from upstream: dependency and toolchain versions, build and config structure, framework API updates, refactors, newly required bindings and variables.

Keep local: names, domains, routes, worker and service identifiers; product copy and positioning; plans, features, scope; project-only integrations and config; deliberate additions and deletions.

When a hunk mixes both, take upstream's structure and reapply local values. **Never take a whole side merely to clear a conflict** — whole-file resolution is valid only where a rule below makes that side authoritative. The repository defines what counts as local identity and scope: `AGENTS.md`, `docs/adr/`, `docs/product/`, and the current config on `main`.

## Merge

```bash
git status --short   # must be clean

git remote get-url seed || git remote add seed https://github.com/kriasoft/react-starter-kit.git
git fetch seed

MB=$(git merge-base main seed/main)
git log --oneline "$MB..seed/main"   # read before resolving anything

git switch -c "chore/merge-seed-$(git rev-parse --short seed/main)" main
git -c merge.conflictStyle=zdiff3 merge --no-ff --no-commit --no-rerere-autoupdate seed/main
git diff --name-only --diff-filter=U   # unresolved conflicts
```

`--no-commit` stops git auto-committing a clean merge, so the commit and its subject are always ours to write. `--no-rerere-autoupdate` keeps every conflict in that list even when `rerere` has a recorded resolution to replay. If the branch already exists, an earlier sync was left unfinished — inspect it and resume or delete it deliberately, never force-reset over it.

`rerere` writes its replayed resolution straight into the working tree, so a conflicted file can arrive already looking finished. Treat pre-filled content as unreviewed; `git rerere forget <path>` to redo it.

In ordinary text conflicts `zdiff3` includes the merge base, which is how to tell deliberate local divergence from a line upstream simply changed. Where there is no usable inline base — binary, add/add, modify/delete — read the index stages instead: `git ls-files -u <path>` lists which exist, then `git show :1:<path>` base, `:2:` ours, `:3:` theirs. Only the sides that still have content are present, so add/add has no base and a modify/delete has no stage for the side that deleted. For an ambiguous hunk, read the commit behind it: `git log -p "$MB..seed/main" -- <path>`.

Resolve, stage each resolved path, then commit with the subject in **Land**.

## Resolution rules

- **Infra, Wrangler, Terraform** — keep local names, hostnames, zones, routes, IDs, and values; adopt upstream compatibility dates, new bindings, and newly required variables, then fill in local values.
- **Env files** — union: keep local values and project-only keys, add new upstream keys, and drop upstream-deleted keys only when the mechanism behind them is also gone.
- **Manifests** — adopt upstream versions and upstream's own scripts; keep project-only dependencies and scripts still in use; drop local entries an upstream migration made obsolete.
- **Lockfile** — never hand-merge: resolve every manifest first, take upstream's lockfile, then `bun install` and stage the regenerated result.
- **Product copy — marketing pages, docs** — local copy and positioning are authoritative; port only technical changes.
- **App and API code** — prefer upstream's refactor, then reapply local behavior on the new structure; a rewritten config or key list must still carry project-only keys.
- **Migrations** — a migration that may have run is immutable. Never resolve changes to one in place: if upstream modified it, escalate; otherwise keep local migration history and express incoming schema changes as new migrations.
- **ADRs** — local numbering is stable; renumber a colliding incoming ADR and fix its links.
- **Local deletion vs upstream edit, and upstream renames** — deliberate deletions stay deleted; follow renames, carrying local content to the new path.

Don't bring in upstream features that conflict with documented product scope.

## Verify

```bash
bun install --frozen-lockfile && bun typecheck && bun lint && bun run test -- --run && bun run build
```

`--frozen-lockfile` fails if the manifests and lockfile disagree, which is what verification should prove. Green checks are still necessary, not sufficient — they cannot see lost identity or copy. Compare the result against each endpoint, per conflicted file and overall:

```bash
git diff main..HEAD -- <path>        # upstream's mechanism, plus adaptations it forced
git diff seed/main..HEAD -- <path>   # the fork's divergence as it now stands
```

These are endpoint comparisons, not per-side attribution: a local value may legitimately move or change shape in the first diff when upstream restructures around it, and the second carries the fork's whole history, not just this merge. What matters is that every difference is explainable — upstream mechanism adopted, or local intent kept. An unexplainable one is a bad resolution.

Then confirm:

- no leftover conflict markers: `git diff --check main..HEAD | grep 'conflict marker'` — they survive in files no build step reads, such as env and docs
- no upstream branding, placeholder values, or template copy in changed files
- no local config or key silently dropped by an upstream refactor
- no stale paths or call sites left by an upstream rename
- `AGENTS.md` invariants still hold
- nothing unexpected in files that auto-merged (`git diff main..HEAD --stat`)

## Land

Commit subject `chore: merge seed up to <short-sha>`, notable resolutions in the body. Then, once verification passes:

```bash
git switch main && git merge --ff-only <branch> && git branch -d <branch>
```

If `--ff-only` is refused, `main` advanced during the merge: integrate the new `main` into the branch and re-verify before landing.

## Escalate

Stop and report — file, upstream intent, local intent, the open choice — instead of guessing, when upstream modifies a migration that may have run or changes live-data semantics, ships a feature against documented product scope, or when preserving both mechanism and local behavior is genuinely ambiguous.
