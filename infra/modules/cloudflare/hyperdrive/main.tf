terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
    }
  }
}

locals {
  # Normalize postgresql:// to postgres:// for regex parsing.
  # Limitation: credentials must not contain unencoded @ or : characters.
  # This works reliably with Neon URLs which use URL-safe generated credentials.
  db_url = replace(var.database_url, "postgresql://", "postgres://")
}

resource "cloudflare_hyperdrive_config" "hyperdrive" {
  account_id = var.account_id
  name       = var.name

  mtls = {}

  origin = {
    database = regex("^postgres://[^:]+:[^@]+@[^:/]+:[0-9]+/([^?]+)", local.db_url)[0]
    password = regex("^postgres://[^:]+:([^@]+)@", local.db_url)[0]
    host     = regex("^postgres://[^:]+:[^@]+@([^:/]+):", local.db_url)[0]
    port     = tonumber(regex("^postgres://[^:]+:[^@]+@[^:/]+:([0-9]+)/", local.db_url)[0])
    scheme   = "postgres"
    user     = regex("^postgres://([^:]+):", local.db_url)[0]
  }

  origin_connection_limit = 60

  caching = {
    disabled = true
  }
}
