# ------------------------------------------------------------------------------------------------------
# React storage account
# ------------------------------------------------------------------------------------------------------

resource "azurerm_storage_account" "react-storage-account" {
  name                      = "odw${var.env}storage"
  resource_group_name       = azurerm_resource_group.react-rg.name
  location                  = azurerm_resource_group.react-rg.location
  account_kind              = var.account_kind
  enable_https_traffic_only = var.enable_https_traffic
  min_tls_version           = var.min_tls_version
  account_tier              = "Standard"
  account_replication_type  = "LRS"

  static_website {
    index_document = var.index_path
  }

  blob_properties {
    cors_rule {
      allowed_methods    = var.allowed_methods
      allowed_origins    = var.allowed_origins
      allowed_headers    = var.allowed_headers
      exposed_headers    = var.exposed_headers
      max_age_in_seconds = var.max_age_in_seconds
    }
  }

  identity {
    type = var.assign_identity ? "SystemAssigned" : null
  }

}

resource "azurerm_storage_container" "react-blob-container" {
  name                  = "odw-${var.env}-container"
  storage_account_name  = azurerm_storage_account.react-storage-account.name
  container_access_type = "private"
}
