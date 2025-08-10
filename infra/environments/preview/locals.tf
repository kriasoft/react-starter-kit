# Shared Local Values for Preview Environment

locals {
  # Preview deployment slot codenames
  # These are used for DNS records, OAuth callbacks, and other per-PR resources
  preview_slots = [
    "paris",
    "london",
    "rome",
    "tokyo",
    "berlin",
    "madrid",
    "sydney",
    "moscow",
    "cairo",
    "dubai",
    "milan",
    "oslo",
    "seoul",
    "miami",
    "vegas",
    "vienna",
    "athens",
    "dublin",
    "zurich",
    "geneva"
  ]

  # Computed values for preview slots
  preview_domains     = [for slot in local.preview_slots : "${slot}.${var.domain_name}"]
  oauth_callback_urls = [for slot in local.preview_slots : "https://${slot}.${var.domain_name}/auth/callback"]
}
