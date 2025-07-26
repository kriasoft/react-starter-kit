# Staging Environment Configuration

module "db" {
  source = "../../modules/db"

  project_name = var.project_name
  environment  = "staging"
  account_id   = var.cloudflare_account_id
}

module "storage" {
  source = "../../modules/storage"

  project_name = var.project_name
  environment  = "staging"
  account_id   = var.cloudflare_account_id
}
