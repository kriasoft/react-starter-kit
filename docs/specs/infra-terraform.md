# Infrastructure Terraform Specification

## Overview

Two deployment stacks with clear separation of concerns.

**Non-goals:** Multi-region orchestration, blue-green deployments, auto-scaling policies. These belong in CI/CD or dedicated tooling.

| Stack               | Components                                  | Use Case                |
| ------------------- | ------------------------------------------- | ----------------------- |
| **edge** (default)  | Hyperdrive, DNS (Workers via Wrangler)      | Most SaaS apps          |
| **hybrid** (opt-in) | Cloud Run, Cloud SQL, GCS + optional CF DNS | GCP services, Vertex AI |

## Directory Structure

```bash
infra/
  modules/           # Atomic resources (no credentials)
    cloudflare/
      hyperdrive/    # Database connection pooling
      r2-bucket/     # Object storage
      dns/           # Proxied DNS records
    gcp/
      cloud-run/     # Container deployment
      cloud-sql/     # Managed PostgreSQL
      gcs/           # Object storage

  stacks/            # Architectural compositions
    edge/            # Hyperdrive + DNS (Workers via Wrangler)
    hybrid/          # GCP + optional CF DNS

  envs/              # Terraform roots (providers + backend + state)
    dev/edge/
    preview/edge/
    staging/edge/
    prod/edge/

  templates/
    env-roots/hybrid/        # Copy to enable hybrid
    backend-r2.example.hcl   # Remote state for edge
    backend-gcs.example.hcl  # Remote state for hybrid
```

## Module Contract

Modules must NOT define `provider` blocks. Non-HashiCorp providers require `required_providers` to specify the source:

```hcl
# Cloudflare modules declare source only (no version):
terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
    }
  }
}
```

Version constraints live exclusively in env roots. This keeps modules reusable while centralizing version management.

## Provider Versions

Canonical versions (single source of truth):

| Provider   | Version        |
| ---------- | -------------- |
| terraform  | `>= 1.12, < 2` |
| cloudflare | `~> 5.0`       |
| google     | `~> 7.0`       |

## Design Decisions

### Explicit Roots Over Dispatcher

Each `(environment, stack)` pair gets its own Terraform root with isolated state.

```bash
terraform -chdir=infra/envs/prod/edge apply
```

**Why not a dispatcher?** A `variable "stack"` that switches configs:

- Destroys one stack when switching to another
- Requires separate backends anyway
- Creates awkward `module.edge[0].x` references

### No Backend by Default

Terraform uses local state when no backend is configured. Remote backends require pre-existing buckets and credentials.

**Rationale:** Zero-friction onboarding. Add remote backend when ready for team collaboration.

### Providers in Env Roots Only

Only env roots define `provider` blocks with credentials. Modules declare `required_providers` for source resolution only (no versions, no credentials).

**Rationale:** Keeps modules reusable. Version constraints and credentials stay in one place per environment.

### Preview Uses Edge Only

PR previews need fast spin-up and low cost. Cloudflare Workers: no cold starts, instant deploys, minimal cost.

## Secrets

```bash
# Via environment variables (CI/CD)
export TF_VAR_cloudflare_api_token="..."
terraform -chdir=infra/envs/prod/edge apply

# Or local terraform.tfvars (gitignored)
```

Mark sensitive variables:

```hcl
variable "cloudflare_api_token" {
  type      = string
  sensitive = true
}
```

## Switching to Remote Backend

### Edge Stack (R2)

```bash
cp infra/templates/backend-r2.example.hcl infra/envs/prod/edge/backend.hcl
terraform -chdir=infra/envs/prod/edge init -backend-config=backend.hcl -migrate-state
```

### Hybrid Stack (GCS)

```bash
cp infra/templates/backend-gcs.example.hcl infra/envs/prod/hybrid/backend.hcl
terraform -chdir=infra/envs/prod/hybrid init -backend-config=backend.hcl -migrate-state
```

## Multi-Region

Use separate roots: `envs/prod-eu/edge`, `envs/prod-us/edge`. Each manages its own state.

## Naming Conventions

### Resource values

Cloud resources use `{project_slug}-{environment}`; lowercase alphanumeric and hyphens only: `^[a-z0-9-]+$`.

### Resource identifiers

One simple set of rules:

1. Name the thing being created (provider-native noun, singular).

   ```hcl
   resource "cloudflare_hyperdrive_config" "hyperdrive" {}
   resource "cloudflare_r2_bucket"         "bucket"     {}
   resource "cloudflare_dns_record"        "record"     {}
   resource "google_cloud_run_v2_service"  "service"    {}
   resource "google_sql_database_instance" "instance"   {}
   ```

2. If you have multiples, suffix with the role.

   ```hcl
   resource "cloudflare_r2_bucket" "uploads" {}
   resource "cloudflare_r2_bucket" "backups" {}
   ```

3. Module names describe architectural role; resource names describe the concrete thing.

   ```hcl
   module "hyperdrive" {
     # contains: cloudflare_hyperdrive_config.hyperdrive
   }
   # → module.hyperdrive.id
   ```

## Known Limitations

### Hyperdrive Database URL Parsing

The hyperdrive module parses `database_url` via regex to extract individual connection parameters. This works reliably with Neon URLs (which use URL-safe generated credentials) but has limitations:

- Port must be explicitly specified (e.g., `:5432`)
- Credentials must not contain unencoded `@` or `:` characters
- Validation fails fast with a descriptive error message

For non-Neon databases with special characters in credentials, consider modifying the module to accept individual connection parameters instead.
