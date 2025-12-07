variable "account_id" {
  description = "Cloudflare account ID"
  type        = string
}

variable "name" {
  description = "Hyperdrive configuration name"
  type        = string
}

variable "database_url" {
  description = "PostgreSQL connection URL in format postgres://user:pass@host:port/db (port required, no special chars in credentials)"
  type        = string
  sensitive   = true

  validation {
    condition     = can(regex("^postgres(ql)?://[^:]+:[^@]+@[^:/]+:[0-9]+/[^?]+", var.database_url))
    error_message = "Invalid database_url format. Expected: postgres://user:pass@host:port/db (port required, credentials must not contain unencoded @ or :)"
  }
}
