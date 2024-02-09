terraform {
  required_version = "1.4.7"

  backend "azurerm" {
    resource_group_name  = "terrafrom-resorce-group-www"
    storage_account_name = "ruutmewebsitetf"
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
  skip_provider_registration = true
  features {}
  use_oidc = true
}
