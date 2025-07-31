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

variable "database_host" {
  description = "PostgreSQL database host"
  type        = string
}

variable "database_port" {
  description = "PostgreSQL database port"
  type        = number
  default     = 5432
}

variable "database_name" {
  description = "PostgreSQL database name"
  type        = string
}

variable "database_user" {
  description = "PostgreSQL database user"
  type        = string
}

variable "database_password" {
  description = "PostgreSQL database password"
  type        = string
  sensitive   = true
}