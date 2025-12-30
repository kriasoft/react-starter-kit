output "id" {
  value       = cloudflare_worker.worker.id
  description = "Worker UUID"
}

output "name" {
  value       = cloudflare_worker.worker.name
  description = "Worker name"
}

output "subdomain_url" {
  value       = var.subdomain_enabled ? "https://${cloudflare_worker.worker.name}.workers.dev" : null
  description = "Workers.dev URL (null if subdomain disabled)"
}
