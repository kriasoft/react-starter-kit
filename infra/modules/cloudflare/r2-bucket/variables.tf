variable "account_id" {
  description = "Cloudflare account ID"
  type        = string
}

variable "name" {
  description = "R2 bucket name"
  type        = string
}

variable "location" {
  description = "R2 bucket location"
  type        = string
  default     = "enam"
}
