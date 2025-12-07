# Hyperdrive ID - copy to wrangler.jsonc hyperdrive binding
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
