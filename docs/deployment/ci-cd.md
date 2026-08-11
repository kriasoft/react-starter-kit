# CI/CD

GitHub Actions automates building and testing, and includes a disabled deployment scaffold. The **application pipeline** uses `ci.yml` for the build and its conditional deployment jobs, and `deploy.yml` as the reusable deployment workflow. Infrastructure runs separately through `infra.yml`.

## Pipeline Overview

The `ci.yml` workflow runs one **build** job, followed by the applicable environment-specific deploy job. Pull requests are verified but not deployed:

| Trigger | Condition | Environment |
| --- | --- | --- |
| `pull_request` | Any PR to `main` | None |
| `push` | Merge to `main` | Staging |
| `workflow_dispatch` | Manual from `main`, `deploy_production` checked | Production |

## Build Job

The build job runs in every trigger scenario:

```yaml
# .github/workflows/ci.yml – build job (simplified)
steps:
  - uses: actions/checkout@v6
  - uses: oven-sh/setup-bun@v2
  - run: bun install --frozen-lockfile

  # Formatting and linting run for every trigger
  - run: bun prettier --check .
  - run: bun lint

  # Terraform fmt + validate for both roots, without credentials or state
  - uses: hashicorp/setup-terraform@v4
  - run: bun infra:check

  # Build and test
  - run: bun typecheck # tsc --build; apps/api references apps/email, so it builds too
  - run: bun --filter @repo/web check # .astro templates (tsc can't parse them)
  - run: bun run test -- --run # Vitest
  - run: bun --filter @repo/web build
  - run: bun --filter @repo/api build
  - run: bun --filter @repo/app build

  # Upload artifacts for deploy jobs
  - uses: actions/upload-artifact@v6
    with:
      name: build
      path: |
        apps/email/dist
        apps/web/dist
        apps/app/dist
```

The artifact carries what the deploy job consumes, which is not the same as everything the build produces. `apps/api` deploys from source – Wrangler bundles `worker.ts` – so it contributes no `dist` of its own, but it imports `@repo/email`, whose package exports resolve through `apps/email/dist`. Drop that directory and the deploy fails at bundling with `Could not resolve "@repo/email"`. The API's own `bun api:build` output targets the container image instead, so CI runs it as a compile check without shipping it.

Concurrency cancels superseded pull-request and push runs for the same ref. Manual production runs are kept separate from pushes to `main` and never cancel in progress.

## Deploy Workflow

The reusable `deploy.yml` workflow is called by each deploy job with environment-specific inputs:

```yaml
# .github/workflows/ci.yml – deploy job example
deploy-staging:
  needs: [build]
  if: github.event_name == 'push' && github.ref == 'refs/heads/main'
  uses: ./.github/workflows/deploy.yml
  with:
    name: Staging
    environment: staging
    url: https://staging.example.com
  secrets: inherit
  permissions:
    contents: read
    deployments: write
```

Both permissions have to be listed here. Naming any permission drops every unnamed one to `none`, and a called workflow can never hold more than its caller grants – so omitting `contents: read` leaves the checkout inside `deploy.yml` unable to read a private repository.

The deploy workflow downloads build artifacts. Its Wrangler step is shown below but ships commented out; once enabled, it deploys each worker in this order:

```yaml
# .github/workflows/deploy.yml (simplified)
steps:
  - uses: actions/checkout@v6
  # `upload-artifact` roots the archive at the least common ancestor of its
  # paths – `apps/` – so restore it there, not at the workspace root.
  - uses: actions/download-artifact@v6
    with:
      name: build
      path: apps
  - uses: oven-sh/setup-bun@v2
  - run: bun install --frozen-lockfile
  # Deploy each worker. Production selects the top-level Wrangler config with
  # an empty environment; staging passes its name.
  - name: Deploy workers
    env:
      CLOUDFLARE_ACCOUNT_ID: ${{ vars.CLOUDFLARE_ACCOUNT_ID }}
      CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
      DEPLOY_ENV: ${{ inputs.environment }}
    run: |
      if [[ "$DEPLOY_ENV" == "production" ]]; then
        env_args=(--env "")
      else
        env_args=(--env "$DEPLOY_ENV")
      fi
      bun wrangler deploy --config apps/api/wrangler.jsonc "${env_args[@]}"
      bun wrangler deploy --config apps/app/wrangler.jsonc "${env_args[@]}"
      bun wrangler deploy --config apps/web/wrangler.jsonc "${env_args[@]}"
```

