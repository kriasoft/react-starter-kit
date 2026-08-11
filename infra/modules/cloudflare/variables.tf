variable "account_id" {
  description = "Cloudflare account ID."
  type        = string
}

variable "project_slug" {
  description = "Resource name prefix. Match the worker name prefix in apps/*/wrangler.jsonc (\"example\" for example-api)."
  type        = string

  validation {
    condition     = can(regex("^[a-z0-9]([a-z0-9-]*[a-z0-9])?$", var.project_slug))
    error_message = "project_slug must be lowercase alphanumeric with inner hyphens, e.g. \"acme-app\"."
  }

  # R2 bucket names cap at 63 characters and the longest generated name is
  # "<slug>-production-uploads" (19 characters of suffix). Fail here rather
  # than in the provider once uploads are switched on.
  validation {
    condition     = length(var.project_slug) <= 44
    error_message = "project_slug must be 44 characters or fewer so generated resource names stay within Cloudflare's limits."
  }
}

variable "environment" {
  description = "Environment name. Set by each env root, never by a tfvars file."
  type        = string
}

variable "database_url" {
  description = "PostgreSQL connection URL for the origin database."
  type        = string
  sensitive   = true

  validation {
    condition     = can(regex("^postgres(ql)?://[^:@/]+:[^@/]*@[^:@/?#]+(:[0-9]+)?/[^?/#]+(\\?[^#]*)?$", var.database_url))
    error_message = <<-EOT
      database_url must be a PostgreSQL connection URL:
        postgres://USER:PASSWORD@HOST[:PORT]/DATABASE[?params]
      The port is optional and defaults to 5432. Query parameters are ignored.
      Trailing path segments and URL fragments are rejected rather than dropped.
    EOT
  }

  # Terraform has no urldecode function, so percent-encoded credentials would be
  # stored verbatim and authentication would fail. Reject them with a clear cause.
  validation {
    condition     = !can(regex("^postgres(ql)?://[^@/]*%", var.database_url))
    error_message = <<-EOT
      Percent-encoded credentials are not supported: Terraform cannot decode them,
      so the escape sequence would be stored verbatim.
      Rotate to a password with no @ / or % characters, or connect Hyperdrive
      to a dedicated database role created for it.
    EOT
  }

  # Hyperdrive is itself the connection pool. Neon's pooled endpoint runs in
  # transaction mode, which breaks the prepared statements Hyperdrive caches on,
  # and stacks a second pool competing for the same connection budget.
  validation {
    condition     = !can(regex("-pooler\\.", var.database_url))
    error_message = "Use Neon's unpooled connection string with Hyperdrive: remove \"-pooler\" from the hostname."
  }
}

variable "origin_connection_limit" {
  description = "Soft maximum connections each Hyperdrive configuration opens to the origin; Cloudflare may briefly exceed it. Both configurations use this value, so budget at least twice it plus headroom."
  type        = number
  default     = 20

  # Cloudflare's own ceiling is ~20 per configuration on the Workers Free plan
  # and ~100 on Paid, with a floor of 5. The default stays inside the free
  # ceiling so the starter works on every plan; raise it once you are on Paid
  # and have confirmed the database's max_connections has room for 2x.
  validation {
    condition     = var.origin_connection_limit >= 5 && var.origin_connection_limit <= 100
    error_message = "origin_connection_limit must be between 5 and 100."
  }
}

variable "cache_max_age_seconds" {
  description = "How long a cached query result is served before revalidation."
  type        = number
  default     = 60
}

variable "cache_stale_while_revalidate_seconds" {
  description = "How long a stale result may still be served while it refreshes in the background."
  type        = number
  default     = 15
}

variable "uploads_enabled" {
  description = "Provision R2 storage for user uploads (bucket plus CORS policy). See docs/recipes/file-uploads.md."
  type        = bool
  default     = false
}

variable "uploads_location_hint" {
  description = "Optional R2 location hint (wnam, enam, weur, eeur, apac, oc). Null lets Cloudflare choose."
  type        = string
  default     = null

  # A hint says where the data will mostly be read, not where it must live.
  # Defaulting to a region would quietly bias every clone toward it, so the
  # default is no hint at all.
  validation {
    condition     = var.uploads_location_hint == null || contains(["wnam", "enam", "weur", "eeur", "apac", "oc"], var.uploads_location_hint)
    error_message = "uploads_location_hint must be one of wnam, enam, weur, eeur, apac, oc - or null to let Cloudflare choose."
  }
}

variable "uploads_cors_origins" {
  description = "Origins allowed to upload directly to the bucket, e.g. [\"https://example.com\"]. Required when uploads_enabled is true."
  type        = list(string)
  default     = []

  # An empty list would deploy a bucket that rejects every browser upload, which
  # surfaces as an opaque CORS failure rather than a Terraform error.
  validation {
    condition     = !var.uploads_enabled || length(var.uploads_cors_origins) > 0
    error_message = "Set uploads_cors_origins to your application origin(s) when uploads_enabled is true, or browsers cannot upload to the bucket."
  }

  validation {
    condition     = !contains(var.uploads_cors_origins, "*")
    error_message = "Refusing \"*\": a wildcard origin lets any site upload to your bucket with a presigned URL. List the exact origins."
  }
}
