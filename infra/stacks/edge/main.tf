module "hyperdrive" {
  source = "../../modules/cloudflare/hyperdrive"

  account_id   = var.cloudflare_account_id
  name         = "${var.project_slug}-${var.environment}"
  database_url = var.neon_database_url
}

module "worker" {
  source = "../../modules/cloudflare/workers"

  account_id = var.cloudflare_account_id
  name       = "${var.project_slug}-api-${var.environment}"

  hyperdrive_bindings = {
    DB = module.hyperdrive.id
  }
}
# Worker module output contract:
#   script_name - Required for route binding
#   url         - workers.dev URL (fallback when no custom domain)

module "dns_routes" {
  count  = var.hostname != "" ? 1 : 0
  source = "../../modules/cloudflare/dns-routes"

  account_id = var.cloudflare_account_id
  zone_id    = var.cloudflare_zone_id
  hostname   = var.hostname

  # Workers module must export script_name for route binding
  routes = {
    "api/*" = module.worker.script_name
  }
}

