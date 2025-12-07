variable "cloudflare_api_token" {
  type      = string
  sensitive = true
}

variable "cloudflare_account_id" {
  type = string
}

variable "cloudflare_zone_id" {
  type    = string
  default = ""
}

variable "hostname" {
  type    = string
  default = ""
}

variable "project_slug" {
  type = string
}

variable "environment" {
  type = string
}

variable "neon_database_url" {
  type      = string
  sensitive = true
}