Order matters: a service binding resolves its target by name at deploy time, so `api` and `app` must exist before `web` binds to them.

::: warning

The `wrangler deploy` step in `deploy.yml` ships commented out. Uncomment it once your infrastructure is provisioned and the credentials below are set.

:::

## Verifying a Pull Request

Pull requests are built, linted, type-checked and tested, but not deployed. A single shared preview environment would not give per-PR isolation – concurrent PRs overwrite each other and share one database – so it is not part of the default pipeline.

To look at a change running on Cloudflare before merging, upload a version without promoting it to production traffic:

```bash
bun wrangler versions upload --config apps/web/wrangler.jsonc
```

Preview URLs are **off** in this starter kit: `preview_urls` defaults to whatever `workers_dev` is, and all three workers set `workers_dev: false`. Opt in per worker when you want one:

```jsonc
// apps/web/wrangler.jsonc
"preview_urls": true
```

Left disabled on purpose. A preview URL is publicly reachable, and a preview of the top-level `web` config still carries production service bindings – so an unlisted URL would serve production data.

Once enabled, `versions upload` prints a URL for the new version. Service bindings still resolve to the deployed `app` and `api` workers, so this previews frontend changes fully and full-stack changes only partly.

## Required Secrets and Variables

Configure these under **Settings → Secrets and variables → Actions**. Secrets are masked in logs; variables are not, which is why the Cloudflare account identifier is a variable rather than a secret.

Store both secrets as **environment** secrets on `staging` and `production` – not as repository secrets – and do not add repository-level fallbacks under the same names.

That is what gives the deployment-branch rule any force. A protection rule only gates jobs that name the environment, and a manual dispatch runs the workflow definition from the ref it was given, so a branch can delete both the `main` check and the `environment:` line. A repository secret survives that edit; an environment secret does not, because removing `environment:` is what removes the access.

| Secret | Used by | Description |
| --- | --- | --- |
| `CLOUDFLARE_API_TOKEN` | `deploy.yml` | Cloudflare's **Edit Cloudflare Workers** API token template |
| `TF_API_TOKEN` | `infra.yml` | HCP Terraform team token with Write access to both workspaces (group token on HCP Europe) |

| Variable | Used by | Description |
| --- | --- | --- |
| `CLOUDFLARE_ACCOUNT_ID` | `deploy.yml` | Target account – a multi-account token cannot infer it |

`CLOUDFLARE_ACCOUNT_ID` can stay a repository variable: an account identifier grants nothing on its own. Terraform needs no variables here at all – each root names its own HCP workspace, so staging and production reach different state by configuration rather than by environment wiring.

::: warning

Environments are a paid feature for private repositories; GitHub Free offers them on public repositories only. On a private Free repository there is no boundary to build, so do not put deployment credentials in the repository – run `bun infra:<environment> apply` and the `*:deploy` scripts from a trusted machine instead.

:::

Terraform's own Cloudflare and database credentials are workspace variables in HCP Terraform, so they are never stored in GitHub. See [`infra/README.md`](https://github.com/kriasoft/react-starter-kit/blob/main/infra/README.md).

Worker-level secrets (`BETTER_AUTH_SECRET`, `RESEND_API_KEY`, and any optional integrations) are set via `wrangler secret put` – not GitHub secrets. See [Cloudflare Workers: Secrets](/deployment/cloudflare#secrets).

## Infrastructure Workflow

`infra.yml` runs Terraform, on manual dispatch only – application deploys never touch it. Pick an environment and leave **apply** off for a plan-only run, then dispatch again with it on. Both dispatches must run from `main`, enforced by a check in the workflow and by the environment's deployment-branch rule – see [Required Secrets and Variables](#required-secrets-and-variables) for why the rule is the half that counts. Runs are serialised per environment. If an environment has required reviewers, they gate both dispatches because protection rules apply to any job naming it.

## Additional Workflow

A separate `conventional-commits.yml` workflow validates PR titles against the [Conventional Commits](https://www.conventionalcommits.org/) spec using `amannn/action-semantic-pull-request`.
