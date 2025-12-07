# NOTE: Workers are typically deployed via Wrangler CLI, not Terraform.
# This module creates the script configuration; deploy code with:
#   wrangler deploy --name <script_name>

terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
    }
  }
}

resource "cloudflare_workers_script" "script" {
  account_id  = var.account_id
  script_name = var.name

  # Placeholder content - real code deployed via Wrangler
  content     = var.content != "" ? var.content : "export default { fetch() { return new Response('Deploy via Wrangler') } }"
  main_module = "worker.js"

  bindings = concat(
    [for k, v in var.env_vars : {
      name = k
      text = v
      type = "plain_text"
    }],
    [for k, v in var.hyperdrive_bindings : {
      name = k
      id   = v
      type = "hyperdrive"
    }]
  )
}
