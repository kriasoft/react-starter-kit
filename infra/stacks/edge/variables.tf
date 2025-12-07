variable "cloudflare_account_id" {
  type        = string
  description = "Cloudflare account ID"
}

variable "cloudflare_zone_id" {
  type        = string
  description = "Cloudflare zone ID (required when hostname is set)"
  default     = ""
}

variable "hostname" {
  type        = string
  description = "Public hostname (e.g., api.example.com). If empty, uses workers.dev URL."
  default     = ""
}

variable "project_slug" {
  type        = string
  description = "Short identifier for resource naming (e.g., myapp)"
}

variable "environment" {
  type        = string
  description = "Environment name (e.g., dev, staging, prod)"
}

variable "neon_database_url" {
  type        = string
  description = "Neon PostgreSQL connection string"
  sensitive   = true
}
