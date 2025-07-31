output "hyperdrive_direct_id" {
  description = "ID of the direct (no-cache) Hyperdrive configuration"
  value       = cloudflare_hyperdrive_config.direct.id
}

output "hyperdrive_cached_id" {
  description = "ID of the cached (60s) Hyperdrive configuration"
  value       = cloudflare_hyperdrive_config.cached.id
}

output "hyperdrive_direct_name" {
  description = "Name of the direct (no-cache) Hyperdrive configuration"
  value       = cloudflare_hyperdrive_config.direct.name
}

output "hyperdrive_cached_name" {
  description = "Name of the cached (60s) Hyperdrive configuration"
  value       = cloudflare_hyperdrive_config.cached.name
}