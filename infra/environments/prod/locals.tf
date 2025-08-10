# Shared Local Values for Production Environment

locals {
  # Production domain configuration
  production_domain = var.domain_name
  www_domain        = "www.${var.domain_name}"
}