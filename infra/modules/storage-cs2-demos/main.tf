# ------------------------------------------------------------------------------------------------------
# CS2 demo file storage
# Public blob read allows direct download links; uploads require a SAS token.
# ------------------------------------------------------------------------------------------------------

resource "azurerm_storage_account" "cs2-demos" {
  name                      = "cs2demos${var.env}"
  resource_group_name       = var.resource_group_name
  location                  = var.location
  account_kind              = var.account_kind
  enable_https_traffic_only = var.enable_https_traffic
  min_tls_version           = var.min_tls_version
  account_tier              = "Standard"
  account_replication_type  = "LRS"
  access_tier               = var.access_tier

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

resource "azurerm_storage_container" "cs2-demos" {
  name                  = "cs2-demos-${var.env}-container"
  storage_account_name  = azurerm_storage_account.cs2-demos.name
  container_access_type = "blob"
}
