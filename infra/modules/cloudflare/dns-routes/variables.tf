variable "account_id" {
  description = "Cloudflare account ID"
  type        = string
}

variable "zone_id" {
  description = "Cloudflare zone ID"
  type        = string
}

variable "hostname" {
  description = "DNS hostname (e.g., 'api' or 'app')"
  type        = string
}

variable "routes" {
  description = "Map of route patterns to worker script names"
  type        = map(string)
  default     = {}
}
