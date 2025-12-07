resource "google_cloud_run_v2_service" "service" {
  name                 = var.service_name
  location             = var.region
  deletion_protection  = false
  ingress              = "INGRESS_TRAFFIC_ALL"
  invoker_iam_disabled = true # Allow public access without IAM checks

  template {
    scaling {
      min_instance_count = 0
      max_instance_count = 10
    }

    dynamic "volumes" {
      for_each = var.cloud_sql_connection != null ? [1] : []
      content {
        name = "cloudsql"
        cloud_sql_instance {
          instances = [var.cloud_sql_connection]
        }
      }
    }

    containers {
      image = var.image

      ports {
        container_port = 8080
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
        cpu_idle = true
      }

      dynamic "volume_mounts" {
        for_each = var.cloud_sql_connection != null ? [1] : []
        content {
          name       = "cloudsql"
          mount_path = "/cloudsql"
        }
      }

      dynamic "env" {
        for_each = var.env_vars
        content {
          name  = env.key
          value = env.value
        }
      }
    }
  }

  lifecycle {
    ignore_changes = [
      template[0].containers[0].image, # Allow gcloud to deploy new images
      template[0].revision,
      template[0].labels,
    ]
  }
}
