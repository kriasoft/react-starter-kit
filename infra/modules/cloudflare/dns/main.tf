# Proxied DNS record for Cloudflare Workers routing.
# Workers and routes are managed via Wrangler, not Terraform.

terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
    }
  }
}

resource "cloudflare_dns_record" "record" {
  zone_id = var.zone_id
  name    = var.hostname
  type    = "AAAA"
  content = "100::"
  ttl     = 1 # Auto (required for proxied records)
  proxied = true
  comment = "Managed by Terraform"
}
