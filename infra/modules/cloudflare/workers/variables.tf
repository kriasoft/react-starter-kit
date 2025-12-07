variable "account_id" {
  description = "Cloudflare account ID"
  type        = string
}

variable "name" {
  description = "Worker script name"
  type        = string
}

variable "content" {
  description = "Worker script content (optional, deploy via Wrangler instead)"
  type        = string
  default     = ""
}

variable "env_vars" {
  description = "Plain text environment variables (name -> value)"
  type        = map(string)
  default     = {}
}

variable "hyperdrive_bindings" {
  description = "Hyperdrive bindings (name -> config_id)"
  type        = map(string)
  default     = {}
}
