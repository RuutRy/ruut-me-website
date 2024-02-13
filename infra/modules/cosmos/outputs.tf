output "connection_string" {
    value = azurerm_cosmosdb_account.db.primary_mongodb_connection_string
}