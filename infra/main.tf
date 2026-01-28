
locals {
  tags           = { azd-env-name : var.environment_name, managed-by : "terraform" }
  sha            = base64encode(sha256("${var.environment_name}${var.location}${var.subscription_id}"))
  resource_token = substr(replace(lower(local.sha), "[^A-Za-z0-9_]", ""), 0, 13)
}
# ------------------------------------------------------------------------------------------------------
# Deploy resource Group
# ------------------------------------------------------------------------------------------------------
resource "azurecaf_name" "rg_name" {
  name          = var.environment_name
  resource_type = "azurerm_resource_group"
  random_length = 0
  clean_input   = true
}


resource "azurerm_resource_group" "rg" {
  name     = azurecaf_name.rg_name.result
  location = var.location

  tags = local.tags
}

# ------------------------------------------------------------------------------------------------------
# Static website storage
# ------------------------------------------------------------------------------------------------------

module "storage_react" {
  source = "./modules/storage-react"

  env                 = "production"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name

}

# ------------------------------------------------------------------------------------------------------
# Cosmos db
# ------------------------------------------------------------------------------------------------------

module "cosmos" {
  source = "./modules/cosmos"

  resource_group_name = azurerm_resource_group.rg.name
  location            = var.location

}

# ------------------------------------------------------------------------------------------------------
# Function app
# ------------------------------------------------------------------------------------------------------

module "function" {
  source = "./modules/functions"

  resource_group_name = azurerm_resource_group.rg.name
  location            = var.location
  connection_string   = module.cosmos.connection_string

  depends_on = [
    module.cosmos
  ]

}
