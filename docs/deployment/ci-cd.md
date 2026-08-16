# CI/CD

GitHub Actions builds and verifies every change. Once deployment is enabled, a push to `main` releases to staging, and a manual dispatch releases `main` to production. The **application pipeline** is `ci.yml` for the build and its conditional deploy jobs, plus `deploy.yml` as the reusable release workflow. Infrastructure runs separately through `infra.yml`.

## Pipeline Overview

`ci.yml` runs one **build** job, followed by the applicable deploy job. Pull requests are verified but never deployed:

| Trigger | Condition | Deploys to |
| --- | --- | --- |
| `pull_request` | Any PR to `main` | Nothing |
| `merge_group` | Queued merge, if you enable a merge queue | Nothing |
| `push` | Any push to `main` | Staging |
| `workflow_dispatch` | Manual, `deploy_production` off | Nothing – build only |
| `workflow_dispatch` | Manual from `main`, `deploy_production` on | Production |

Deployment is **off until you turn it on**. Both deploy jobs require the `DEPLOY_ENABLED` repository variable to be `true`, so a fresh clone runs pure CI – no runner time spent on a release that cannot succeed, and no deployment records implying one happened. See [Enabling Deployments](#enabling-deployments).

A production run builds `main` as of the dispatch and releases that. Two consequences worth being precise about: it is not a promotion of the build staging is running – nothing carries a release identity between runs – and if the deploy waits behind an approval, it still ships the commit that was dispatched and tested, not wherever `main` has moved to since.

## Build Job

The build job runs for every trigger:

```yaml
# .github/workflows/ci.yml – build job (simplified)
steps:
  - uses: actions/checkout@... # v7.0.1
  - uses: oven-sh/setup-bun@... # v2.2.0
  - run: bun install --frozen-lockfile

  # Formatting and linting run for every trigger
  - run: bun prettier --check .
  - run: bun lint

  # Terraform fmt + validate for both roots, without credentials or state
  - uses: hashicorp/setup-terraform@... # v4.0.1
  - run: bun infra:check

  # Build and test
  - run: bun typecheck # tsc --build; apps/api references apps/email, so it builds too
  - run: bun --filter @repo/web check # .astro templates (tsc can't parse them)
  - run: bun run test -- --run # Vitest
  - run: bun --filter @repo/web build
  - run: bun --filter @repo/api build
  - run: bun --filter @repo/app build
  - run: bun docs:build # dead links, and errors VitePress only logs

  # Fails the run if a deployable directory is missing or empty
  - name: Verify build output
  # Only on runs that can deploy
  - uses: actions/upload-artifact@... # v7.0.1
```

The artifact carries what the deploy job consumes, which is not the same as everything the build produces: `apps/email/dist`, `apps/web/dist` and `apps/app/dist`. `apps/api` deploys from source – Wrangler bundles `worker.ts` – so it contributes no `dist` of its own, but it imports `@repo/email`, whose package exports resolve through `apps/email/dist`. Drop that directory and the deploy fails at bundling with `Could not resolve "@repo/email"`. The API's own `bun api:build` output targets the container image instead, so CI runs it as a compile check without shipping it.

Verifying and uploading are separate on purpose. When deployment is enabled, the upload runs only on deploy-capable runs – a push to `main` or a production dispatch – while the artifact contract itself is checked on every run, so a pull request that breaks it fails there rather than at the next release.

### Concurrency

A pull-request run supersedes the one already running. A push or manual run never does – it may already be midway through a release, staging or production, and cancelling it leaves the database migrated but the workers old, or the three workers on mixed versions:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.event_name }}-${{ github.event.pull_request.number || github.ref }}-${{ inputs.deploy_production && 'deploy' || 'check' }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}
```

Keying on the event keeps a manual production run and ordinary CI on `main` in separate groups, so a merge cannot cancel a production release. The `deploy`/`check` suffix separates the two things a manual dispatch can be – for pushes and pull requests it always resolves to `check`.

Not cancelling is not the same as queueing everything. GitHub keeps one pending run per group and replaces it with each newer one, which is the behaviour you want: if A is deploying when B and C merge, A finishes and C follows – deploying B on the way to C buys nothing. That is also why the suffix earns its keep: without it, a build-only dispatch would count as the same operation and evict a production release still waiting its turn.

## Release Workflow

`deploy.yml` is called by each deploy job with environment-specific inputs:

```yaml
# .github/workflows/ci.yml – deploy job example
deploy-staging:
  needs: [build]
  if: >-
    vars.DEPLOY_ENABLED == 'true' && github.event_name == 'push' && github.ref == 'refs/heads/main'
  uses: ./.github/workflows/deploy.yml
  with:
    environment: staging
    url: https://staging.example.com
  permissions:
    contents: read
