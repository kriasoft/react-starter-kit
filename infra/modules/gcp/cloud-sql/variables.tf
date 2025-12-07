variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region for Cloud SQL instance"
  type        = string
}

variable "instance_name" {
  description = "Name of the Cloud SQL instance"
  type        = string
}

variable "tier" {
  description = "Machine tier for Cloud SQL instance"
  type        = string
  default     = "db-f1-micro"
}

variable "database_name" {
  description = "Name of the database to create"
  type        = string
}

variable "private_network_id" {
  description = "VPC network ID for private IP (optional, enables public IP if not set)"
  type        = string
  default     = null
}
