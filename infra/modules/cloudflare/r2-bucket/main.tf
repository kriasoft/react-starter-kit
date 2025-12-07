terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
    }
  }
}

resource "cloudflare_r2_bucket" "bucket" {
  account_id = var.account_id
  name       = var.name
  location   = var.location
}
