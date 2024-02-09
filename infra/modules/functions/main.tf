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

data "archive_file" "python_function_package" {  
  type = "zip"  
  source_file = "../../../api/src/app.py" 
  output_path = "function.zip"
}

resource "azurerm_linux_function_app" "backend" {
  name                = "ruut-backend-function-app"
  resource_group_name = var.resource_group_name
  location            = var.location

  storage_account_name       = azurerm_storage_account.backend.name
  storage_account_access_key = azurerm_storage_account.backend.primary_access_key
  service_plan_id            = azurerm_service_plan.backend.id

  zip_deploy_file = data.archive_file.python_function_package

  site_config {
    application_stack {
        python_version = "3.10"
    }
  }
}
