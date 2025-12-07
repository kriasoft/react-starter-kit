module "stack" {
  source = "../../../stacks/edge"

  cloudflare_account_id = var.cloudflare_account_id
  cloudflare_zone_id    = var.cloudflare_zone_id
  hostname              = var.hostname
  project_slug          = var.project_slug
  environment           = var.environment
  neon_database_url     = var.neon_database_url
}

output "api_url" {
  value = module.stack.api_url
}
