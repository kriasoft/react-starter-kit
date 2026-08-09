# Review Terraform Infrastructure

Review the Terraform changes against the repository's actual ownership boundary and environment model. Read `infra/README.md`, `docs/specs/infra-terraform.md`, ADR-002, and ADR-003 before reporting findings.

Check that:

- Terraform owns only the two Hyperdrive configurations and the opt-in R2 uploads bucket; Wrangler remains the sole owner of Workers, routes, custom domains, bindings, variables, secrets, and assets.
- `infra/envs/staging` and `infra/envs/production` stay equivalent except for their hard-coded environment and workspace suffix guard.
- Shared resource logic stays in `infra/modules/cloudflare`; provider constraints and the `cloud {}` block stay in each root.
- Resource names follow `{project_slug}-{environment}[-role]`, inputs fail clearly, secrets are marked sensitive, and no state, credentials, local env files, or `.terraform/` data are committed.
- HCP Terraform setup, GitHub workflow variables, package scripts, Wrangler bindings, and documentation agree on environment names and output handoff.
- Changes preserve the Terraform/Wrangler ownership boundary and do not revive removed `dev`, `preview`, `prod`, `edge`, `stack`, GCP, or object-storage-backend layouts.

Validate without contacting remote state:

```bash
terraform fmt -check -recursive infra/

validation_dir="$(mktemp -d)"
trap 'rm -rf "$validation_dir"' EXIT
tar -C infra --exclude='.terraform' -cf - envs modules \
  | tar -C "$validation_dir" -xf -

for root in "$validation_dir"/envs/*/; do
  env_name="$(basename "$root")"
  perl -0pi -e 's/^\h*cloud \{\}\R//m' "$root/main.tf"
  terraform -chdir="$root" init -backend=false -input=false
  TF_WORKSPACE="validate-$env_name" terraform -chdir="$root" validate
done
```

The temporary copy is necessary because `init -backend=false` still initializes HCP Terraform when a `cloud {}` block is present.

Do not run `plan`, `apply`, `destroy`, `import`, or state mutation commands as part of a review.
