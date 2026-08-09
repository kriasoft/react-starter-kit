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

One root per environment, one HCP Terraform workspace per root. Each root hard-codes its own `environment`, so no state can create another environment's resources.

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

`origin_connection_limit` is a soft maximum per configuration – Cloudflare may briefly exceed it. It defaults to 20, Cloudflare's ceiling on the Workers Free plan and low enough that both configurations together stay within a small Neon compute's `max_connections`. Both env roots expose it so it can be raised per deployment; the origin sees twice the value.

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
| A `-pooler` host | Hyperdrive is the pool; stacking two exhausts connections. |

## State

HCP Terraform, via a `cloud` block – state, locking and version history in one place, with no bucket to provision first. See [ADR-003](/adr/003-hcp-terraform-state).

Each root declares an empty `cloud {}` block. The organization and existing workspace are selected with `TF_CLOUD_ORGANIZATION` and `TF_WORKSPACE`, so a fork carries no one else's deployment targets.

Workspace names must end in `-staging` or `-production`. Each root asserts the suffix in an output `precondition`, failing at plan time otherwise. The reason is that `TF_WORKSPACE` selects the state while the directory selects only the resource names, and an exported `TF_WORKSPACE` takes precedence over the value in `.env.terraform.<env>.local` – Bun's `--env-file` does not overwrite variables already present in the environment. Unguarded, a stale export would point the staging root at production state, where it would rename the Hyperdrive configurations and invalidate their IDs.

The check runs wherever the configuration is evaluated – `plan`, `apply`, `destroy`, and `validate`. It does not run for `import` or the `state` subcommands, which write state without consulting the configuration, nor for `output`, which returns values already stored in state rather than recomputing them. `output` is the consequential one: it can print another environment's Hyperdrive IDs for pasting into a `wrangler.jsonc`, wiring a worker to the wrong database without touching state. The gap is inherent to Terraform, so it is documented and paired with a `workspace show` step rather than worked around.

Terraform is invoked through two package scripts, `infra:staging` and `infra:production`, which load the matching env file and forward all arguments. Calling `terraform` directly skips workspace selection.

Each workspace must also set **Terraform Working Directory** to `envs/<env>`. Remote runs upload the configuration, and a root referencing `../../modules/cloudflare` reaches outside its own directory; Terraform uploads parent directories only when a working directory is set, to the depth of that setting. There is no `cloud` block argument for it, so it is the one workspace setting the repository cannot declare.

**State is credential-bearing.** Hyperdrive stores the origin password as a discrete field, so it is written to state. `sensitive = true` hides values from output; it does not encrypt them. HCP Terraform encrypts state at rest and retains every version.

## Credentials

Runs execute in HCP Terraform, so values come from workspace variables rather than a developer's shell.

| Kind                | Supplied as                                      |
| ------------------- | ------------------------------------------------ |
| Cloudflare provider | `CLOUDFLARE_API_TOKEN` workspace environment var |
| Origin database     | `database_url` workspace variable, sensitive     |
| Application secrets | `wrangler secret put` – never Terraform          |

The Cloudflare token needs **Account → Hyperdrive → Edit**, plus **Account → Workers R2 Storage → Edit** only when the uploads bucket is enabled. It needs no zone or worker scopes.

The infrastructure workflow holds one credential: `TF_API_TOKEN`, an HCP Terraform team token. Terraform's Cloudflare and database credentials are never stored in GitHub. The separate worker-deploy workflow does hold a `CLOUDFLARE_API_TOKEN` – Cloudflare's **Edit Cloudflare Workers** template, which grants the worker, route and DNS scopes Terraform deliberately lacks.

Setting a workspace's execution mode to **Local** stores state remotely but runs Terraform on the caller's machine; HCP then ignores workspace variables, so values come from `TF_VAR_*` or a gitignored `terraform.tfvars`.

## Naming

Resource values use `{project_slug}-{environment}[-role]`, lowercase `^[a-z0-9-]+$`. `project_slug` must match the worker name prefix in `apps/*/wrangler.jsonc`.

Resource identifiers name the concrete thing (`cloudflare_hyperdrive_config.cached`); module names describe the architectural role (`module.edge`).

## CI

`.github/workflows/ci.yml` runs `terraform fmt -check` and `terraform validate` on every push. Because `init -backend=false` still initializes an HCP `cloud {}` block, CI validates a disposable copy with that block removed and a correctly suffixed local workspace. No HCP or Cloudflare credentials are needed.

`.github/workflows/infra.yml` plans and applies, on manual dispatch only, serialised per environment and gated by GitHub Environment reviewers. Application deploys never run Terraform.
