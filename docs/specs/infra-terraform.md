# Infrastructure Terraform Specification

## Scope

Terraform provisions the durable Cloudflare resources the workers consume. It does not manage workers. See [ADR-002](/adr/002-terraform-wrangler-boundary) for the decision.

| Owned by Terraform | Owned by Wrangler |
| --- | --- |
| `cloudflare_hyperdrive_config` × 2/env | Worker names, code, versions, deployments |
| `cloudflare_r2_bucket` + `_cors` (opt-in) | Routes, custom domains, service bindings, vars, secrets, assets |

The uploads bucket carries its own CORS policy: browsers reject a presigned `PUT` to a bucket without one, so the policy belongs with the Terraform-owned bucket rather than as a dashboard step. It allows `PUT` with `Content-Type` from `uploads_cors_origins`, which must be explicit – a `*` origin is rejected at plan time.

**Invariant:** no field is configured by both tools. The only values crossing the boundary are stable, non-secret resource identifiers – the two Hyperdrive IDs, plus the R2 bucket name when uploads are enabled.

**Non-goals:** worker deployment, DNS, multi-region orchestration, blue-green deploys, autoscaling.

## Layout

```bash
infra/
  modules/cloudflare/   # Resources, connection parsing, naming
  envs/{staging,production}/
```

One root per environment, one HCP Terraform workspace per root. Each root hard-codes its own `environment` and workspace name, so it cannot create another environment's resources or write its state.

There is no `dev` root. Local development uses `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_<BINDING>` and provisions nothing.

There is no `preview` root either. A single shared preview environment is not per-PR isolation – concurrent pull requests would overwrite each other's deployment and share one database – and it duplicates staging's role. Add an environment by copying a root and adding a matching `wrangler.jsonc` block.

## Versions

| Component  | Constraint     |
| ---------- | -------------- |
| terraform  | `>= 1.12, < 2` |
| cloudflare | `~> 5.0`       |

Version constraints live in env roots; the module declares `source` only. Lock files are committed and cover linux, macOS and Windows.

## Hyperdrive

Two configurations per environment, matching the two bindings in `apps/api/`:

| Name                    | `caching.disabled` | Binding               |
| ----------------------- | ------------------ | --------------------- |
| `<slug>-<env>-cached`   | `false`            | `HYPERDRIVE_CACHED`   |
| `<slug>-<env>-uncached` | `true`             | `HYPERDRIVE_UNCACHED` |

`cache_max_age_seconds` (60) and `cache_stale_while_revalidate_seconds` (15) are set explicitly rather than inherited, so the staleness window is reviewable in the configuration.

`origin_connection_limit` is a soft maximum per configuration – Cloudflare may briefly exceed it. It defaults to 20, inside Cloudflare's Workers Free ceiling so the starter works on any plan. Both env roots expose it so it can be raised per deployment; the origin sees twice the value.

### Connection URL

`database_url` is split by one anchored regex into the discrete fields Hyperdrive stores. Accepted shape:

```
postgres[ql]://USER:PASSWORD@HOST[:PORT]/DATABASE[?params]
```

The port defaults to `5432`; query parameters are ignored, since TLS to the origin is Hyperdrive's setting rather than the client's.

Three failures are rejected at plan time rather than surfacing later as connection errors:

| Rejected | Why |
| --- | --- |
| Malformed URL | Nothing to parse. |
| Percent-encoded credentials | Terraform has no `urldecode`, so the escape sequence would be stored verbatim. |
| A `-pooler` host | Hyperdrive is the pool; Neon's transaction-mode pooler breaks its prepared statements. |

## State

HCP Terraform, via a `cloud` block – state, locking and version history in one place, with no bucket to provision first. See [ADR-003](/adr/003-hcp-terraform-state).

Each root pins its own `cloud` block – `hostname`, organization and `workspaces { name = "example-<env>" }`. Adopters replace the organization and workspace placeholders during setup. One directory therefore selects both the resource names and the state.

Pinning the name rather than supplying `TF_WORKSPACE` is what makes the binding structural. Terraform refuses to run when `TF_WORKSPACE` disagrees with `workspaces.name`, and falls back to `TF_CLOUD_HOSTNAME` only when `hostname` is omitted, so no ambient shell state can point a root at another environment or host. That also covers `output`, `import` and the `state` subcommands, which never evaluate output preconditions and so could not be guarded by one.

Terraform is invoked through two package scripts, `infra:staging` and `infra:production`, which are shorthand for `terraform -chdir=infra/envs/<environment>`.

Each workspace must also set **Terraform Working Directory** to `envs/<env>`. Remote runs upload the configuration, and a root referencing `../../modules/cloudflare` reaches outside its own directory; Terraform uploads parent directories only when a working directory is set, to the depth of that setting. There is no `cloud` block argument for it. It is one of five settings the repository cannot declare, alongside the CLI-driven workflow, Remote execution mode, the workspace Terraform version and the variables themselves – see [ADR-003](/adr/003-hcp-terraform-state) and `infra/README.md`.

