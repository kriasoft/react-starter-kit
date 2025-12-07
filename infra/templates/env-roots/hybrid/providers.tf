terraform {
  required_version = ">= 1.12, < 2.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 7.0"
    }
  }
}
# See "Provider Versions" in docs/specs/infra-terraform.md

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

# --- Edge routing (optional) ---
# Add these blocks to enable Cloudflare in front of Cloud Run.
# Terraform initializes providers before planning, so credentials are required
# even if no resources use them.
#
#   cloudflare = {
#     source  = "cloudflare/cloudflare"
#     version = "~> 5.0"
#   }
#
# provider "cloudflare" {
#   api_token = var.cloudflare_api_token
# }
