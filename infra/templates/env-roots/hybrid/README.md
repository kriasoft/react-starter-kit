# Hybrid Stack Root Template

Copy this directory to enable hybrid stack for an environment:

```bash
cp -r infra/templates/env-roots/hybrid infra/envs/<env>/hybrid
```

After copying:

1. Copy `terraform.tfvars.example` to `terraform.tfvars` and fill in values
2. Never commit secrets—use `TF_VAR_*` environment variables in CI

## Edge Routing (optional)

To add Cloudflare in front of Cloud Run, uncomment edge routing blocks in all three files:

- `providers.tf` — Cloudflare provider
- `variables.tf` — Cloudflare variables
- `main.tf` — `enable_edge_routing = true` and related inputs

> **Note:** Don't enable edge routing if you're also using the edge stack for the same hostname—they would conflict.

## When to use hybrid

Only if you need Cloud Run compute, Vertex AI, or other GCP services. The edge stack handles most SaaS workloads.
