variable "account_id" {
  type        = string
  description = "Cloudflare account ID"
}

variable "name" {
  type        = string
  description = "Worker name (used in URLs and route configuration)"
}

variable "observability_enabled" {
  type        = bool
  description = "Enable observability (logs and metrics)"
  default     = true
}

variable "head_sampling_rate" {
  type        = number
  description = "Sampling rate for head-based sampling (0.0 to 1.0)"
  default     = 1
}

variable "subdomain_enabled" {
  type        = bool
  description = "Enable workers.dev subdomain"
  default     = false
}

variable "previews_enabled" {
  type        = bool
  description = "Enable preview deployments on workers.dev subdomain"
  default     = false
}

variable "tags" {
  type        = list(string)
  description = "Tags for organizing workers"
  default     = []
}
