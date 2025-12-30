# Edge stack: Cloudflare infrastructure for Workers deployment.
# Worker metadata created here; code + routes deployed via Wrangler.

locals {
  worker_suffix     = var.environment == "prod" ? "" : "-${var.environment}"
  has_custom_domain = var.cloudflare_zone_id != "" && var.hostname != ""
}

# API Worker (tRPC, auth endpoints)
module "worker_api" {
  source = "../../modules/cloudflare/worker"

  account_id            = var.cloudflare_account_id
  name                  = "${var.project_slug}-api${local.worker_suffix}"
  observability_enabled = true
  subdomain_enabled     = !local.has_custom_domain

  tags = [var.project_slug, var.environment]
}

# App Worker (SPA with static assets)
module "worker_app" {
  source = "../../modules/cloudflare/worker"

  account_id            = var.cloudflare_account_id
  name                  = "${var.project_slug}-app${local.worker_suffix}"
  observability_enabled = true
  subdomain_enabled     = !local.has_custom_domain

  tags = [var.project_slug, var.environment]
}

# Web Worker (marketing site, edge router)
module "worker_web" {
  source = "../../modules/cloudflare/worker"

  account_id            = var.cloudflare_account_id
  name                  = "${var.project_slug}-web${local.worker_suffix}"
  observability_enabled = true
  subdomain_enabled     = !local.has_custom_domain

  tags = [var.project_slug, var.environment]
}

module "hyperdrive" {
  source = "../../modules/cloudflare/hyperdrive"

  account_id   = var.cloudflare_account_id
  name         = "${var.project_slug}-${var.environment}"
  database_url = var.neon_database_url
}

module "dns" {
  count  = local.has_custom_domain ? 1 : 0
  source = "../../modules/cloudflare/dns"

  zone_id  = var.cloudflare_zone_id
  hostname = var.hostname
}
