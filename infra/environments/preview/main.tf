# Preview Environment Configuration

module "hyperdrive" {
  source = "../../modules/hyperdrive"

  project_name      = var.project_name
  environment       = "preview"
  account_id        = var.cloudflare_account_id
  database_host     = var.database_host
  database_name     = var.database_name
  database_user     = var.database_user
  database_password = var.database_password
}
