# CI/CD

GitHub Actions automates building, testing, and deploying. The pipeline uses two workflows: `ci.yml` for the build and conditional deploys, and `deploy.yml` as a reusable deployment workflow.

## Pipeline Overview

```
Pull request → build + lint + test → deploy to preview
Push to main  → build + test       → deploy to staging
Manual dispatch (production)        → deploy to production
```

The `ci.yml` workflow runs a single **build** job, then conditionally triggers one of three **deploy** jobs depending on the event:

| Trigger             | Condition                         | Environment |
| ------------------- | --------------------------------- | ----------- |
| `pull_request`      | Any PR to `main`                  | Preview     |
| `push`              | Merge to `main`                   | Staging     |
| `workflow_dispatch` | Manual, `environment: production` | Production  |

## Build Job

The build job runs in every trigger scenario:

```yaml
# .github/workflows/ci.yml – build job (simplified)
steps:
  - uses: actions/checkout@v6
  - uses: oven-sh/setup-bun@v2
  - run: bun install --frozen-lockfile

  # Lint (PRs only – merged code was already checked)
  - run: bun prettier --check .
  - run: bun lint

  # Validate Terraform formatting
  - run: terraform fmt -check -recursive infra/

  # Build and test
  - run: bun email:build # Email templates (needed for types)
  - run: bun tsc --build # Type checking
  - run: bun run test -- --run # Vitest
  - run: bun --filter @repo/web build
  - run: bun --filter @repo/api build
  - run: bun --filter @repo/app build

  # Upload artifacts for deploy jobs
  - uses: actions/upload-artifact@v6
```

Concurrency is configured so only one run per PR or branch executes at a time, cancelling in-progress runs.

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
```

The deploy workflow downloads build artifacts and runs Wrangler deploy for each worker:

```yaml
# .github/workflows/deploy.yml (simplified)
steps:
  - uses: actions/checkout@v6
  - uses: actions/download-artifact@v6
  - uses: oven-sh/setup-bun@v2
  - run: bun install --frozen-lockfile
  # Deploy steps (wrangler deploy for api, app, web workers)
```

::: info
Deploy steps are currently scaffolded as TODO comments in the workflow. Uncomment the `wrangler deploy` commands once your Cloudflare infrastructure is provisioned.
:::

## Preview Deployments

Preview deploys use [pr-codename](https://github.com/kriasoft/pr-codename) to generate unique subdomains for each PR (e.g., `brave-fox.example.com`). The codename is stable across pushes to the same PR.

## Required Secrets

Configure these in your GitHub repository settings under **Settings → Secrets and variables → Actions**:

| Secret                 | Required | Description                               |
| ---------------------- | -------- | ----------------------------------------- |
| `CLOUDFLARE_API_TOKEN` | Yes      | API token with Workers deploy permissions |

Worker-level secrets (`BETTER_AUTH_SECRET`, Stripe keys, etc.) are set via `wrangler secret put` – not GitHub secrets. See [Cloudflare Workers: Secrets](/deployment/cloudflare#secrets).

## Additional Workflow

A separate `conventional-commits.yml` workflow validates PR titles against the [Conventional Commits](https://www.conventionalcommits.org/) spec using `amannn/action-semantic-pull-request`.
