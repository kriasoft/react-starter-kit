# ADR-003 HCP Terraform for state

**Status:** Accepted

**Date:** 2026-08-09 **Tags:** infrastructure, terraform, state

## Problem

- Terraform state for this project holds a database password: Hyperdrive stores the origin credentials as discrete fields, so they are written to state. It needs encryption at rest, locking, and a recoverable history.
- Object-storage backends have a bootstrap problem – you must provision, by hand, the bucket that holds the state that provisions everything else – and the obvious choice here, R2, has no object versioning, so a corrupted state has no rollback.

## Decision

- Use an empty `cloud {}` block against HCP Terraform. Supply the organization and existing workspace as `TF_CLOUD_ORGANIZATION` and `TF_WORKSPACE`, so a fork does not inherit someone else's deployment targets.
- Keep the default remote execution mode. Cloudflare and database credentials become workspace variables, so they are never held on a developer's machine, and CI needs exactly one secret (`TF_API_TOKEN`).
- Ship one backend, not a choice of several. At two environments and four resources, options cost more than they give.

## Alternatives (brief)

- **S3-compatible backend on Cloudflare R2** – keeps everything on one vendor, and `use_lockfile = true` works because R2 supports conditional writes. Rejected for the manual bucket bootstrap, ten lines of `skip_*` flags per environment, and no versioning for recovery.
- **Local state** – untenable: both environments are shared, and the state carries a password.
- **Local execution mode with HCP for state only** – still supported, and documented for anyone who wants it, but it puts production credentials back on developer machines for no gain here.

## Impact

- Positive: no state-storage bootstrap – the workspaces are created once in the UI, but there is no chicken-and-egg bucket to provision first; state encrypted and versioned; locking built in; GitHub stores no infrastructure credentials.
- Negative/Risks: adds a HashiCorp account to an otherwise Cloudflare-only stack, and workspace variables are configured in a web UI rather than the repository. Remote execution means `TF_VAR_*` in a local shell is ignored, which surprises people expecting a plain backend swap.
- Remote execution also requires each workspace to set **Terraform Working Directory** to `envs/<env>`, or the uploaded configuration omits the shared `modules/` directory the roots reference. No `cloud` block argument sets it, so two workspace settings – working directory and variables – live outside version control. Local execution mode avoids both, at the cost of putting production credentials back on developer machines.

## Links

- Code/Docs: `infra/README.md`, `infra/envs/*/main.tf`, [Infrastructure spec](/specs/infra-terraform)
- Related ADRs: [ADR-002](/adr/002-terraform-wrangler-boundary)
