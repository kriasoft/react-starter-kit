output "api_url" {
  value       = module.api.url
  description = "Cloud Run service URL"
}

output "edge_api_url" {
  value       = var.enable_edge_routing && var.hostname != "" ? "https://${var.hostname}/api" : null
  description = "Public API URL via Cloudflare edge (null if edge routing disabled or no hostname)"
}
