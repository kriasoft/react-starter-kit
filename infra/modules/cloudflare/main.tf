# Durable Cloudflare resources that the Workers consume.
#
# Terraform owns long-lived dependencies (database pools and object storage).
# Wrangler owns Workers, routes, domains, bindings, secrets, and code; keep the
# sets disjoint so the tools cannot overwrite each other's changes.

terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
    }
  }
}

locals {
  # Hyperdrive stores the connection as discrete fields and Terraform has no URL
  # parser, so the URL is split with one anchored regex. Anything after `?` is
  # dropped: TLS to the origin is Hyperdrive's setting, not the client's.
  # `variables.tf` validates the same shape and explains the fix on mismatch.
  dsn = regex("^postgres(?:ql)?://(?P<user>[^:@/]+):(?P<password>[^@/]*)@(?P<host>[^:@/?#]+)(?::(?P<port>[0-9]+))?/(?P<database>[^?/]+)", var.database_url)

  origin = {
    scheme   = "postgres"
    host     = local.dsn.host
    port     = local.dsn.port == null ? 5432 : tonumber(local.dsn.port)
    user     = local.dsn.user
    password = local.dsn.password
    database = local.dsn.database
  }
}

# Cached reads. Safe for anything that tolerates the configured cache window –
# marketing copy, dashboards, list views. Reads through this binding can miss a
# write made moments earlier; anything that must not, uses `uncached` below.
resource "cloudflare_hyperdrive_config" "cached" {
  account_id = var.account_id
  name       = "${var.project_slug}-${var.environment}-cached"

  origin                  = local.origin
  origin_connection_limit = var.origin_connection_limit

  # Set explicitly rather than inherited, so the staleness window is reviewable
  # here instead of being whatever Cloudflare currently defaults to.
  caching = {
    disabled               = false
    max_age                = var.cache_max_age_seconds
    stale_while_revalidate = var.cache_stale_while_revalidate_seconds
  }
}

# Fresh reads and every write. Sessions, permissions, billing and read-after-write
# must never see a stale row, so this configuration disables caching entirely.
# Still pooled by Hyperdrive – only the query cache is off, which is why it is
# named "uncached" rather than "direct".
resource "cloudflare_hyperdrive_config" "uncached" {
  account_id = var.account_id
  name       = "${var.project_slug}-${var.environment}-uncached"

  origin                  = local.origin
  origin_connection_limit = var.origin_connection_limit

  caching = {
    disabled = true
  }
}

# Object storage for user uploads. Off by default – turn it on when you follow
# the file uploads recipe (docs/recipes/file-uploads.md). This is application
# storage; it must not be the bucket holding this configuration's own state.
resource "cloudflare_r2_bucket" "uploads" {
  count = var.uploads_enabled ? 1 : 0

  account_id = var.account_id
  name       = "${var.project_slug}-${var.environment}-uploads"
  location   = var.uploads_location_hint
}

# Browsers refuse a presigned PUT to a bucket with no CORS policy, however valid
# the signature is – so the policy ships with the bucket rather than being a step
# someone discovers from a failed preflight.
#
# PUT only: the recipe uploads directly to R2 but reads back through the API
# worker, so the browser never needs GET here.
resource "cloudflare_r2_bucket_cors" "uploads" {
  count = var.uploads_enabled ? 1 : 0

  account_id  = var.account_id
  bucket_name = cloudflare_r2_bucket.uploads[0].name

  rules = [{
    allowed = {
      origins = var.uploads_cors_origins
      methods = ["PUT"]
      headers = ["content-type"]
    }
    max_age_seconds = 3600
  }]
}
