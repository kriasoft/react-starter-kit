# Production Environment Configuration

module "db" {
  source = "../../modules/db"

  project_name = var.project_name
  environment  = "prod"
  account_id   = var.cloudflare_account_id
}

module "storage" {
  source = "../../modules/storage"

  project_name = var.project_name
  environment  = "prod"
  account_id   = var.cloudflare_account_id
}

resource "cloudflare_workers_kv_namespace" "cache" {
  account_id = var.cloudflare_account_id
  title      = "${var.project_name}-cache-prod"
}
