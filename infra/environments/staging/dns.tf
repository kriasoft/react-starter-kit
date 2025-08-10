# DNS Configuration for Staging Environment

# Staging subdomain (staging.example.com) - A record
resource "cloudflare_dns_record" "staging" {
  zone_id = var.cloudflare_zone_id
  name    = "staging"
  type    = "A"
  content = "192.0.2.1"
  ttl     = 1 # Auto TTL
  proxied = true
  comment = "Staging environment"
}