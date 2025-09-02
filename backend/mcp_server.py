from fastmcp import McpServer
from backend.services import shopify_service

mcp_server = McpServer()

mcp_server.add_tool(shopify_service.get_products)
mcp_server.add_tool(shopify_service.create_product)
mcp_server.add_tool(shopify_service.update_product)
mcp_server.add_tool(shopify_service.delete_product)
mcp_server.add_tool(shopify_service.get_product)
