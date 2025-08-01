output "hyperdrive_direct_id" {
  description = "ID of the direct (no-cache) Hyperdrive configuration"
  value       = module.hyperdrive.hyperdrive_direct_id
}

output "hyperdrive_cached_id" {
  description = "ID of the cached (60s) Hyperdrive configuration"
  value       = module.hyperdrive.hyperdrive_cached_id
}
