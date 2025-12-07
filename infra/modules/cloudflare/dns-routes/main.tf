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

resource "cloudflare_workers_route" "route" {
  for_each = var.routes

  account_id = var.account_id
  zone_id    = var.zone_id
  pattern    = each.key
  script     = each.value
}
