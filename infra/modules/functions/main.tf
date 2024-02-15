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

# data "archive_file" "python_function_package" {  
#   type = "zip"  
#   source_file = "${path.module}/../../../api/src/app.py" 
#   output_path = "${path.module}/function.zip"
# }

resource "azurerm_linux_function_app" "backend" {
  name                = "ruut-backend-function-app"
  resource_group_name = var.resource_group_name
  location            = var.location

  storage_account_name       = azurerm_storage_account.backend.name
  storage_account_access_key = azurerm_storage_account.backend.primary_access_key
  service_plan_id            = azurerm_service_plan.backend.id

  # zip_deploy_file = data.archive_file.python_function_package.output_path

  connection_string {
    name  = "COSMOS_CONNECTION_STRING"
    type  = "PostgreSQL"
    value = var.connection_string
  }
  site_config {
    application_stack {
      python_version = "3.10"
    }
  }
}

resource "azurerm_function_app_function" "lagfest_signups" {
  name            = "lagfest-signups-function"
  function_app_id = azurerm_linux_function_app.backend.id
  language        = "Python"

  file {
    name    = "function_app"
    content = file("${path.module}/../../../api/lagfest_signup.py")
  }

  file {
    name    = "requirements"
    content = file("${path.module}/../../../api/requirements.txt")
  }

  config_json = jsonencode({
    "bindings" = [
      {
        "authLevel" = "anonymous"
        "direction" = "in"
        "methods" = [
          "post"
        ]
        "name"  = "lagfest-signup"
        "type"  = "httpTrigger"
        "route" = "lagfest-signup"
      },
      {
        "direction" = "out"
        "name"      = "$return"
        "type"      = "http"
      },
    ]
  })
}
