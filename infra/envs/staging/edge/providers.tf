terraform {
  required_version = ">= 1.12, < 2.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
# See "Provider Versions" in docs/specs/infra-terraform.md
