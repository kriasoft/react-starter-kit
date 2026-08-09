# Infrastructure

Terraform for the durable Cloudflare resources the Workers depend on.

[Deployment docs](https://reactstarter.com/deployment/cloudflare) | [CI/CD](https://reactstarter.com/deployment/ci-cd)

## What Terraform owns

Exactly one rule, and it is worth internalising before changing anything here:

> **Terraform provisions what the Workers consume. Wrangler owns the Workers.**

| Terraform | Wrangler (`apps/*/wrangler.jsonc`) |
| --- | --- |
| Hyperdrive configurations (2 per env) | Worker names, code, routes, custom domains |
| R2 uploads bucket + CORS policy (opt-in) | Service bindings, Hyperdrive bindings, vars, secrets, assets |

Nothing appears in both columns, so `terraform apply` and `wrangler deploy` cannot disagree about a field. Application deploys never run Terraform; use the dedicated infrastructure commands or workflow for infrastructure changes.

The only values crossing the boundary are stable, non-secret resource identifiers – the two Hyperdrive IDs, plus the R2 bucket name when uploads are enabled. They are copied into `wrangler.jsonc` once per environment.

## Layout

```bash
infra/
  modules/cloudflare/   # The resources. Connection parsing and naming live here.
  envs/staging/         # One root = one workspace = one state.
  envs/production/
```

Each root hard-codes its own `environment`, so a staging state cannot create production-named resources.

Two environments, matching the two that CI deploys. There is no `dev` root: local development needs no cloud resources. Point the local Hyperdrive bindings at any Postgres instance instead.

```bash
export CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE_CACHED="postgres://..."
export CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE_UNCACHED="postgres://..."
```

To add an environment, copy a root, change the two names in it, and add a matching block to each `wrangler.jsonc`.

## Setup

State, locking and versioned history live in [HCP Terraform](https://app.terraform.io), avoiding the chicken-and-egg problem of provisioning a bucket to hold the state that provisions your infrastructure.

**1. Authenticate.** Create an organization if you do not have one, then:

```bash
terraform login
```

The starter ships no organization or workspace names, so a fork does not carry someone else's deployment targets. Create these ignored files:

```dotenv
# .env.terraform.staging.local
TF_CLOUD_ORGANIZATION=your-org
TF_WORKSPACE=your-project-staging
```

```dotenv
# .env.terraform.production.local
TF_CLOUD_ORGANIZATION=your-org
TF_WORKSPACE=your-project-production
```

The names are yours to pick, but each **must end in `-staging` or `-production`**. Each root checks the suffix at plan time and refuses to run otherwise, because `TF_WORKSPACE` – not the directory you are in – decides which state gets written, and an exported shell value silently wins over these files. Without the check, a stale `TF_WORKSPACE=…-production` left over from an earlier command would make `bun infra:staging apply` rename production's Hyperdrive configurations, issuing new IDs and breaking every binding pointing at them.

### Sharing the targets with your team

Each script reads `.env.terraform.<environment>` first and `.env.terraform.<environment>.local` second, so the `.local` file wins – the same cascade as `.env` and `.env.local`.

Once this repository is yours rather than a template, commit the shared values to `.env.terraform.staging` and `.env.terraform.production`, without the `.local` suffix, so nobody has to hand-create them. Neither name is a secret: CI already passes both as GitHub _variables_ rather than secrets.

Keep `.local` for pointing at a workspace of your own. `alice-staging` still satisfies the suffix check, which is how to try an infrastructure change without renaming shared staging's Hyperdrive configurations underneath everyone.

One consequence to accept before committing them: a fork of _your_ repository inherits your targets, and the suffix check cannot catch that – it validates the environment, not who owns the workspace. What stops it going anywhere is HCP, which fails to authenticate without credentials for that organization.

**2. Create both workspaces in HCP Terraform.** Create them in the UI so you can configure their working directories and variables before the first run. (`terraform init` can create a missing workspace, but it has none of the required settings.) Then initialise each root:

```bash
bun infra:staging init
bun infra:production init
```

**3. Set the workspace's Terraform Working Directory.** In the workspace's **Settings → General**, set:

| Workspace                 | Terraform Working Directory |
| ------------------------- | --------------------------- |
| `your-project-staging`    | `envs/staging`              |
| `your-project-production` | `envs/production`           |

The value is relative to `infra/`, the shared configuration directory uploaded by CLI-driven runs – not to the repository root. Setting it lets HCP include the `modules/` directory referenced by each root. There is no `cloud` block argument for this, so the repository cannot declare it.

**4. Set the workspace variables.** Runs execute in HCP Terraform, so it reads values from the workspace rather than your shell. In the workspace's **Variables** tab add:

| Variable | Kind | Sensitive | Value |
| --- | --- | --- | --- |
| `cloudflare_account_id` | Terraform | no | Your Cloudflare account ID |
| `project_slug` | Terraform | no | Worker name prefix, e.g. `example` |
| `database_url` | Terraform | **yes** | Unpooled Postgres URL |
| `origin_connection_limit` | Terraform | no | _Optional._ Defaults to 20; see below |
| `CLOUDFLARE_API_TOKEN` | Environment | **yes** | Token with Account → Hyperdrive → Edit |

A variable set shared across both workspaces avoids entering the account ID and slug twice.

Hyperdrive is itself a connection pool, so give it Neon's **unpooled** host – the one without `-pooler`. Stacking two poolers exhausts connections under load. Add **Account → Workers R2 Storage → Edit** to the token only if you enable the uploads bucket.

`origin_connection_limit` is a soft maximum per configuration, and there are two configurations, so the database needs room for twice it plus headroom. The default of 20 is Cloudflare's ceiling on the Workers Free plan. Raise it from the workspace once you are on Paid and the origin can take the connections – it belongs to the deployment, not to the repository.

> Prefer running Terraform on your own machine? Set the workspace's execution mode to **Local**. HCP then stores state only, ignores workspace variables, and uploads nothing – so step 3 stops mattering and values come from `TF_VAR_*` or a gitignored `terraform.tfvars` instead.

## Usage

```bash
bun infra:staging plan
bun infra:staging apply
```

`infra:staging` and `infra:production` are the only two scripts: each loads that environment's `.env.terraform.*` files and forwards everything after it to `terraform`, so any subcommand works – `plan`, `apply`, `output`, `import`, `state list`. Use them rather than calling `terraform` directly; a bare `terraform` command carries no workspace selection and will act on whatever `TF_WORKSPACE` happens to hold.

One gap worth knowing: the workspace check lives in an output precondition, so it only runs where Terraform evaluates the configuration – `plan`, `apply`, `destroy`, `validate`. Two kinds of command slip past it:

- **`import` and the `state` subcommands** (`rm`, `mv`, `push`) write state without consulting the configuration.
- **`output`** reads values already stored in state and never re-evaluates the precondition that produced them – so it happily prints another environment's Hyperdrive IDs. This is the one that bites: nothing is mutated, but the IDs end up pasted into the wrong `wrangler.jsonc` and that environment's worker then talks to the wrong database.

Before any of them, confirm the target:

```bash
bun infra:staging workspace show    # must end in -staging
```

From CI, the same two steps are one workflow dispatched twice – **Infrastructure** in the Actions tab:

1. Dispatch with **Apply** off. This plans only.
2. Read the plan in the HCP Terraform run it links to.
3. Dispatch again with **Apply** on.

If you configure required reviewers on the GitHub Environments, they gate both dispatches. The apply dispatch recomputes the plan, so review it again in HCP Terraform if state or the target ref changed after the plan-only run.

Then wire the IDs into the API worker. Check the workspace first – `output` reads whatever state `TF_WORKSPACE` points at, without running the guard:

```bash
bun infra:staging workspace show    # must end in -staging
bun infra:staging output -raw wrangler_hyperdrive_bindings
```

Paste the result into the `staging` block of `apps/api/wrangler.jsonc` under `"hyperdrive"`, then deploy. Order matters, because a service binding resolves its target by name at deploy time:

```bash
bun api:deploy --env staging    # must exist before web binds to it
bun app:deploy --env staging
bun web:deploy --env staging    # attaches the custom domain
```

Pass `--env` on every command, and pass the same one throughout: the flag selects both the worker name (`example-api-staging`) and the environment block holding the IDs you just pasted. Omitting it deploys the top-level configuration, which is production.

## Secrets

Three kinds, three homes. Keeping them straight is most of what goes wrong.

| Kind | Example | Lives in |
| --- | --- | --- |
| Terraform provider creds | `CLOUDFLARE_API_TOKEN` | HCP Terraform workspace variables |
| Infrastructure creds | `database_url` | HCP Terraform workspace variables |
| Application secrets | `BETTER_AUTH_SECRET`, `STRIPE_*` | `wrangler secret put` |

Application secrets never enter Terraform:

```bash
bun wrangler secret put BETTER_AUTH_SECRET \
  --config apps/api/wrangler.jsonc --env staging
```

Two Cloudflare tokens, with deliberately different scopes:

| Token | Lives in | Scope |
| --- | --- | --- |
| Terraform | HCP workspace | Account → Hyperdrive → Edit (+ Workers R2 Storage → Edit for uploads) |
| Wrangler deploy | GitHub secret | The **Edit Cloudflare Workers** API token template |

For the deploy token, use Cloudflare's [Edit Cloudflare Workers](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/) template scoped to your account and zone rather than assembling permissions by hand – it already covers scripts, routes and the DNS record a Custom Domain creates, and Cloudflare keeps it current as those permissions change.

Terraform's token stays narrow on purpose: it owns no workers, no routes and no DNS, so it needs none of those scopes.

For the infrastructure workflow, CI needs a single credential – `TF_API_TOKEN`, an HCP Terraform team token – plus `TF_CLOUD_ORGANIZATION` and `TF_WORKSPACE` variables on each GitHub environment. No Cloudflare or database credentials are stored in GitHub for Terraform.

Registering the Stripe webhook stays a manual dashboard step – it points at your public hostname, which Wrangler owns: `https://<your-domain>/api/auth/stripe/webhook`

## State holds the database password

Hyperdrive stores the origin credentials as discrete fields, so the password is written into state. `sensitive = true` only hides values from output; it does not encrypt them. HCP Terraform encrypts state at rest, keeps every version, and never writes it to disk on a developer's machine – which is most of the reason to use it here rather than object storage.
