# DNS Configuration for Production Environment

locals {
  # GitHub Pages official IP addresses (updates rare but possible)
  # Multiple IPs required for load balancing - cannot use single A record
  # https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
  github_pages_ipv4 = [
    "185.199.108.153",
    "185.199.109.153",
    "185.199.110.153",
    "185.199.111.153",
  ]
  github_pages_ipv6 = [
    "2606:50c0:8000::153",
    "2606:50c0:8001::153",
    "2606:50c0:8002::153",
    "2606:50c0:8003::153",
  ]
}

# Apex domain A records for GitHub Pages (creates 4 separate records)
# CONSTRAINT: proxied=true required for Cloudflare Workers
resource "cloudflare_dns_record" "apex_a" {
  count   = length(local.github_pages_ipv4)
  zone_id = var.cloudflare_zone_id
  name    = "@"
  type    = "A"
  content = local.github_pages_ipv4[count.index]
  ttl     = 1 # Auto TTL (managed by Cloudflare when proxied=true)
  proxied = true
  comment = "Apex domain (GitHub Pages IPv4)"
}

# Apex domain AAAA records for GitHub Pages IPv6 (creates 4 separate records)
resource "cloudflare_dns_record" "apex_aaaa" {
  count   = length(local.github_pages_ipv6)
  zone_id = var.cloudflare_zone_id
  name    = "@"
  type    = "AAAA"
  content = local.github_pages_ipv6[count.index]
  ttl     = 1 # Auto TTL (managed by Cloudflare when proxied=true)
  proxied = true
  comment = "Apex domain (GitHub Pages IPv6)"
}

# WWW subdomain CNAME to apex domain
# EDGE CASE: If var.domain_name includes 'www', creates circular reference
resource "cloudflare_dns_record" "www" {
  zone_id = var.cloudflare_zone_id
  name    = "www"
  type    = "CNAME"
  content = var.domain_name # Must be apex domain without 'www' prefix
  ttl     = 1               # Auto TTL (managed by Cloudflare when proxied=true)
  proxied = true
  comment = "WWW subdomain CNAME to apex"
}
