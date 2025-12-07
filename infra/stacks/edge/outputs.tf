output "api_url" {
  value       = var.hostname != "" ? "https://${var.hostname}/api" : module.worker.url
  description = "Public API URL (custom domain or workers.dev)"
}
