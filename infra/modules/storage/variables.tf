variable "project_name" {
  description = "Project name used as prefix for resources"
  type        = string
  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.project_name))
    error_message = "Project name must contain only lowercase letters, numbers, and hyphens."
  }
}

variable "environment" {
  description = "Environment name (preview, staging, prod)"
  type        = string
  validation {
    condition     = contains(["preview", "staging", "prod"], var.environment)
    error_message = "Environment must be preview, staging, or prod."
  }
}

variable "account_id" {
  description = "Cloudflare account ID"
  type        = string
  validation {
    condition     = can(regex("^[a-f0-9]{32}$", var.account_id))
    error_message = "Account ID must be a 32-character hexadecimal string."
  }
}

variable "r2_location" {
  description = "R2 bucket location region"
  type        = string
  default     = "enam"
  validation {
    condition     = contains(["apac", "eeur", "enam", "weur", "wnam", "oc"], var.r2_location)
    error_message = "R2 location must be one of: apac, eeur, enam, weur, wnam, oc."
  }
}
