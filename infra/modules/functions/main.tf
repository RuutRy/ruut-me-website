resource "azurerm_storage_account" "backend" {
  name                     = "ruutwebbackend"
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_service_plan" "backend" {
  name                = "ruut-backend-app-service-plan"
  resource_group_name = var.resource_group_name
  location            = var.location
  os_type             = "Linux"
  sku_name            = "Y1"
}


resource "azurerm_linux_function_app" "backend" {
  name                = "ruut-backend-function-app"
  resource_group_name = var.resource_group_name
  location            = var.location

  storage_account_name       = azurerm_storage_account.backend.name
  storage_account_access_key = azurerm_storage_account.backend.primary_access_key
  service_plan_id            = azurerm_service_plan.backend.id

  connection_string {
    name  = "COSMOS_CONNECTION_STRING"
    type  = "SQLServer"
    value = var.connection_string
  }
  site_config {
    application_stack {
      python_version = "3.10"
    }
    cors {
      allowed_origins = [ # For easier testing
        "https://portal.azure.com"
      ]
    }
  }
}

