variable "gcp_project_id" {
  type = string
}

variable "gcp_region" {
  type = string
}

variable "project_slug" {
  type        = string
  description = "Short identifier for resource naming (e.g., myapp)"
}

variable "environment" {
  type        = string
  description = "Environment name (e.g., dev, staging, prod)"
}

variable "api_image" {
  type = string
}

variable "cloud_sql_tier" {
  type        = string
  description = "Cloud SQL instance tier (e.g., db-f1-micro)"
  default     = "db-f1-micro"
}

# --- Edge routing (optional) ---
# Uncomment to add Cloudflare edge layer in front of Cloud Run.
# Also uncomment the Cloudflare provider in providers.tf and module inputs in main.tf.
#
# variable "cloudflare_api_token" {
#   type      = string
#   sensitive = true
# }
#
# variable "cloudflare_zone_id" {
#   type    = string
#   default = ""
# }
#
# variable "hostname" {
#   type = string
# }
