module "stack" {
  source = "../../../stacks/hybrid"

  gcp_project_id = var.gcp_project_id
  gcp_region     = var.gcp_region
  project_slug   = var.project_slug
  environment    = var.environment
  api_image      = var.api_image
  cloud_sql_tier = var.cloud_sql_tier

  # --- Edge routing (optional) ---
  # enable_edge_routing = true
  # cloudflare_zone_id  = var.cloudflare_zone_id
  # hostname            = var.hostname
}

output "api_url" {
  value = module.stack.api_url
}
