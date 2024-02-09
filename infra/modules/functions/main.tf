resource "azurerm_storage_account" "backend" {
  name                     = "ruut-web-backend"
  resource_group_name      = var.resource_group_name
  location                 = var.resource_group_name
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_service_plan" "backend" {
  name                = "ruut-backend-app-service-plan"
  resource_group_name = var.resource_group_name
  location            = var.resource_group_name
  os_type             = "Linux"
  sku_name            = "Y1"
}

resource "azurerm_linux_function_app" "backend" {
  name                = "ruut-backend-function-app"
  resource_group_name = var.resource_group_name
  location            = var.resource_group_name

  storage_account_name       = azurerm_storage_account.backend.name
  storage_account_access_key = azurerm_storage_account.backend.primary_access_key
  service_plan_id            = azurerm_service_plan.backend.id

  site_config {}
}