**State is credential-bearing.** Hyperdrive stores the origin password as a discrete field, so it is written to state. `sensitive = true` hides values from output; it does not encrypt them. HCP Terraform encrypts state at rest and retains every version.

## Credentials

Runs execute in HCP Terraform, which supplies these from the workspace. The two kinds behave differently under a CLI-driven run: a Terraform variable is a default that a local `TF_VAR_*` overrides for that run, while no other environment variable reaches the run, so the provider token can only come from the workspace.

| Kind                | Supplied as                                      |
| ------------------- | ------------------------------------------------ |
| Cloudflare provider | `CLOUDFLARE_API_TOKEN` workspace environment var |
| Origin database     | `database_url` workspace variable, sensitive     |
| Application secrets | `wrangler secret put` – never Terraform          |

The Cloudflare token needs **Account → Hyperdrive → Edit**, plus **Account → Workers R2 Storage → Edit** only when the uploads bucket is enabled. It needs no zone or worker scopes.

The infrastructure workflow holds one credential: `TF_API_TOKEN`, an HCP Terraform team token (a group token on HCP Terraform Europe). It is an environment secret on all four infrastructure environments, not a repository secret: the deployment-branch rule only binds jobs that name the environment, so a repository-scoped token would let a branch drop `environment:` and keep the credential.

One name, three tokens: a shared Plan token for both `-plan` environments, and one Write token per workspace for `infra-staging-apply` and `infra-production-apply`. Scoping the apply tokens per workspace is what makes the production gate real – a single apply token would need Write on both, letting the ungated staging environment apply production. The plan token is shared because planning either workspace bypasses no gate. Team management requires HCP Essentials or above; on Free, leave the token unset and run Terraform from a trusted machine.

Application deploys use `staging` and `production`, so a Cloudflare token and an HCP token are never reachable from the same job.

Terraform's Cloudflare and database credentials are never stored in GitHub. The separate worker-deploy workflow does hold a `CLOUDFLARE_API_TOKEN` – Cloudflare's **Edit Cloudflare Workers** template, which grants the worker, route and DNS scopes Terraform deliberately lacks.

Setting a workspace's execution mode to **Local** stores state remotely but runs Terraform on the caller's machine; HCP then ignores workspace variables, so values come from `TF_VAR_*` or a gitignored `terraform.tfvars`.

## Naming

Resource values use `{project_slug}-{environment}[-role]`, lowercase `^[a-z0-9-]+$`. `project_slug` must match the worker name prefix in `apps/*/wrangler.jsonc`.

Resource identifiers name the concrete thing (`cloudflare_hyperdrive_config.cached`); module names describe the architectural role (`module.edge`).

## CI

`.github/workflows/ci.yml` runs `bun infra:check` – `terraform fmt -check`, then `init -backend=false -lockfile=readonly` and `validate` for each root – on pull requests to `main`, on `main` itself, and on manual CI runs. `init -backend=false` installs providers and modules without accessing the configured HCP backend, which is the sequence HashiCorp documents for validation, so CI needs no HCP or Cloudflare credentials. `-lockfile=readonly` makes every automated `init`, here and in `infra.yml`, consume the committed provider selections rather than amend them on a runner: a provider change has to arrive as a reviewed lock-file diff.

Every workflow installs Terraform with `terraform_version: ">=1.12.0 <2.0.0"` – the roots' `>= 1.12, < 2` in the SemVer syntax the action uses, and the same range the HCP workspaces express as `~> 1.12`. HCP and `setup-terraform` each select a binary within it and may differ for a day after a release, while each root rejects anything outside it. No exact release is pinned, so a Terraform release needs no action; raising the floor means editing all four declarations.

`.github/workflows/infra.yml` plans and applies, on manual dispatch only, serialised per environment. One dispatch runs a plan job that saves the plan and publishes it to the run summary, then an apply job that applies that saved plan rather than recomputing one – gated by required reviewers where the repository's GitHub subscription supports them. The plan job uses a reviewer-free `-plan` environment because protection rules gate any job naming an environment, so a shared one would place the approval before the plan existed. The apply job is skipped when the plan reports no changes.

Both jobs are restricted to `main` – by a first-step check in the workflow, and by a deployment-branch rule on each GitHub Environment, which is the half a branch cannot edit away. A speculative plan is not a read-only preview: HCP executes the configuration it is handed in the workspace's privileged run environment, with its variables and state, which is why HashiCorp treats plan permission as equivalent to write. Branch-level feedback comes from `bun infra:check` in `ci.yml`, which needs no credentials. Application deploys never run Terraform.
