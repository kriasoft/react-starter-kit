output "connection_name" {
  description = "Cloud SQL connection name (project:region:instance)"
  value       = google_sql_database_instance.instance.connection_name
}

output "connection_string" {
  description = "PostgreSQL connection string"
  value       = "postgresql://${google_sql_user.user.name}:${random_password.password.result}@localhost/${var.database_name}?host=/cloudsql/${google_sql_database_instance.instance.connection_name}"
  sensitive   = true
}

output "instance_ip" {
  description = "Private IP address of the instance"
  value       = google_sql_database_instance.instance.private_ip_address
}
