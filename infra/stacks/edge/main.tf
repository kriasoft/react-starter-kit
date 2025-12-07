# Edge stack: Cloudflare infrastructure for Workers deployment.
# Workers are deployed separately via Wrangler.

module "hyperdrive" {
  source = "../../modules/cloudflare/hyperdrive"

  account_id   = var.cloudflare_account_id
  name         = "${var.project_slug}-${var.environment}"
  database_url = var.neon_database_url
}

module "dns" {
  count  = var.hostname != "" ? 1 : 0
  source = "../../modules/cloudflare/dns"

  zone_id  = var.cloudflare_zone_id
  hostname = var.hostname
}
