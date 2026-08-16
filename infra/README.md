# Infrastructure

Terraform for the durable Cloudflare resources the Workers depend on.

[Deployment docs](https://reactstarter.com/deployment/cloudflare) | [CI/CD](https://reactstarter.com/deployment/ci-cd)

## What Terraform owns

One rule governs everything here:

> **Terraform provisions what the Workers consume. Wrangler owns the Workers.**

| Terraform | Wrangler (`apps/*/wrangler.jsonc`) |
| --- | --- |
| Hyperdrive configurations (2 per env) | Worker names, code, routes, custom domains |
| R2 uploads bucket + CORS policy (opt-in) | Service bindings, Hyperdrive bindings, vars, secrets, assets |

Nothing appears in both columns, so `terraform apply` and `wrangler deploy` cannot disagree about a field. Application deploys never run Terraform.

The only values crossing the boundary are stable, non-secret resource identifiers – the two Hyperdrive IDs, plus the R2 bucket name when uploads are enabled. They are copied into `wrangler.jsonc` once per environment.

## Layout

```bash
infra/
  modules/cloudflare/   # The resources. Connection parsing and naming live here.
  envs/staging/         # One root = one workspace = one state.
  envs/production/
```

Each root hard-codes its own `environment` and workspace name, so which resources it creates and which state it writes are fixed by the file rather than by the shell it runs in.

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

Then point both roots at your organization:

```hcl
# infra/envs/staging/main.tf
cloud {
  hostname     = "app.terraform.io"
  organization = "example"

  workspaces {
    name = "example-staging"
  }
}
```

Set `organization` to your HCP Terraform organization in both roots. Rename the `example` workspace prefix alongside the worker names in `apps/*/wrangler.jsonc` and Terraform's `project_slug`; the organization name does not need to match that prefix. Nothing here is a secret, and nothing has to be recreated on each machine.

Committing all three coordinates is deliberate: Terraform refuses to run when `TF_WORKSPACE` disagrees with `workspaces.name`, and consults `TF_CLOUD_HOSTNAME` only when `hostname` is absent, so no leftover shell state can retarget a root. See [ADR-003](https://reactstarter.com/adr/003-hcp-terraform-state).

> Not on `app.terraform.io`? For HCP Terraform Europe or a Terraform Enterprise installation, change `hostname` in both roots, run `terraform login <that host>`, and rename the CI credential: Terraform [derives `TF_TOKEN_*` from the hostname](https://developer.hashicorp.com/terraform/cli/config/config-file#environment-variable-credentials) – periods become underscores, hyphens double underscores – so `.github/workflows/infra.yml` would need `TF_TOKEN_<your_host>`.

**2. Create both workspaces in HCP Terraform**, named exactly as the roots declare them, choosing the **CLI-Driven Workflow**. Create them in the UI so you can configure their working directories and variables before the first run. (`terraform init` can create a missing workspace, but it has none of the required settings.)

Not the Version Control Workflow, tempting as that looks for a repository already on GitHub: HCP refuses remote applies on a VCS-linked workspace, treating the repository as its source of truth. Both the commands below and the **Infrastructure** workflow drive Terraform from the CLI and upload the configuration themselves.

Check two more settings while you are there. **Execution Mode** must resolve to **Remote** – it defaults to the project's setting, and a project set to Local would leave HCP ignoring the workspace variables the next step adds. **Terraform Version** should be a constraint matching the roots, `~> 1.12`: a new workspace otherwise pins whichever release was current when you created it, and `required_version` can only reject that choice, never make it.

Read that constraint carefully – `~>` lets the rightmost component increment, so `~> 1.12` means "the newest 1.x, at least 1.12", not "the 1.12 series". That is deliberate, and it is why `.github/workflows/*.yml` install Terraform with `>=1.12.0 <2.0.0`: the same range in the SemVer syntax the GitHub Action uses. Each side resolves it independently and may differ for a day after a release; neither can leave the range, so no ordinary release needs a coordinated bump – only raising the floor does. To pin the minor instead, mind the differing syntaxes: `~> 1.12.0` in the roots and the workspace, `~1.12.0` in the workflows.

**3. Set the workspace's Terraform Working Directory.** In the workspace's **Settings → General**, set:

| Workspace            | Terraform Working Directory |
| -------------------- | --------------------------- |
| `example-staging`    | `envs/staging`              |
| `example-production` | `envs/production`           |

The value is relative to `infra/`, the shared configuration directory uploaded by CLI-driven runs – not to the repository root. Setting it lets HCP include the `modules/` directory referenced by each root. There is no `cloud` block argument for this, so the repository cannot declare it.

**4. Set the workspace variables.** Runs execute in HCP Terraform, which supplies these from the workspace. In the workspace's **Variables** tab add:

| Variable | Kind | Sensitive | Value |
| --- | --- | --- | --- |
| `cloudflare_account_id` | Terraform | no | Your Cloudflare account ID |
| `project_slug` | Terraform | no | Worker name prefix, e.g. `example` |
| `database_url` | Terraform | **yes** | Unpooled Postgres URL |
| `origin_connection_limit` | Terraform | no | _Optional._ Defaults to 20 |
| `CLOUDFLARE_API_TOKEN` | Environment | **yes** | Token with Account → Hyperdrive → Edit |

With one Cloudflare account, a variable set shared across both workspaces avoids entering the account ID and slug twice. With separate accounts – the stronger isolation described in the [CI/CD docs](https://reactstarter.com/deployment/ci-cd) – keep `cloudflare_account_id` and `CLOUDFLARE_API_TOKEN` per workspace and share only what is genuinely common, such as `project_slug`.

The **Kind** column is the difference between a default and a requirement. Terraform variables are defaults: Terraform forwards a local `TF_VAR_*` to the run and it [takes precedence over the workspace value](https://developer.hashicorp.com/terraform/cloud-docs/variables/managing-variables), so an exported `TF_VAR_project_slug` would propose renaming every resource. The remote plan shows that before anything is applied, and a priority variable set is what makes a value a caller cannot override. Environment variables other than `TF_VAR_*` never reach the run, so `CLOUDFLARE_API_TOKEN` can only come from the workspace.

Hyperdrive is itself a connection pool, so give it Neon's **unpooled** host – the one without `-pooler`. Neon's pooler runs in transaction mode, which breaks the prepared statements Hyperdrive relies on for its query cache, and putting a second pool in front of the origin adds a layer that competes for the same connection budget.

`origin_connection_limit` is set here rather than committed because it belongs to the deployment: raise it once the Workers plan and the origin database can take the connections. `infra/modules/cloudflare/variables.tf` documents the ceilings and the arithmetic.

**5. Initialise each root**, now that both workspaces are fully configured:

```bash
bun infra:staging init
bun infra:production init
```

Initialising last is deliberate: the working directory is a workspace Terraform setting, and HashiCorp asks you to re-run `init` after changing one. Configure the workspace, then initialise, then plan.

> Prefer running Terraform on your own machine? Set the workspace's execution mode to **Local**. HCP then stores state only, ignores workspace variables, and uploads nothing – so step 3 stops mattering and values come from `TF_VAR_*` or a gitignored `terraform.tfvars` instead.

## Usage

```bash
bun infra:staging plan
bun infra:staging apply
```

`infra:staging` and `infra:production` are shorthand for `terraform -chdir=infra/envs/<environment>`, so every subcommand works – `plan`, `apply`, `output`, `state list`. Each root carries its own workspace coordinates, so no leftover shell state can point a command at another environment's state. What that does not check is the coordinates themselves: rename the placeholders carefully, because a root committed with the wrong workspace name will faithfully target it.

`terraform import` is the one exception. It runs locally rather than in HCP Terraform, so it cannot read the workspace variables and would need `TF_VAR_*` values and a Cloudflare token in your own shell. Adopt existing resources with an [`import` block](https://developer.hashicorp.com/terraform/language/import) in the root instead – that resolves during a normal remote `plan` and `apply`, with the credentials already configured.

From CI, both steps are a single dispatch of **Infrastructure** in the Actions tab, from `main`:

1. Dispatch with **Apply** on.
2. Read the plan, which the workflow prints to the run summary. Large plans are truncated there – the warning says so, and the HCP run has the rest.
3. Approve the apply job. It applies that saved plan – not a freshly computed one.

Leaving **Apply** off gives a plan-only run. The apply job is skipped either way when the plan reports no changes, so an unchanged environment never asks for a pointless approval.

Both jobs are restricted to `main`, plan included – HCP executes the configuration inside the workspace, so planning an unmerged branch runs it against that workspace's real credentials and state. What you get before merging is `bun infra:check` in `ci.yml`, which needs no credentials.

The workflow uses two GitHub Environments per target: `infra-<environment>-plan` for the plan job and `infra-<environment>-apply` for the apply job. They are separate because protection rules gate any job that names an environment, so a shared environment would ask for approval before the plan exists – which is how the reviewer ends up approving a plan nobody has read.

All four hold a secret named `TF_API_TOKEN`, but not the same token – a shared plan token, and one write token per workspace. Reviewer gates, where you configure them, belong on the apply environments; the default gates `infra-production-apply` and leaves staging ungated. Splitting the tokens is what makes that hold: the credential reachable before an approval cannot perform the apply. Given that a plan already executes the configuration, that is a boundary rather than a sandbox – but a structural one, not a matter of what this workflow happens to run. [Secrets](#secrets) covers the token topology.

> **Check that the approval gate exists before relying on it.** Required reviewers are unavailable on several GitHub plans, and where they are missing the apply job does not pause – a dispatch with **Apply** on plans and applies in one go. [CI/CD](https://reactstarter.com/deployment/ci-cd#required-reviewers) has the availability matrix. Where the gate is absent, dispatch with **Apply** off and run `bun infra:production apply` from a trusted machine, which shows the plan and prompts before touching anything.

Restrict all four environments to `main` under **Settings → Environments → Deployment branches and tags**, and store `TF_API_TOKEN` there as an _environment_ secret rather than a repository one. The check inside the workflow catches a mis-picked branch, but it cannot stop a determined one: a dispatch runs the workflow definition from the ref you select, so a branch can remove the check from its own copy. GitHub evaluates an environment's protection rules before the job starts, which is where the rule holds – and a branch that drops the `environment:` line to dodge it drops the credential with it, so long as the token is not also a repository secret.

Then wire the IDs into the API worker:

```bash
bun infra:staging output -raw wrangler_hyperdrive_bindings
```

Paste the result into the `staging` block of `apps/api/wrangler.jsonc` under `"hyperdrive"`, then deploy. Order matters, because a service binding resolves its target by name at deploy time:

```bash
bun api:deploy --env staging    # must exist before web binds to it
bun app:deploy --env staging
bun web:deploy --env staging    # attaches the custom domain
```

Pass `--env` on every command, and pass the same one throughout: the flag selects both the worker name (`example-api-staging`) and the environment block holding the IDs you just pasted. Production is the top-level configuration, selected with `--env=""`.

## Secrets

Three homes, sorted by who reads the credential. Which one a secret belongs in is most of what goes wrong.

| Lives in | Read by | Example |
| --- | --- | --- |
| HCP Terraform workspace variables | Terraform, to create infrastructure | `CLOUDFLARE_API_TOKEN` (Hyperdrive scope), `database_url` |
| `wrangler secret put` | The API worker, at runtime | `BETTER_AUTH_SECRET`, `STRIPE_*` |
| GitHub environment secrets | CI, to deploy and to run Terraform | `CLOUDFLARE_API_TOKEN` (Workers scope), `DATABASE_URL`, `TF_API_TOKEN` |

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

For the infrastructure workflow, CI needs one kind of credential and nothing else: `TF_API_TOKEN`, an HCP Terraform team token, stored as an environment secret on each of the four environments. One secret name, three teams:

| HCP team | Workspace access | Used by |
| --- | --- | --- |
| `ci-plan` | Plan on staging **and** production | both `-plan` environments |
| `ci-staging-apply` | Write on staging only | `infra-staging-apply` |
| `ci-production-apply` | Write on production only | `infra-production-apply` |

The apply tokens are scoped per workspace on purpose. A single apply token would need Write on both, so `infra-staging-apply` – which has no reviewer – would be able to apply production, and the production gate would stop meaning anything. The plan token is shared because planning either workspace is already a legitimate dispatch, so it bypasses no gate.

> **HCP Terraform Free has no team management** – it is available from Essentials up, and Free gives you only the owners team, whose token has owner permissions. That collapses all three identities into one. Free is still fine for remote state and workspaces: leave `TF_API_TOKEN` unset and run `bun infra:<environment> plan` and `apply` from a trusted machine. HCP Terraform Europe uses groups rather than teams, with the same topology.

The workspace comes from the configuration, and no Cloudflare or database credentials are stored in GitHub for Terraform.

Registering the Stripe webhook stays a manual dashboard step – it points at your public hostname, which Wrangler owns: `https://<your-domain>/api/auth/stripe/webhook`

## State holds the database password

Hyperdrive stores the origin credentials as discrete fields, so the password is written into state. `sensitive = true` only hides values from output; it does not encrypt them. HCP Terraform encrypts state at rest, keeps every version, and never writes it to disk on a developer's machine – which is most of the reason to use it here rather than object storage.
