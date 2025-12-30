# Infra

Terraform configuration for deploying to Cloudflare (edge) or GCP (hybrid).

## Design Goals

- **One obvious default:** Edge stack handles most SaaS apps with zero GCP overhead.
- **Stacks are composable:** Modules have no credentials; stacks wire them together.
- **State isolation:** Each `envs/<env>/<stack>` directory = one Terraform root = one state file.
- **Instant code deployments:** Terraform provisions infrastructure; Wrangler deploys code.

## Which Stack?

| Choose **edge** (default) | Choose **hybrid**                  |
| ------------------------- | ---------------------------------- |
| Most SaaS apps            | Need GCP services (Vertex AI, etc) |
| Fastest cold starts       | Require Cloud Run containers       |
| Minimal cost              | Need Cloud SQL (managed Postgres)  |
| Neon for database         | Already on GCP                     |

## Structure

```bash
infra/
  modules/         # Atomic resources (no credentials)
    cloudflare/
      worker/      # Worker resource (Beta API) - created without code
      hyperdrive/  # Database connection pooling
      dns/         # Proxied DNS records
  stacks/          # Composable architectures
    edge/          # Workers + Hyperdrive + DNS (routes via Wrangler)
    hybrid/        # Cloud Run + Cloud SQL + GCS (+ optional CF DNS)
  envs/            # Terraform roots (providers + backend + state)
    dev/edge/
    preview/edge/
    staging/edge/
    prod/edge/
  templates/       # Copy-paste templates for hybrid envs and remote state
```

## Quickstart (Edge Stack)

```bash
# Configure variables
cp infra/envs/dev/edge/terraform.tfvars.example infra/envs/dev/edge/terraform.tfvars
# Edit terraform.tfvars with your values

# 1. Provision infrastructure (workers, hyperdrive, DNS)
terraform -chdir=infra/envs/dev/edge init
terraform -chdir=infra/envs/dev/edge apply

# 2. Copy Hyperdrive ID to apps/api/wrangler.jsonc
terraform -chdir=infra/envs/dev/edge output hyperdrive_id

# 3. Deploy code + routes via Wrangler
bun api:deploy    # or: cd apps/api && bun wrangler deploy
bun app:deploy    # or: cd apps/app && bun wrangler deploy
bun web:deploy    # or: cd apps/web && bun wrangler deploy (includes routes)
```

Required variables: `cloudflare_api_token`, `cloudflare_account_id`, `project_slug`, `environment`, `neon_database_url`

Optional: `cloudflare_zone_id`, `hostname` (for custom domains)

Pass secrets via environment variables (recommended for CI/CD):

```bash
export TF_VAR_cloudflare_api_token="..."
export TF_VAR_neon_database_url="$DATABASE_URL"
terraform -chdir=infra/envs/dev/edge apply
```

## Hybrid Stack (GCP)

Copy the hybrid template and configure:

```bash
cp -r infra/templates/env-roots/hybrid infra/envs/prod/hybrid
# Edit terraform.tfvars with GCP credentials and settings
terraform -chdir=infra/envs/prod/hybrid init
terraform -chdir=infra/envs/prod/hybrid apply
```

## Remote State

By default, Terraform uses local state. For team collaboration, configure a remote backend:

```bash
# Edge stack (R2)
cp infra/templates/backend-r2.example.hcl infra/envs/prod/edge/backend.hcl
terraform -chdir=infra/envs/prod/edge init -backend-config=backend.hcl -migrate-state

# Hybrid stack (GCS)
cp infra/templates/backend-gcs.example.hcl infra/envs/prod/hybrid/backend.hcl
terraform -chdir=infra/envs/prod/hybrid init -backend-config=backend.hcl -migrate-state
```

## API Token Permissions (Cloudflare)

Terraform token (infrastructure):

- Zone:DNS:Edit
- Zone:Zone:Read
- Account:Workers Scripts:Edit
- Account:Cloudflare Hyperdrive:Edit

Wrangler token (code + routes deployment):

- Zone:Workers Routes:Edit
- Account:Workers Scripts:Edit

## Requirements

- Terraform >= 1.12
- Cloudflare provider >= 5.15.0 (for `cloudflare_worker` Beta resource)
- Cloudflare account (edge stack)
- GCP project (hybrid stack)

See `docs/specs/infra-terraform.md` for design details.
