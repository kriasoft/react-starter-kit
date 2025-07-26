output "database_id" {
  description = "The ID of the D1 database"
  value       = module.db.database_id
}

output "database_name" {
  description = "The name of the D1 database"
  value       = module.db.database_name
}

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