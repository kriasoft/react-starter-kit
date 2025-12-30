module "stack" {
  source = "../../../stacks/edge"

  cloudflare_account_id = var.cloudflare_account_id
  cloudflare_zone_id    = var.cloudflare_zone_id
  hostname              = var.hostname
  project_slug          = var.project_slug
  environment           = var.environment
  neon_database_url     = var.neon_database_url
}

output "worker_api_name" {
  value = module.stack.worker_api_name
}

output "worker_app_name" {
  value = module.stack.worker_app_name
}

output "worker_web_name" {
  value = module.stack.worker_web_name
}

output "hyperdrive_id" {
  value = module.stack.hyperdrive_id
}

output "hyperdrive_name" {
  value = module.stack.hyperdrive_name
}
