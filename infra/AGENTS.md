Terraform for the durable Cloudflare resources the Workers consume. [`README.md`](./README.md) covers setup and usage, [ADR-002](../docs/adr/002-terraform-wrangler-boundary.md) the ownership decision, [ADR-003](../docs/adr/003-hcp-terraform-state.md) the state backend, and [`docs/specs/infra-terraform.md`](../docs/specs/infra-terraform.md) the full specification. Those carry the rationale and the operating procedure; this file is the short list of constraints that matter while editing `infra/`.

## Ownership Boundary

- Terraform provisions what the Workers consume: the two Hyperdrive configurations and the opt-in R2 uploads bucket. Nothing else. Worker names, code, routes, custom domains, bindings, vars, secrets, and assets belong to `apps/*/wrangler.jsonc` – adding a `cloudflare_workers_*` or DNS resource here is the change that breaks the design, and it will not announce itself as a conflict until a deploy overwrites something.
- The handoff is manual and non-secret: Hyperdrive IDs and the R2 bucket name are pasted into `wrangler.jsonc` once per environment. A change to a handoff output is incomplete without the corresponding `wrangler.jsonc` update.

## Layout and Naming

- The two roots stay structurally parallel: same provider constraints, same module interface, same variable and output names. A structural change to one belongs in the other.
- Their _values_ may differ on purpose. Enabling an optional resource in staging before production is a supported rollout, not drift – see the [file uploads recipe](../docs/recipes/file-uploads.md). Do not copy an environment-specific value across unless the change is meant for both.
- Resource logic lives in `modules/cloudflare`. Each root holds its environment identity, provider and `cloud` configuration, root variables and outputs, and the module call.
- Resource values follow `{project_slug}-{environment}[-role]`. `project_slug` must match the worker name prefix in `apps/*/wrangler.jsonc`, or the bindings point at resources that do not exist.
- Resource identifiers name the concrete thing (`cloudflare_hyperdrive_config.cached`); module names describe the role (`module.edge`).

## Variables and Outputs

- Encode structural constraints in `validation` blocks so they fail locally rather than mid-apply, and write the `error_message` as the fix rather than the rule – see `uploads_cors_origins` rejecting `"*"`.
- Inputs holding credentials are `sensitive = true` (`database_url`). Outputs are stable, non-secret identifiers only – they are printed into CI summaries and committed to `wrangler.jsonc`.

## Running Terraform

Validate locally with the same credential-free check CI runs:

```bash
bun infra:check
```

That is `terraform fmt -check` plus `init -backend=false` and `validate` for each root. `-backend=false` installs providers and modules without contacting the backend, so it needs no HCP token and reads no state.

- **Never run `plan`, `apply`, `destroy`, `import`, or any state mutation.** `plan` is not the safe half: HCP Terraform executes the configuration it is handed in the workspace's privileged run environment, with that workspace's state and variables, so planning uncommitted work exercises real credentials against real infrastructure. `bun infra:check` is the branch-level signal; applying is a manual dispatch of `.github/workflows/infra.yml` from `main`.
- Never commit state, `.terraform/`, credentials, or `.tfvars` – state holds the database password. `infra/.gitignore` covers these; do not narrow it.
