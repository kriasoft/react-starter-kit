variable "project_name" {
  description = "Project name used as prefix for all resources"
  type        = string
  default     = "example"
  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.project_name))
    error_message = "Project name must contain only lowercase letters, numbers, and hyphens."
  }
}

variable "cloudflare_api_token" {
  description = "Cloudflare API token for authentication"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID"
  type        = string
  validation {
    condition     = can(regex("^[a-f0-9]{32}$", var.cloudflare_account_id))
    error_message = "Account ID must be a 32-character hexadecimal string."
  }
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID for DNS management (optional)"
  type        = string
  default     = ""
  validation {
    condition     = var.cloudflare_zone_id == "" || can(regex("^[a-f0-9]{32}$", var.cloudflare_zone_id))
    error_message = "Zone ID must be a 32-character hexadecimal string or empty."
  }
}