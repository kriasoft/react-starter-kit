# Production environment: the live target for app deploys.
#
# One directory = one Terraform root = one HCP Terraform workspace = one state.
# `environment` is hard-coded rather than declared as a variable: the directory
# already answers that question, and a variable would let this state create
# resources named for a different environment.
#
# That pins the names, not the state – TF_WORKSPACE still selects which state is
# written. The precondition on the first output closes that gap.

terraform {
  required_version = ">= 1.12, < 2.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }

  # State, locking and versioned history live in HCP Terraform. Both the
  # organization and workspace are supplied out of band so a fork carries no
  # deployment targets. See the root infra:* scripts.
  cloud {}
}

# Runs execute in HCP Terraform by default, so this token comes from the
# workspace's environment variables rather than a developer's shell.
provider "cloudflare" {}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID."
  type        = string
}

variable "project_slug" {
  description = "Resource name prefix. Match the worker name prefix in apps/*/wrangler.jsonc."
  type        = string
}

variable "database_url" {
  description = "Unpooled PostgreSQL connection URL. Mark this sensitive in the workspace."
  type        = string
  sensitive   = true
}

# Each of the two Hyperdrive configurations gets this limit. Tune it to the
# origin database's capacity, leaving headroom for other clients.
variable "origin_connection_limit" {
  description = "Soft maximum connections each Hyperdrive configuration opens to the origin; Cloudflare may briefly exceed it. Both configurations use this value, so budget at least twice it plus headroom."
  type        = number
  default     = 20
}

module "edge" {
  source = "../../modules/cloudflare"

  account_id              = var.cloudflare_account_id
  project_slug            = var.project_slug
  environment             = "production"
  database_url            = var.database_url
  origin_connection_limit = var.origin_connection_limit
}

output "hyperdrive_cached_id" {
  description = "Hyperdrive ID for the HYPERDRIVE_CACHED binding."
  value       = module.edge.hyperdrive_cached_id

  # TF_WORKSPACE selects state, and an exported value overrides the local env
  # file; require this suffix to keep the root on production state.
  precondition {
    condition     = endswith(terraform.workspace, "-production")
    error_message = "Refusing to run: the production root requires an HCP workspace name ending in \"-production\", but TF_WORKSPACE resolved to \"${terraform.workspace}\". Check for an exported TF_WORKSPACE overriding .env.terraform.production.local."
  }
}

output "hyperdrive_uncached_id" {
  description = "Hyperdrive ID for the HYPERDRIVE_UNCACHED binding."
  value       = module.edge.hyperdrive_uncached_id
}

output "uploads_bucket_name" {
  description = "R2 uploads bucket name, or null when uploads are not enabled."
  value       = module.edge.uploads_bucket_name
}

output "wrangler_hyperdrive_bindings" {
  description = "Paste into the matching environment block of apps/api/wrangler.jsonc."
  value       = module.edge.wrangler_hyperdrive_bindings
}
