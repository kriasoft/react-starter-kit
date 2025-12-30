# Worker names for wrangler deploy
output "worker_api_name" {
  value       = module.worker_api.name
  description = "API worker name for wrangler deploy"
}

output "worker_app_name" {
  value       = module.worker_app.name
  description = "App worker name for wrangler deploy"
}

output "worker_web_name" {
  value       = module.worker_web.name
  description = "Web worker name for wrangler deploy"
}

# Hyperdrive ID for wrangler.jsonc
output "hyperdrive_id" {
  value       = module.hyperdrive.id
  description = "Hyperdrive configuration ID for wrangler.jsonc"
}

output "hyperdrive_name" {
  value       = module.hyperdrive.name
  description = "Hyperdrive configuration name"
}

output "hostname" {
  value       = var.hostname != "" ? var.hostname : null
  description = "Configured hostname (null if using workers.dev)"
}
