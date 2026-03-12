output "primary_connection_string" {
  value     = azurerm_storage_account.cs2-demos.primary_connection_string
  sensitive = true
}

output "container_name" {
  value = azurerm_storage_container.cs2-demos.name
}
