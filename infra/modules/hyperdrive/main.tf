resource "cloudflare_hyperdrive_config" "direct" {
  account_id = var.account_id
  name       = "${var.project_name}-${var.environment}-direct"

  mtls = {}

  origin = {
    database = var.database_name
    password = var.database_password
    host     = var.database_host
    port     = var.database_port
    scheme   = "postgres"
    user     = var.database_user
  }

  origin_connection_limit = 60

  caching = {
    disabled = true
  }
}

resource "cloudflare_hyperdrive_config" "cached" {
  account_id = var.account_id
  name       = "${var.project_name}-${var.environment}-cached"

  mtls = {}

  origin = {
    database = var.database_name
    password = var.database_password
    host     = var.database_host
    port     = var.database_port
    scheme   = "postgres"
    user     = var.database_user
  }

  origin_connection_limit = 60

  caching = {
    disabled               = false
    max_age                = 60
    stale_while_revalidate = 30
  }
}
