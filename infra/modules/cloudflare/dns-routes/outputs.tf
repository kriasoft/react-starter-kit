output "route_ids" {
  description = "Map of route patterns to route IDs"
  value       = { for k, v in cloudflare_workers_route.route : k => v.id }
}
