# DNS Configuration for Preview Environment

# Create A records for preview deployment slots
resource "cloudflare_dns_record" "preview_slots" {
  for_each = toset(local.preview_slots)

  zone_id = var.cloudflare_zone_id
  name    = each.value
  type    = "A"
  content = "192.0.2.1"
  ttl     = 1 # Auto TTL
  proxied = true
  comment = "Preview deployment slot"
}
