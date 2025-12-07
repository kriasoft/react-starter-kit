resource "google_sql_database_instance" "instance" {
  name             = var.instance_name
  database_version = "POSTGRES_18"

  settings {
    edition = "ENTERPRISE"
    tier    = var.tier

    disk_size = 10
    disk_type = "PD_SSD"

    ip_configuration {
      ipv4_enabled    = var.private_network_id == null
      private_network = var.private_network_id
    }

    backup_configuration {
      enabled = false
    }
  }
}

resource "google_sql_database" "database" {
  name     = var.database_name
  instance = google_sql_database_instance.instance.name
}

resource "random_password" "password" {
  length           = 32
  special          = true
  override_special = "-_"
}

resource "google_sql_user" "user" {
  name     = var.database_name
  instance = google_sql_database_instance.instance.name
  password = random_password.password.result
}
