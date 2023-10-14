terraform {
  required_version = "1.4.6"

  backend "azurerm" {
    resource_group_name  = "tfstate"
    storage_account_name = "tfstate1241434742"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
    use_oidc             = true
  }

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.75"
    }
    azurecaf = {
      source  = "aztfmod/azurecaf"
      version = "~>1.2.26"
    }
  }
}

provider "azurerm" {
  features {}
  use_oidc = true
}