```

`environment` and `url` are the only inputs, and `contents: read` has to be repeated: naming any permission drops every unnamed one to `none`, and a called workflow never holds more than its caller grants – omit it and `deploy.yml`'s checkout cannot read a private repository.

Three things are deliberately absent. A display-name input would be a second spelling of `environment` that nothing keeps in agreement – `name: Staging` alongside `environment: production` would read as staging while holding production's credentials. `deployments: write` is unnecessary, because naming `environment:` is what records the deployment and GitHub creates that object itself. And `secrets: inherit` would hand the called workflow every secret the caller can see, where naming an environment gives it exactly that environment's secrets.

### Release Order

One job, one order: preflight, migrations, then the three workers.

The preflight is everything checkable before the first mutation. The migration is the point of no return, so a missing credential, invalid Cloudflare authentication or a worker that does not bundle should be found before it, not after. Each step is also scoped with `env:` to no more than it needs, which makes the release read as a capability ladder:

| Step in `deploy.yml` | Cloudflare | Database | Changes |
| --- | --- | --- | --- |
| Preflight – credentials | ✓ | ✓ | nothing |
| Preflight – Cloudflare authentication | ✓ |  | nothing |
| Preflight – worker bundles |  |  | nothing |
| Run database migrations |  | ✓ | the schema |
| Deploy workers | ✓ |  | the three workers |

Three preflight steps rather than one because each needs strictly less than the last, and `env:` is what enforces it – as one step, every Wrangler process would inherit the database URL for no reason.

The bundle check is `wrangler deploy --dry-run`, which compiles each worker against its target environment without uploading or authenticating – hence no credentials in that step. The authentication check is `wrangler whoami --account "$CLOUDFLARE_ACCOUNT_ID" --json`, where `--json` is what makes an unauthenticated call exit non-zero instead of printing a friendly message.

That is authentication, not authorization: `whoami` cannot show whether the token carries `Workers Scripts Write`, so a valid token with too few permissions still fails at the deploy. Cloudflare's **Edit Cloudflare Workers** template grants what the deploy needs. The preflight never promises the deploys will succeed, only that they will not fail for a reason it could have found.

Both Wrangler steps derive their `--env` argument independently rather than passing one along, because the two environments are not spelled alike and the failure is silent:

```bash
# Production is the top-level config, selected with an empty environment;
# staging is named. Wrangler rejects `--env production`.
if [[ "$DEPLOY_ENV" == "production" ]]; then
  env_args=(--env "")
else
  env_args=(--env "$DEPLOY_ENV")
