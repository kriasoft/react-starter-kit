variable "gcp_project_id" {
  type        = string
  description = "GCP project ID"
}

variable "gcp_region" {
  type        = string
  description = "GCP region (e.g., us-central1)"
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
  type        = string
  description = "Container image URL for Cloud Run API service"
}

variable "cloud_sql_tier" {
  type        = string
  description = "Cloud SQL instance tier (e.g., db-f1-micro)"
  default     = "db-f1-micro"
}

variable "enable_edge_routing" {
  type        = bool
  description = "Enable Cloudflare edge routing in front of Cloud Run"
  default     = false
}

variable "cloudflare_zone_id" {
  type        = string
  description = "Cloudflare zone ID (required when enable_edge_routing = true and hostname is set)"
  default     = ""
}

variable "hostname" {
  type        = string
  description = "Public hostname for edge routing (e.g., api-gcp.example.com)"
  default     = ""
}
