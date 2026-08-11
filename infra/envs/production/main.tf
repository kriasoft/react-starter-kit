# Production environment: the live target for app deploys.
#
# One directory = one Terraform root = one HCP Terraform workspace = one state.
# `environment` and the workspace name are hard-coded rather than variables:
# making either configurable would let this root target another environment, and
# Terraform refuses to run when TF_WORKSPACE disagrees with the name below.
# See docs/adr/003-hcp-terraform-state.md.

terraform {
  required_version = ">= 1.12, < 2.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }

  # State, locking and versioned history live in HCP Terraform. All three
  # coordinates are committed, so no environment variable can retarget this
  # root – rename the `example` placeholders alongside the others.
  cloud {
    hostname     = "app.terraform.io"
    organization = "example"

    workspaces {
      name = "example-production"
    }
  }
}

# Runs execute in HCP Terraform under the Remote execution mode the setup
# configures, so this token comes from the workspace's environment variables.
# Terraform does not forward a local one.
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