fi
```

Deriving it twice is deliberate: an empty `--env` selects production, so a value that went missing in transit would deploy it.

The migration step writes the secret to a file rather than exporting it:

```bash
env_file=".env.${DEPLOY_ENV}.local"
trap 'rm -f "$env_file"' EXIT
umask 077
printf 'DATABASE_URL=%s\n' "$DATABASE_URL" > "$env_file"
unset DATABASE_URL
bun run "db:migrate:${DEPLOY_ENV}"
```

That is because `drizzle.config.ts` [fails closed](/database/#environment-targeting) for staging and production – it reads that one file and refuses a `DATABASE_URL` inherited from the shell, so a stale exported value cannot migrate the wrong database. Writing the file satisfies that check with the single value the environment is allowed to see, and the `trap` removes it when the step exits. Give it Neon's **unpooled** connection string: migrations take DDL locks, and Hyperdrive is for the request path.

::: warning Migrations are additive by obligation

Migrations run _before_ the new workers, so the currently deployed workers keep serving traffic against the migrated schema. A rollback replaces workers but does not revert the schema.

Expand first – add the column, backfill it, ship code that reads both shapes – and contract in a later release. A migration that drops or renames something the running workers still use breaks production between the two steps.

:::

Worker order matters too: a service binding resolves its target by name at deploy time, so `api` and `app` have to exist before `web` binds to them. `web` also holds the public route, so flipping it last means user traffic moves only after the workers behind it are new.

The expand/contract rule applies to API responses as well, over a longer window than the deploy: every user still running the SPA they loaded an hour ago keeps calling the new API, and no deploy order reaches them. Add the new field, ship the clients that read it, drop the old shape in a later release.

Both rules exist because nothing in the release is atomic. Ordering narrows each window, but a failed step, a timeout or a lost runner can still stop it midway – what makes a partial release safe is that each step survives on its own.

## Enabling Deployments

1. Provision infrastructure and rename the `example-*` placeholders in each `apps/*/wrangler.jsonc`. See [Cloudflare Workers](/deployment/cloudflare).
2. Replace the two `example.com` deployment URLs in `.github/workflows/ci.yml` – they are what each environment links to from the Deployments view.
3. Create the GitHub environments below and add their secrets.
4. Set the `DEPLOY_ENABLED` repository variable to `true`.

### Environments

Configure these under **Settings → Environments**. Application deployment and infrastructure use separate environments so a Cloudflare token and an HCP Terraform token are never reachable from the same job.

| Environment | Used by | Secrets | Protection |
| --- | --- | --- | --- |
| `staging` | `deploy.yml` | `CLOUDFLARE_API_TOKEN`, `DATABASE_URL` | Branch rule: `main` |
| `production` | `deploy.yml` | `CLOUDFLARE_API_TOKEN`, `DATABASE_URL` | Branch rule: `main`, required reviewers[^1] |
| `infra-staging-plan` | `infra.yml` plan job | `TF_API_TOKEN` (plan) | Branch rule: `main` |
| `infra-staging-apply` | `infra.yml` apply job | `TF_API_TOKEN` (write: staging) | Branch rule: `main` |
| `infra-production-plan` | `infra.yml` plan job | `TF_API_TOKEN` (plan) | Branch rule: `main` |
| `infra-production-apply` | `infra.yml` apply job | `TF_API_TOKEN` (write: production) | Branch rule: `main`, required reviewers[^1] |

[^1]: Required reviewers are not available everywhere – see [Required Reviewers](#required-reviewers).

#### Terraform Tokens

`TF_API_TOKEN` is one secret name holding **three different tokens**, from three HCP teams:

| HCP team | Workspace access | Used by |
| --- | --- | --- |
| `ci-plan` | Plan on staging **and** production | both `-plan` environments |
| `ci-staging-apply` | Write on staging only | `infra-staging-apply` |
| `ci-production-apply` | Write on production only | `infra-production-apply` |

The apply tokens must be split per workspace, or the production gate is decorative: a single apply token needs Write on both workspaces, so `infra-staging-apply` – which deliberately has no reviewer – would hold a credential that can apply production. A workflow edit naming the staging environment while pointing at the production root would then skip `infra-production-apply` entirely.

The plan token can be shared because it bypasses nothing: planning either environment is already a legitimate dispatch, so there is no gate in front of it. What the split does buy is that the credential reachable _before_ an approval cannot perform the apply. It is not a sandbox – HashiCorp is explicit that plan permission is equivalent to write from a malicious-code standpoint, because planning executes the configuration.

::: warning HCP Terraform Free has no team management

Team management requires Essentials or above; on Free you have only the owners team, and an owners token carries owner permissions. Putting one in the `-plan` environments would collapse all three identities into one and defeat the split.

Free is still fine for remote state and workspaces – just leave `TF_API_TOKEN` unset and run `bun infra:<environment> plan` and `apply` from a trusted machine instead. HCP Terraform Europe uses groups rather than teams; the topology is the same.

:::

Do not attach custom GitHub App deployment protection rules to the `-plan` environments: GitHub documents them as incompatible with the `deployment: false` those jobs set.

Store these as **environment** secrets, not repository secrets, and do not add repository-level fallbacks under the same names. That is what gives the branch rule any force: a protection rule only gates jobs that name the environment, and a manual dispatch runs the workflow definition from the ref it was given, so a branch can delete both the `main` check and the `environment:` line. A repository secret survives that edit; an environment secret does not, because removing `environment:` is what removes the access.

| Variable | Scope | Description |
| --- | --- | --- |
| `DEPLOY_ENABLED` | Repository | Set to `true` to enable both deploy jobs |
| `CLOUDFLARE_ACCOUNT_ID` | Repository | Target account – a multi-account token cannot infer it |

Repository scope is safe for both: an account identifier grants nothing on its own, and `DEPLOY_ENABLED` only decides whether jobs that still need environment credentials get to run.

| Secret | Description |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Cloudflare's **Edit Cloudflare Workers** API token template |
| `DATABASE_URL` | Unpooled Neon connection string for that environment's database |
| `TF_API_TOKEN` | HCP Terraform team token (group token on HCP Europe) |

Two kinds of credential deliberately never appear here. Terraform's own Cloudflare and database credentials are workspace variables in HCP Terraform, so they never reach GitHub – see [`infra/README.md`](https://github.com/kriasoft/react-starter-kit/blob/main/infra/README.md). Worker-level secrets (`BETTER_AUTH_SECRET`, `RESEND_API_KEY`, and any optional integrations) are set with `wrangler secret put` – see [Cloudflare Workers: Secrets](/deployment/cloudflare#secrets).

One limit worth stating plainly: with staging and production in the same Cloudflare account, the two `CLOUDFLARE_API_TOKEN` values are not a provider-level boundary. Worker uploads need account-scoped `Workers Scripts Write`, so the staging token is not intrinsically incapable of writing a production worker – a job naming the `staging` environment could target one without ever naming `production`.

What the environment split does buy is control over which database credential is reachable and which release path normally runs. Required reviewers protect the `production` _workflow path_, not the Cloudflare resource from the staging credential. Structural isolation of the workers themselves needs separate Cloudflare accounts, which is not the starter's default.

If you do use two accounts, move `CLOUDFLARE_ACCOUNT_ID` from a repository variable to an environment variable on `staging` and `production`. `deploy.yml` reads it from the `vars` context either way – naming the environment is what selects the value – so no workflow change is needed.

::: warning

Private repositories need Pro, Team or Enterprise for environments at all – see the matrix under [Required Reviewers](#required-reviewers). Without them there is no boundary to build, so do not fall back to repository secrets: run migrations and the `*:deploy` scripts from a trusted machine instead.

:::

### Required Reviewers

Check whether your repository can actually pause a job before you rely on it:

> If you are on a GitHub Free, GitHub Pro, or GitHub Team plan, required reviewers are only available for public repositories.

Environments and reviewers have different availability:

| Repository | Environments, secrets, branch rules | Required reviewers |
| --- | --- | --- |
| Public, any plan | Yes | Yes |
| Private, Free | No | No |
| Private, Pro or Team | Yes | No |
| Private, eligible Enterprise | Yes | Yes |

The two rows below "Public" fail in different ways, so they need different answers:

**Private on Pro or Team.** Everything here works except the pause. The gate silently does not exist rather than failing loudly – a production deploy runs immediately, and an infrastructure dispatch with **apply** on plans and then applies without stopping. Verify under **Settings → Environments → production** before treating it as real, then get the effect by hand:

- **Infrastructure** – dispatch with **apply** off, read the plan, and apply from a trusted machine with `bun infra:production apply`, which shows you the plan and prompts before touching anything.
- **Production deploys** – no automated gate is a reason to keep the manual dispatch, not to add one. The dispatch is the deliberate step.

**Private on Free.** This is not an ungated version of the same setup – without environments there is nowhere to put the credentials, so the workflows here cannot run a deploy at all. Leave `DEPLOY_ENABLED` unset and release from a trusted machine.

Where reviewers are available, also enable **Prevent self-review**. GitHub offers it precisely so the person who started a deployment cannot approve their own job, which is the difference between a review and a formality. If the approval is meant to be mandatory, deselect **Allow administrators to bypass configured protection rules** on `production` and `infra-production-apply` too – it is on by default, and while it is, the gate binds everyone except the people most able to route around it.

An approval can wait up to 30 days before GitHub fails the job. The production build artifact is retained for 31 days to cover that; a staging artifact expires the next day, since nothing gates it, and a saved Terraform plan after three.

Those retentions are requests, not guarantees – a workflow cannot ask for longer than the applicable repository, organization or enterprise policy allows, and a repository cannot always override a stricter parent. The default cap is 90 days; check yours under **Settings → Actions → General → Artifact and log retention**, or a late approval finds nothing to download.

## Infrastructure Workflow

`infra.yml` runs Terraform on manual dispatch only – application deploys never touch it. One dispatch produces a plan; with **apply** checked it then applies that same saved plan, pausing first where required reviewers are configured and supported:

```
plan (infra-<env>-plan)  →  approval (infra-<env>-apply)  →  apply
   terraform plan -out=tfplan         required reviewers        terraform apply tfplan
```

The approval step is only as real as your plan allows. On a private Pro or Team repository there is no reviewer pause and the apply follows the plan immediately; on a private Free repository this environment-secret workflow cannot run at all. See [Required Reviewers](#required-reviewers) before relying on it.

The plan job prints the plan to the run summary, so a reviewer approves output they have read rather than authorising a second run to compute a plan nobody has seen. Plans over 900 KB are truncated to fit GitHub's summary limit; when that happens the summary says so and the complete run in HCP Terraform is the thing to read, since the tail of a plan is where destroys tend to appear.

The saved plan travels between jobs as an artifact; with an HCP `cloud` block it is a reference to the run HCP is holding open, not the plan contents, so no state or variable values pass through GitHub. HCP discards the run if the workspace moves on, so a stale approval fails instead of applying something unexpected.

That artifact is kept for three days, which bounds how long the plan stays usable – long enough to survive a weekend or a time zone, short enough that nobody applies a plan they read last month. It is not an approval deadline: GitHub still offers the approval afterwards, and the job then fails when it cannot download the plan. Cancel that run and dispatch a fresh one. As with the build artifact, your Actions retention policy has to permit those three days.

The two environments exist for ordering. Protection rules gate _any_ job naming an environment, so a single environment would put the approval before the plan. The `-plan` environment therefore carries the branch rule but no reviewers, and sets `deployment: false` so planning does not record a deployment. It also holds the plan-only token, so the credential available before the approval cannot apply.

Leaving **apply** off gives a plan-only run. The apply job is also skipped when the plan reports no changes, so an unchanged environment never asks anyone to approve a no-op.

Both jobs are restricted to `main` – by a first-step check in the workflow and by each environment's deployment-branch rule, which is the half a branch cannot edit away. Plan included, for the reason [above](#terraform-tokens): HCP executes the configuration in the workspace's privileged run environment, so planning an unmerged branch runs it against that environment's real credentials and state. Branch-level feedback is `bun infra:check` in `ci.yml`, which needs no credentials.

## Pinned Actions

Every action is pinned to a commit SHA with the version in a trailing comment:

```yaml
- uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
```

A tag is mutable – its owner can move it to new code – so a commit SHA is the only reference that means the same thing tomorrow. That matters most in exactly these workflows, which hold deployment credentials.

Pins do not expire on their own, so `.github/dependabot.yml` includes the `github-actions` ecosystem: Dependabot reads the version comment and updates the SHA and the comment together, in one weekly grouped PR.

## Verifying a Pull Request

Pull requests are built, linted, type-checked and tested, but not deployed. A single shared preview environment would not give per-PR isolation – concurrent PRs overwrite each other and share one database – so it is not part of the default pipeline.

To look at a change running on Cloudflare before merging, upload a version against **staging** without moving any traffic onto it:

```bash
bun wrangler versions upload --config apps/web/wrangler.jsonc --env staging
```

Use `--env staging`, not the top-level config. The top level _is_ production, so a preview of it would carry production service bindings and a publicly reachable URL would serve production data.

Preview URLs are **off** by default here: `preview_urls` follows `workers_dev`, which is `false`. Opt in inside the staging environment only, so the switch cannot reach production:

```jsonc
// apps/web/wrangler.jsonc
"env": {
  "staging": {
    "preview_urls": true
  }
}
```

Once enabled, `versions upload` prints a URL for the new version. Its service bindings resolve to the already-deployed staging `app` and `api`, so a frontend change previews fully and a full-stack change only partly – the API half is whatever staging last deployed.

The environment has to exist first: Cloudflare documents that `versions upload` fails on a worker it would have to create, so deploy staging once with `bun wrangler deploy --config apps/web/wrangler.jsonc --env staging` before previewing against it.

## PR Title Check

`pr-title.yml` checks the pull request title against the [Conventional Commits](https://www.conventionalcommits.org/) spec using `amannn/action-semantic-pull-request`. The title, not the commits: with the repository configured for squash merging as below, that title becomes the commit title on `main`.

It runs on `pull_request_target`, which executes the workflow definition from the base branch and is the mode the action documents for pull requests from forks. That trigger deserves care, and it is safe here for two reasons that must both stay true: the job never checks out or executes the pull request's code, and its token is read-only.

### Repository Settings

The check assumes the PR title ends up as the commit title, which is a repository setting a clone does not inherit. If you want Conventional Commits on `main`, configure under **Settings → General → Pull Requests**:

- Enable squash merging. If Conventional Commits on `main` is meant to be an invariant rather than a habit, disable merge commits and rebase merging – otherwise any contributor can bypass the convention by choosing another method.
- Set the squash commit title to **Pull request title**.
- If you enable a merge queue, set its merge method to squash as well.

Which checks to require depends on whether you run a merge queue:

- **Without a merge queue** – require **Build** and **PR Title**. Every pull request gets both, so both can block a merge.
- **With a merge queue** – require **Build** only. A required check has to report on the `merge_group` event or the queue never completes, and `pr-title.yml` deliberately does not run there: a merge group can hold several pull requests and has no single title to validate. Requiring it would stall every merge.

Note that a required check is matched by job name alone – GitHub ignores which workflow produced it – so rename a job and any rule naming the old identity silently stops matching.

Under a merge queue the title check becomes advisory. To enforce the format itself, add a **Metadata restrictions** rule to a ruleset – but read it as the stricter option it is: GitHub applies commit metadata rules to _every commit on the branch_ when you squash merge, not just the squash commit GitHub creates. That holds contributors to a standard nothing in this repository lints locally.
