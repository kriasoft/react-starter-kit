variable "zone_id" {
  description = "Cloudflare zone ID"
  type        = string
}

variable "hostname" {
  description = "DNS hostname (e.g., 'example.com' or 'staging.example.com')"
  type        = string
}
