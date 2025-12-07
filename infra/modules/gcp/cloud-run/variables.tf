variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region for Cloud Run service"
  type        = string
}

variable "service_name" {
  description = "Name of the Cloud Run service"
  type        = string
}

variable "image" {
  description = "Container image to deploy"
  type        = string
}

variable "env_vars" {
  description = "Environment variables for the service"
  type        = map(string)
  default     = {}
}

variable "cloud_sql_connection" {
  description = "Cloud SQL connection name (project:region:instance)"
  type        = string
  default     = null
}
