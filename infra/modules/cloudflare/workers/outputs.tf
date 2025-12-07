output "script_name" {
  description = "Worker script name"
  value       = cloudflare_workers_script.script.script_name
}

output "url" {
  description = "Worker URL (workers.dev)"
  value       = "https://${cloudflare_workers_script.script.script_name}.workers.dev"
}
