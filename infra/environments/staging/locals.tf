# Shared Local Values for Staging Environment

locals {
  # Staging domain configuration
  staging_domain = "staging.${var.domain_name}"
}