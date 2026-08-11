# ADR-003 HCP Terraform for state

**Status:** Accepted

**Date:** 2026-08-09 **Tags:** infrastructure, terraform, state

## Problem

- Terraform state for this project holds a database password: Hyperdrive stores the origin credentials as discrete fields, so they are written to state. It needs encryption at rest, locking, and a recoverable history.
- Object-storage backends have a bootstrap problem – you must provision, by hand, the bucket that holds the state that provisions everything else – and the obvious choice here, R2, has no object versioning, so a corrupted state has no rollback.

## Decision

- Use a `cloud` block against HCP Terraform, with the host, organization and workspace committed in each root – `app.terraform.io` plus placeholder organization and workspace names that adopters replace with their own. A fork that has not renamed them cannot initialize against its own HCP setup, so it touches nothing by accident.
- Commit the coordinates rather than passing `TF_WORKSPACE`. Terraform refuses to run when `TF_WORKSPACE` disagrees with `workspaces.name`, and consults `TF_CLOUD_HOSTNAME` only when `hostname` is omitted, so ambient shell state cannot retarget a root at another environment's state or another Terraform host. That covers commands an output `precondition` never could: `output`, `import` and the `state` subcommands do not evaluate output preconditions, whatever else they read.
- Use Remote execution mode, with the Cloudflare token and Terraform inputs held as workspace variables. A remote run receives `TF_VAR_*` from the caller but no other environment variables, so the provider credential can only come from the workspace; CI needs exactly one secret (`TF_API_TOKEN`). Inputs such as `database_url` are defaults a caller can still override per run.
- Ship one backend, not a choice of several. At two environments and four resources, options cost more than they give.

## Alternatives (brief)

- **S3-compatible backend on Cloudflare R2** – keeps everything on one vendor, and `use_lockfile = true` works because R2 supports conditional writes. Rejected for the manual bucket bootstrap, a run of `skip_*` compatibility flags per environment, and no versioning for recovery.
- **Local state** – untenable: both environments are shared, and the state carries a password.
- **Local execution mode with HCP for state only** – still supported, and documented for anyone who wants it, but it puts production credentials back on developer machines for no gain here.

## Impact

- Positive: no state-storage bootstrap – the workspaces are created once in the UI, but there is no chicken-and-egg bucket to provision first; state encrypted and versioned; locking built in; GitHub stores no Cloudflare or database credentials, only the HCP token.
- Negative/Risks: adds a HashiCorp account to an otherwise Cloudflare-only stack, and workspace variables are configured in a web UI rather than the repository.
- Remote execution isolates less than it looks. Terraform forwards local `TF_VAR_*` values as run-specific variables, and those [outrank ordinary workspace variables](https://developer.hashicorp.com/terraform/cloud-docs/variables/managing-variables), so an exported `TF_VAR_project_slug` can propose renaming every resource. Priority variable sets would lock a value down; this starter does not use them: the CI workflow runs only committed `main` configuration and passes no `TF_VAR_*` of its own, and an interactive run shows the override in the plan before anyone confirms it.
- Five workspace settings have no `cloud` block equivalent and so live outside version control: the CLI-driven workflow (a VCS-linked workspace refuses remote applies), Remote execution mode (Local mode ignores workspace variables), **Terraform Working Directory** set to `envs/<env>` (otherwise the uploaded configuration omits the shared `modules/` directory the roots reference), the **Terraform Version** (a new workspace pins whatever release was current when it was created, which `required_version` can only reject, not select), and the variables themselves. `infra/README.md` enumerates them.

## Links

- Code/Docs: `infra/README.md`, `infra/envs/*/main.tf`, [Infrastructure spec](/specs/infra-terraform)
- Related ADRs: [ADR-002](/adr/002-terraform-wrangler-boundary)
