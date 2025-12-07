module "stack" {
  source = "../../../stacks/edge"

  cloudflare_account_id = var.cloudflare_account_id
  cloudflare_zone_id    = var.cloudflare_zone_id
  hostname              = var.hostname
  project_slug          = var.project_slug
  environment           = var.environment
  neon_database_url     = var.neon_database_url
}

# Copy hyperdrive_id to wrangler.jsonc hyperdrive binding
output "hyperdrive_id" {
  value = module.stack.hyperdrive_id
}

output "hyperdrive_name" {
  value = module.stack.hyperdrive_name
}
