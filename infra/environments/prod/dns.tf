# DNS Configuration for Production Environment

# Apex domain (example.com) - A record
resource "cloudflare_dns_record" "apex" {
  zone_id = var.cloudflare_zone_id
  name    = "@"
  type    = "A"
  content = "192.0.2.1"
  ttl     = 1 # Auto TTL
  proxied = true
  comment = "Production apex domain"
}

# WWW subdomain (www.example.com) - A record
resource "cloudflare_dns_record" "www" {
  zone_id = var.cloudflare_zone_id
  name    = "www"
  type    = "A"
  content = "192.0.2.1"
  ttl     = 1 # Auto TTL
  proxied = true
  comment = "Production WWW subdomain"
}