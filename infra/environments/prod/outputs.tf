output "main_bucket_name" {
  description = "The name of the main R2 bucket"
  value       = module.storage.main_bucket_name
}

output "uploads_bucket_name" {
  description = "The name of the uploads R2 bucket"
  value       = module.storage.uploads_bucket_name
}

output "cache_namespace_id" {
  description = "The ID of the KV cache namespace"
  value       = cloudflare_workers_kv_namespace.cache.id
}

output "hyperdrive_direct_id" {
  description = "ID of the direct (no-cache) Hyperdrive configuration"
  value       = module.hyperdrive.hyperdrive_direct_id
}

output "hyperdrive_cached_id" {
  description = "ID of the cached (60s) Hyperdrive configuration"
  value       = module.hyperdrive.hyperdrive_cached_id
}