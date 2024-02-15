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
    name    = "function_app.py"
    content = file("${path.module}/../../../api/lagfest-signup/function_app.py")
  }

  file {
    name    = "requirements.txt"
    content = file("${path.module}/../../../api/lagfest-signup/requirements.txt")
  }

  file {
    name    = "host.json"
    content = file("${path.module}/../../../api/lagfest-signup/host.json")
  }

  config_json = jsonencode({
    "bindings" = [
      {
        "authLevel" = "anonymous"
        "direction" = "in"
        "methods" = [
          "post"
        ]
        "name"  = "req"
        "type"  = "httpTrigger"
        "route" = "lagfestSignup"
      },
      {
        "direction" = "out"
        "name"      = "$return"
        "type"      = "http"
      },
    ]
  })
}
